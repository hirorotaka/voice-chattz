<?php

namespace Database\Seeders;

use App\Models\Thread;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ThreadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 5つのスレッドを作成する
        for ($i = 0; $i < 5; $i++) {
            Thread::create([
                'user_id' => 1,
                'title' => 'スレッドタイトル' . ($i + 1),
                'language_id' => 1
            ]);
        }
    }
}
