<?php

namespace App\Http\Controllers;

use App\Http\Services\ApiService;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, int $threadId)
    {
        // 音声データを保存する
        if ($request->hasFile('audio')) {
            $audio = $request->file('audio');
            // ファイル名を日時を基に作成
            $timestamp = now()->format('YmdHis');
            $path = $audio->storeAs('audio', "audio_{$timestamp}.wav", 'public');

            // 音声データを保存する
            $message = Message::create(
                [
                    'thread_id' => $threadId,
                    'message_en' => "dummy",
                    'message_ja' => "",
                    'audio_file_path' => $path,
                    'sender' => 1,
                ]
            );

            // chatGPTに音声データをAPIに送信する
            $apiService = new ApiService();
            $response = $apiService->callWhisperApi($path);
            $message_en = $response['text'];
            // APIレスポンスを音声データを保存する
            $message->update(['message_en' => $message_en]);

            $messages = Message::where('thread_id', $threadId)->get();

            // chatGPTに返ってきたメッセージで、APIリクエストする。
            $gptResponse = $apiService->callChatGptApi($messages);
            $aiMessageText = $gptResponse['choices'][0]['message']['content'];

            //DBにAIのメッセージを保存
            $aiMessage = Message::create(
                [
                    'thread_id' => $threadId,
                    'message_en' => "$aiMessageText",
                    'message_ja' => "",
                    'audio_file_path' => '',
                    'sender' => 2,
                ]
            );

            // TTSにリクエストする
            $aiAudioFilePath = $apiService->callTtsApi($aiMessageText);
            // APIレスポンスを音声データパスを保存する
            $aiMessage->update(['audio_file_path' => $aiAudioFilePath]);

            // Inertia.jsのレスポース形式で返す
            return back()->with([
                'success' => '音声データを保存しました。',
                'message_id' => $message->id
            ]);
        }
        return back()->with('error', '音声ファイルが保存されませんでした。');
    }
}
