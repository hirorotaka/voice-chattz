<?php

namespace Database\Seeders;

use App\Models\Message;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 5つのスレッドを作成する
        for ($i = 0; $i < 5; $i++) {
            // 送信者を交互にする
            $sender = $i % 2 == 0 ? 1 : 2;

            Message::create([
                'thread_id' => 1,
                'content' => 'hello world-' . ($i + 1),
                'message_ja' => '日本語メッセージ' . ($i + 1),
                'sender' => $sender,
                'audio_file_path' => '/audios/message' . ($i + 1) . '.mp3',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
