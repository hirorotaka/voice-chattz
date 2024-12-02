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
            $text = $apiService->callWhisperApi($path);

            // APIレスポンスを音声データを保存する

            // Inertia.jsのレスポース形式で返す
            return back()->with([
                'success' => '音声データを保存しました。',
                'message_id' => $message->id
            ]);
        }
        return back()->with('error', '音声ファイルが保存されませんでした。');
    }
}
