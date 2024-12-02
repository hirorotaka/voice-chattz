<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ApiService
{
    /**
     * WhisperAPIを使用して音声をテキストに変換する
     *
     * @param string $audioFilePath 音声ファイルのパス
     * @return string|null 文字起こしされたテキスト
     * @throws \Exception API呼び出しに失敗した場合
     */
    public function callWhisperApi($audioFilePath)
    {
        // curlでの呼び出し方
        // curl https://api.openai.com/v1/audio/transcriptions \
        // -H "Authorization: Bearer $OPENAI_API_KEY" \
        // -H "Content-Type: multipart/form-data" \
        // -F file="@/path/to/file/audio.mp3" \
        // -F model="whisper-1"


        try {
            // 保存されたファイルのフルパスを取得
            $fullPath = storage_path('app/public/' . $audioFilePath);

            // Content-Type ヘッダーは不要（Http::attachが自動で適切なヘッダーを設定します）
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openai.api_key'), // configを使用
            ])->attach(
                'file',
                file_get_contents($fullPath), // fopen ではなく file_get_contents を使用
                basename($fullPath), // 実際のファイル名を使用
            )->post('https://api.openai.com/v1/audio/transcriptions', [
                'model' => 'whisper-1',
                'language' => 'en',
            ]);

            if ($response->successful()) {
                Log::info('Whisper API Response', [
                    'status' => $response->status(),
                    'text' => $response->json('text')
                ]);
                return $response->json();
            }

            // エラーの詳細をログに記録
            Log::error('Whisper API Error', [
                'status' => $response->status(),
                'body' => $response->json(),
                'filepath' => $fullPath
            ]);

            throw new \Exception('音声の文字起こしに失敗しました。');
        } catch (\Exception $e) {
            Log::error('Whisper API Exception', [
                'message' => $e->getMessage(),
                'file' => $audioFilePath,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     *@param Collection<Message> $messages
     *
     *
     */
    public function callChatGPTApi($modelMessages)
    {
        // 呼び出し方
        // curl https://api.openai.com/v1/chat/completions \
        //     -H "Content-Type: application/json" \
        //     -H "Authorization: Bearer $OPENAI_API_KEY" \
        //     -d '{
        //         "model": "gpt-4o-mini",
        //         "messages": [
        //         {
        //             "role": "system",
        //             "content": "You are a helpful assistant."
        //         },
        //         {
        //             "role": "user",
        //             "content": "Hello!"
        //         }
        //         ]
        //     }'

        try {
            $systemMessage = [
                'role' => 'system',
                'content' => 'You are a helpful English teacher. Please speak in English.'
            ];

            $modelMessages = $modelMessages->map(fn($message) => [
                'role' => $message->sender === 1 ? 'user' : 'assistant',
                'content' => $message->message_en
            ])->toArray();

            $mergedMessages = array_merge([$systemMessage], $modelMessages);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openai.api_key'),
                'Content-Type' => 'application/json'
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => $mergedMessages,
            ]);

            if ($response->successful()) {
                Log::info('ChatGPT API Response', [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                return $response->json();
            }

            // エラーの詳細をログに記録
            Log::error('ChatGPT API Error', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            throw new \Exception('ChatGPTからの応答に失敗しました。');
        } catch (\Exception $e) {
            Log::error('ChatGPT API Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
