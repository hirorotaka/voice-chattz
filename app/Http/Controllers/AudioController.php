<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AudioController extends Controller
{
    public function getAudioUrl(Message $message)
    {
        // ユーザーがこの音声にアクセスする権限があるか確認
        if (!Auth::check() || !$this->canAccessAudio($message)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // 署名付きURLを生成（30分間有効）
        try {
            $temporaryUrl = Storage::disk('s3')->temporaryUrl(
                $message->audio_file_path,
                now()->addMinutes(30)
            );

            return response()->json([
                'url' => $temporaryUrl,
                'message_id' => $message->id
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate URL'], 500);
        }
    }

    private function canAccessAudio(Message $message)
    {
        return $message->thread->user_id === Auth::id();
    }
}
