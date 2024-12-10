<?php

namespace App\Http\Controllers;

use App\Http\Services\ApiService;
use App\Models\Message;
use App\Models\Thread;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, int $threadId)
    {

        if (!$request->hasFile('audio')) {
            return back()->with('error', '音声ファイルが保存されませんでした。');
        }

        // スレッドに紐づく言語情報を取得
        $language = Thread::findOrFail($threadId)->language;

        // 音声データを保存する
        $audio = $request->file('audio');
        // ファイル名を日時を基に作成
        $timestamp = now()->format('YmdHis');
        $path = $audio->storeAs('audio', "audio_{$timestamp}.wav", 'public');

        // chatGPTに音声データをAPIに送信する
        $apiService = new ApiService();
        $response = $apiService->callWhisperApi($path, $language);

        if (!isset($response['text']) || $response['text'] === 'noSound') {
            return back()->with('flashData', 'noSound');
        }

        $message_en = $response['text'];

        // 音声データを保存する
        $message = Message::create(
            [
                'thread_id' => $threadId,
                'message_en' => $message_en,
                'message_ja' => "",
                'audio_file_path' => $path,
                'sender' => 1,
            ]
        );

        // Inertia.jsのレスポース形式で返す
        return back()->with([
            'success' => true,
            'flashData' => $threadId
        ]);
    }

    // AIメッセージを生成するエンドポイント
    public function generateAiResponse(int $threadId)
    {
        $messages = Message::where('thread_id', $threadId)->get();

        // スレッドとその関連データを取得
        $thread = Thread::with(['language', 'prompt'])->findOrFail($threadId);

        // プロンプト情報を取得（ない場合はデフォルト設定を使用）
        $promptDescription = $thread->prompt?->description ?? '';

        $apiService = new ApiService();
        // ChatGPT APIでAI応答を生成
        $gptResponse = $apiService->callChatGptApi(
            modelMessages: $messages,
            language: $thread->language,
            promptDescription: $promptDescription
        );
        $aiMessageText = $gptResponse['choices'][0]['message']['content'];

        // TTSでAIの音声を生成
        $aiAudioFilePath = $apiService->callTtsApi($aiMessageText);

        // AIメッセージを保存
        $aiMessage = Message::create([
            'thread_id' => $threadId,
            'message_en' => $aiMessageText,
            'message_ja' => "",
            'audio_file_path' => $aiAudioFilePath,
            'sender' => 2,
        ]);


        return back()->with([
            'success' => '処理が完了しました。',
            'flashData' => $aiMessage->id
        ]);
    }

    // 日本語に翻訳する
    public function translateToJapanese(Request $request, int $threadId, int $messageId)
    {

        $message = Message::findOrFail($messageId);

        $language = Thread::findOrFail($threadId)->language;

        if ($message->message_ja) {
            return back()->with([
                'error' => '処理が完了しました。',
            ]);
        }

        $message_en = $message->message_en;
        $translate_prompt = $language->translate_prompt;

        $apiService = new ApiService();
        $response = $apiService->callTranslationApi($message_en, $translate_prompt);

        // 翻訳結果を保存する
        $message->message_ja = $response['choices'][0]['message']['content'];
        $message->save();

        return back()->with([
            'success' => '処理が完了しました。',
        ]);
    }
}
