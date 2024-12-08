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
    public function callWhisperApi($audioFilePath, $language)
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
                'language' => $language->locale,
                'prompt' => $language->audio_prompt,
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
    public function callChatGPTApi($modelMessages, $language, $promptDescription)
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
                'content' => $language->text_prompt . $promptDescription
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

    public function callTranslationApi(string $message_en): array
    {
        try {
            $systemMessage = [
                'role' => 'system',
                'content' => "You are a professional translator with expertise in English to Japanese translation.

                Your task:
                - Translate the English input into natural, fluent Japanese
                - Maintain the original tone and nuance of the text
                - Use appropriate levels of formality (尊敬語, 謙譲語, 丁寧語 when needed)
                - Ensure cultural context and idioms are properly localized
                - Keep honorific expressions consistent
                - Preserve any technical terms with their correct Japanese equivalents
                - Follow Japanese punctuation rules (。、「」etc.)

                Guidelines:
                - Output ONLY the Japanese translation
                - Do not provide explanations or the original text
                - Do not add notes or alternatives
                - Maintain any formatting from the original text
                - Keep paragraph breaks and line spacing intact

                Remember: Your goal is to make the translation sound as if it was originally written in Japanese."
            ];

            $modelMessages = [
                [
                    'role' => 'user',
                    'content' => $message_en
                ]
            ];

            $mergedMessages = array_merge([$systemMessage], $modelMessages);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openai.api_key'),
                'Content-Type' => 'application/json'
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4o-mini',
                'messages' => $mergedMessages,
            ]);

            if ($response->successful()) {
                Log::info('Translation API Response', [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                return $response->json();
            }

            // エラーの詳細をログに記録
            Log::error('Translation API Error', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            throw new \Exception('翻訳APIからの応答に失敗しました。');
        } catch (\Exception $e) {
            Log::error('Translation API Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
