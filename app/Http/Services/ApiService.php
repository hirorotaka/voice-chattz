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
            $fullPath = storage_path('app/public/' . $audioFilePath);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openai.api_key'),
            ])->attach(
                'file',
                file_get_contents($fullPath),
                basename($fullPath),
            )->post('https://api.openai.com/v1/audio/transcriptions', [
                'model' => 'whisper-1',
                'language' => 'ja',
                'prompt' => 'あなたのタスクは、音声データから人間の発話を書き起こすことです。もし人間の発話が検出された場合：音声を日本語のテキストに変換してください。もし人間の発話が検出されなかった場合：「無音です」と報告してください。「無音」とは、人間の音声以外の音（ノイズ、音楽、無音状態など）を指します。',
                'no_speech_threshold' => 0.9, // API側の無音判定閾値
                'response_format' => 'verbose_json', // 詳細なJSONレスポンスを取得
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $segments = $result['segments'];

                $text = "";
                foreach ($segments as $segment) {
                    // セグメントごとの無音確率をチェック
                    if ($segment['no_speech_prob'] < 0.3) {
                        $text .= $segment['text'];
                    }
                }

                // 文字が１文字以上あるかをチェック
                if (mb_strlen(trim($text)) <= 1) {
                    $text = "noSound";
                }


                Log::info('Whisper API Response', [
                    'status' => $response->status(),
                    'text' => $text
                ]);

                return ['text' => $text];
            }

            // エラー処理は変更なし
            Log::error('Whisper API Error', [/* ... */]);
            throw new \Exception('音声の文字起こしに失敗しました。');
        } catch (\Exception $e) {
            // エラー処理は変更なし
            Log::error('Whisper API Exception', [/* ... */]);
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
                'content' => 'あなたは役に立つアシスタントです。日本語で会話をしてください。200文字程度で返信してください。また会話口調でやりとりしながら回答してください。事例は２つ程度でお願いします。'
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

    /**
     *@param string $aiMessageText
     *
     *
     */
    public function callTtsApi(string $aiMessageText)
    {
        // 呼び出し方
        //curl https://api.openai.com/v1/audio/speech \
        // -H "Authorization: Bearer $OPENAI_API_KEY" \
        // -H "Content-Type: application/json" \
        // -d '{
        //     "model": "tts-1",
        //     "input": "The quick brown fox jumped over the lazy dog.",
        //     "voice": "alloy"
        // }' \
        // --output speech.mp3

        try {
            $response = Http::withToken(config('services.openai.api_key'))
                ->withHeaders([
                    'Content-Type' => 'application/json'
                ])
                ->post('https://api.openai.com/v1/audio/speech', [
                    'model' => 'tts-1',
                    'input' => $aiMessageText,
                    'voice' => 'nova',
                    'response_format' => 'wav'
                ]);

            $timestamp = now()->format('YmdHis');
            $outputPath = "ai_audio/tts_{$timestamp}.wav";
            // storage/app/public/audio ディレクトリへのフルパスを取得
            $fullPath = storage_path("app/public/{$outputPath}");
            file_put_contents($fullPath, $response->body());

            if ($response->successful()) {
                Log::info('TTS API Response', [
                    'status' => $response->status(),
                    'file_path' => $outputPath
                ]);
                return $outputPath;
            }


            Log::error('TTS API Error', [
                'status_code' => $response->status(),
                'error_response' => $response->json(),
                'input_text' => $aiMessageText,
                'headers' => $response->headers()
            ]);

            throw new \Exception('音声生成に失敗しました。');
        } catch (\Exception $e) {
            Log::error('TTS API Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'input_text' => $aiMessageText
            ]);

            throw $e;
        }
    }
}
