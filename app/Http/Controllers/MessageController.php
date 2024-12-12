<?php

namespace App\Http\Controllers;

use App\Http\Services\ApiService;
use App\Models\Message;
use App\Models\Thread;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    public function store(Request $request, int $threadId)
    {
        try {

            // 音声ファイルの存在チェック
            if (!$request->hasFile('audio')) {
                return back()->with('error', '音声ファイルを選択してください。');
            }

            $audio = $request->file('audio');

            // 音声ファイルのバリデーション
            if (!$audio->isValid()) {
                return back()->with('error', '音声ファイルのアップロードに失敗しました。もう一度お試しください。');
            }

            // ファイルサイズチェック
            if ($audio->getSize() > 10 * 1024 * 1024) {
                return back()->with('error', '音声ファイルが大きすぎます（上限10MB）。shorter録音をお願いします。');
            }

            // スレッドと言語情報の取得
            $language = Thread::findOrFail($threadId)->language;

            // 音声ファイルの保存
            $timestamp = now()->format('YmdHis');
            $path = $audio->storeAs('audio', "audio_{$timestamp}.wav", 'public');

            // Whisper APIの呼び出し
            try {

                $apiService = new ApiService();

                // APIサービスの処理を開始する前にログ
                Log::debug('API処理開始', [
                    'thread_id' => $threadId,
                    'path' => $path,
                    'language' => $language
                ]);
                $response = $apiService->callWhisperApi($path, $language);

                // レスポンスの詳細をログ
                Log::debug('APIレスポンス', [
                    'response' => $response,
                    'thread_id' => $threadId
                ]);

                if (!isset($response['text'])) {
                    Log::error('Whisper API テキスト未取得', [
                        'thread_id' => $threadId,
                        'response' => $response
                    ]);
                    throw new \Exception('音声の認識に失敗しました。');
                }

                // 無音の場合
                if ($response['text'] === 'noSound') {
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                    return back()->with('error', '無音でした。もう一度録音してください。');
                }
            } catch (ConnectionException $e) {
                Log::error('Whisper API タイムアウト', [
                    'thread_id' => $threadId,
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]);
                // タイムアウトエラー
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
                return back()->with('error', '音声の処理に時間がかかりすぎました。もう一度お試しください。');
            } catch (\Exception $e) {
                Log::error('Whisper API エラー詳細', [
                    'thread_id' => $threadId,
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]);
                // その他のAPIエラー
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
                Log::error('Whisper API Error', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId
                ]);
                return back()->with('error', '音声の処理中にエラーが発生しました。しばらく待ってからもう一度お試しください。');
            }

            // メッセージの保存
            try {
                $message = Message::create([
                    'thread_id' => $threadId,
                    'content' => $response['text'],
                    'message_ja' => "",
                    'audio_file_path' => $path,
                    'sender' => 1,
                ]);

                return back()->with([
                    'success' => true,
                    'flashData' => $threadId
                ]);
            } catch (\Exception $e) {
                // データベースエラー
                Log::error('Message Creation Error', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId
                ]);

                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }

                return back()->with('error', 'メッセージの保存に失敗しました。もう一度お試しください。');
            }
        } catch (\Exception $e) {
            // 予期せぬエラー
            Log::error('Unexpected Error', [
                'message' => $e->getMessage(),
                'thread_id' => $threadId
            ]);
            return back()->with('error', '予期せぬエラーが発生しました。もう一度お試しください。');
        }
    }

    // AIメッセージを生成するエンドポイント
    public function generateAiResponse(int $threadId)
    {
        try {
            // スレッドとその関連データを取得
            try {
                $thread = Thread::with(['language', 'prompt'])->findOrFail($threadId);
                $messages = Message::where('thread_id', $threadId)->get();
            } catch (\Exception $e) {
                Log::error('Thread/Message Fetch Error', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId
                ]);
                return back()->with('error', 'データの取得に失敗しました。');
            }

            $promptDescription = $thread->prompt?->description ?? '';
            $apiService = new ApiService();

            // ChatGPT APIでAI応答を生成
            try {
                $gptResponse = $apiService->callChatGptApi(
                    modelMessages: $messages,
                    language: $thread->language,
                    promptDescription: $promptDescription
                );

                if (!isset($gptResponse['choices'][0]['message']['content'])) {
                    throw new \Exception('AIレスポンスの形式が不正です。');
                }

                $aiMessageText = $gptResponse['choices'][0]['message']['content'];
            } catch (ConnectionException $e) {
                Log::error('ChatGPT API Timeout', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId
                ]);
                return back()->with('error', 'AIの応答がタイムアウトしました。もう一度お試しください。');
            } catch (\Exception $e) {
                Log::error('ChatGPT API Error', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId
                ]);
                return back()->with('error', 'AI応答の生成中にエラーが発生しました。しばらく待ってからお試しください。');
            }

            // TTSでAIの音声を生成
            try {
                $aiAudioFilePath = $apiService->callTtsApi($aiMessageText);
            } catch (ConnectionException $e) {
                Log::error('TTS API Timeout', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId
                ]);
                return back()->with('error', '音声生成がタイムアウトしました。もう一度お試しください。');
            } catch (\Exception $e) {
                Log::error('TTS API Error', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId
                ]);
                return back()->with('error', '音声の生成中にエラーが発生しました。しばらく待ってからお試しください。');
            }

            // AIメッセージを保存
            try {
                $aiMessage = Message::create([
                    'thread_id' => $threadId,
                    'content' => $aiMessageText,
                    'message_ja' => "",
                    'audio_file_path' => $aiAudioFilePath,
                    'sender' => 2,
                ]);

                return back()->with([
                    'success' => '処理が完了しました。',
                    'flashData' => $aiMessage->id
                ]);
            } catch (\Exception $e) {
                // 音声ファイルの削除
                if (Storage::disk('public')->exists($aiAudioFilePath)) {
                    Storage::disk('public')->delete($aiAudioFilePath);
                }

                Log::error('AI Message Creation Error', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId
                ]);
                return back()->with('error', 'メッセージの保存に失敗しました。もう一度お試しください。');
            }
        } catch (\Exception $e) {
            Log::error('Unexpected Error in AI Response Generation', [
                'message' => $e->getMessage(),
                'thread_id' => $threadId
            ]);
            return back()->with('error', '予期せぬエラーが発生しました。もう一度お試しください。');
        }
    }

    // 日本語に翻訳する
    // 日本語に翻訳する
    public function translateToJapanese(Request $request, int $threadId, int $messageId)
    {
        try {
            // メッセージとスレッド情報の取得
            try {
                $message = Message::findOrFail($messageId);
                $language = Thread::findOrFail($threadId)->language;
            } catch (ModelNotFoundException $e) {
                Log::error('Message/Thread Fetch Error', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId,
                    'message_id' => $messageId
                ]);
                return back()->with('error', 'データの取得に失敗しました。');
            }

            // 既に翻訳済みの場合
            if ($message->message_ja) {
                return back()->with('error', '既に翻訳済みです。');
            }

            if (empty($message->content)) {
                return back()->with('error', '翻訳する内容が見つかりません。');
            }

            // 翻訳APIの呼び出し
            try {
                $apiService = new ApiService();
                $response = $apiService->callTranslationApi(
                    content: $message->content,
                    translate_prompt: $language->translate_prompt
                );

                if (!isset($response['choices'][0]['message']['content'])) {
                    throw new \Exception('翻訳APIのレスポンス形式が不正です。');
                }
            } catch (ConnectionException $e) {
                Log::error('Translation API Timeout', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId,
                    'message_id' => $messageId
                ]);
                return back()->with('error', '翻訳処理がタイムアウトしました。もう一度お試しください。');
            } catch (\Exception $e) {
                Log::error('Translation API Error', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId,
                    'message_id' => $messageId
                ]);
                return back()->with('error', '翻訳中にエラーが発生しました。しばらく待ってからお試しください。');
            }

            // 翻訳結果の保存
            try {
                $message->message_ja = $response['choices'][0]['message']['content'];
                $message->save();

                return back()->with([
                    'success' => '翻訳が完了しました。'
                ]);
            } catch (\Exception $e) {
                Log::error('Translation Save Error', [
                    'message' => $e->getMessage(),
                    'thread_id' => $threadId,
                    'message_id' => $messageId
                ]);
                return back()->with('error', '翻訳結果の保存に失敗しました。もう一度お試しください。');
            }
        } catch (\Exception $e) {
            Log::error('Unexpected Error in Translation', [
                'message' => $e->getMessage(),
                'thread_id' => $threadId,
                'message_id' => $messageId
            ]);
            return back()->with('error', '予期せぬエラーが発生しました。もう一度お試しください。');
        }
    }
}
