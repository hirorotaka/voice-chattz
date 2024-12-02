<?php

namespace App\Http\Controllers;

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
        }
    }
}
