<?php

namespace App\Http\Controllers;

use App\Http\Services\ApiService;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, int $threadId)
    {

        if (!$request->hasFile('audio')) {
            return back()->with('error', '音声ファイルが保存されませんでした。');
        }

        // 音声データを保存する
        $audio = $request->file('audio');
        // ファイル名を日時を基に作成
        $timestamp = now()->format('YmdHis');
        $path = $audio->storeAs('audio', "audio_{$timestamp}.wav", 'public');

        // chatGPTに音声データをAPIに送信する
        $apiService = new ApiService();
        $response = $apiService->callWhisperApi($path);
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

        $apiService = new ApiService();
        // ChatGPT APIでAI応答を生成
        $gptResponse = $apiService->callChatGptApi($messages);
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
}
