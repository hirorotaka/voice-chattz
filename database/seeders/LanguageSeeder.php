<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('languages')->insert([
            [
                'locale' => 'en',
                'name' => 'English',
                'text_prompt' => 'You are a helpful assistant. Please converse in English. Keep your responses within 300 words.',
                'audio_prompt' => 'Your task is to transcribe human speech from audio data. If human speech is detected: convert the audio to English text. If no human speech is detected: report "No sound". "No sound" refers to any non-human voice sounds (noise, music, silence, etc.).'
            ],
            [
                'locale' => 'ja',
                'name' => '日本語',
                'text_prompt' => 'あなたは役に立つアシスタントです。日本語で会話をしてください。300字以内で回答してください。',
                'audio_prompt' => 'あなたのタスクは、音声データから人間の発話を書き起こすことです。もし人間の発話が検出された場合：音声を日本語のテキストに変換してください。もし人間の発話が検出されなかった場合：「無音です」と報告してください。「無音」とは、人間の音声以外の音（ノイズ、音楽、無音状態など）を指します。'
            ],
        ]);
    }
}
