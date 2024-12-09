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
        $languages = [
            [
                'locale' => 'en',
                'name' => 'English',
                'text_prompt' => trans('prompts.text', [], 'en'),
                'audio_prompt' => trans('prompts.audio', [], 'en'),
            ],
            [
                'locale' => 'ja',
                'name' => '日本語',
                'text_prompt' => trans('prompts.text', [], 'ja'),
                'audio_prompt' => trans('prompts.audio', [], 'ja'), //言語ファイルにアクセスするために必要
            ],
            [
                'locale' => 'ko',
                'name' => '한국어',
                'text_prompt' => trans('prompts.text', [], 'ko'),
                'audio_prompt' => trans('prompts.audio', [], 'ko'),
                'updated_at' => now(),
            ],
        ];

        foreach ($languages as $language) {
            DB::table('languages')->updateOrInsert(
                ['locale' => $language['locale']],
                $language
            );
        }
    }
}
