<?php

namespace App\Http\Services;

use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage as FacadesStorage;

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

            // config()ヘルパーで設定値を取得
            $timeout = config('services.openai.timeout'); // 40秒
            $connectTimeout = config('services.openai.connect_timeout'); // 10秒

            $response = Http::timeout($timeout)
                ->connectTimeout($connectTimeout)
                ->withHeaders([
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

            $errorMessage = $response->json()['error']['message'] ?? '音声の文字起こしに失敗しました。';
            throw new \Exception($errorMessage);
        } catch (ConnectionException $e) {
            Log::error('Whisper API Timeout', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('音声の処理がタイムアウトしました。もう一度お試しください。');
        } catch (RequestException $e) {
            Log::error('Whisper API Request Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('APIリクエストに失敗しました。もう一度お試しください。');
        } catch (\Exception $e) {
            Log::error('Whisper API Exception', [
                'message' => $e->getMessage(),
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


            // config()ヘルパーで設定値を取得
            $timeout = config('services.openai.timeout'); // 40秒
            $connectTimeout = config('services.openai.connect_timeout'); // 10秒

            $systemMessage = [
                'role' => 'system',
                'content' => $language->text_prompt . $promptDescription
            ];

            $modelMessages = $modelMessages->map(fn($message) => [
                'role' => $message->sender === 1 ? 'user' : 'assistant',
                'content' => $message->content
            ])->toArray();

            $mergedMessages = array_merge([$systemMessage], $modelMessages);

            $response = Http::timeout($timeout)
                ->connectTimeout($connectTimeout)
                ->withHeaders([
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

            $errorMessage = $response->json()['error']['message'] ?? 'ChatGPTからの応答に失敗しました。';
            throw new \Exception($errorMessage);
        } catch (ConnectionException $e) {
            Log::error('ChatGPT API Timeout', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('応答がタイムアウトしました。もう一度お試しください。');
        } catch (RequestException $e) {
            Log::error('ChatGPT API Request Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('APIリクエストに失敗しました。もう一度お試しください。');
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
            // config()ヘルパーで設定値を取得
            $timeout = config('services.openai.timeout'); // 40秒
            $connectTimeout = config('services.openai.connect_timeout'); // 10秒

            $response = Http::timeout($timeout)
                ->connectTimeout($connectTimeout)
                ->withToken(config('services.openai.api_key'))
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

            Log::info('Attempting to save file', [
                'output_path' => $outputPath,
                'storage_path' => storage_path("app/public/{$outputPath}"),
                'directory_exists' => FacadesStorage::disk('public')->exists('ai_audio'),
            ]);


            Log::error('TTS API Error', [
                'status_code' => $response->status(),
                'error_response' => $response->json(),
                'input_text' => $aiMessageText,
                'headers' => $response->headers()
            ]);

            $errorMessage = $response->json()['error']['message'] ?? 'ChatGPTからの応答に失敗しました。';
            throw new \Exception($errorMessage);
        } catch (ConnectionException $e) {
            Log::error('ChatGPT API Timeout', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('応答がタイムアウトしました。もう一度お試しください。');
        } catch (RequestException $e) {
            Log::error('ChatGPT API Request Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('APIリクエストに失敗しました。もう一度お試しください。');
        } catch (\Exception $e) {
            Log::error('ChatGPT API Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function callTranslationApi(string $content, string $translate_prompt): array
    {
        try {

            $timeout = config('services.openai.timeout'); // 40秒
            $connectTimeout = config('services.openai.connect_timeout'); // 10秒


            $systemMessage = [
                'role' => 'system',
                'content' => $translate_prompt
            ];

            $modelMessages = [
                [
                    'role' => 'user',
                    'content' => $content
                ]
            ];

            $mergedMessages = array_merge([$systemMessage], $modelMessages);

            $response = Http::timeout($timeout)
                ->connectTimeout($connectTimeout)
                ->withHeaders([
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

            $errorMessage = $response->json()['error']['message'] ?? 'ChatGPTからの応答に失敗しました。';
            throw new \Exception($errorMessage);
        } catch (ConnectionException $e) {
            Log::error('ChatGPT API Timeout', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('応答がタイムアウトしました。もう一度お試しください。');
        } catch (RequestException $e) {
            Log::error('ChatGPT API Request Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('APIリクエストに失敗しました。もう一度お試しください。');
        } catch (\Exception $e) {
            Log::error('ChatGPT API Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
