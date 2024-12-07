<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $roles = [
            [
                'name' => 'プログラマー',
                'first_message' => 'こんにちは！私はプログラミングが得意なAIです。どんなプログラムを作りたいですか？',
                'description' => '様々なプログラミング言語で、あなたの要望に沿ったプログラムを作成します。',
                'language_id' => '2',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'ライター',
                'first_message' => 'はじめまして！私は文章を書くのが得意なAIです。どんな記事を書きたいですか？',
                'description' => 'ブログ記事、小説、詩など、様々なジャンルの文章を作成できます。',
                'language_id' => '2',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Translator',
                'first_message' => 'Hello! I am an AI who is good at translation. What language do you want to translate?',
                'description' => 'Capable of translating between various languages including English, Japanese, and Chinese.',
                'language_id' => '1',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => '詩人',
                'first_message' => 'こんにちは。私は詩を書くAIです。あなたの心に響く詩を詠みます。',
                'description' => '美しい言葉で、あなたの心を表現する詩を創作します。',
                'language_id' => '2',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => '作曲家',
                'first_message' => 'どうも！私は作曲ができるAIです。どんな音楽を作りたいですか？',
                'description' => '様々なジャンルの音楽を制作できます。',
                'language_id' => '2',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($roles as $roleData) {
            $role = Role::create($roleData);

            // 例：最初のユーザーにロールを割り当て
            User::first()->roles()->attach($role->id, ['owner' => true]);
        }
    }
}
