<?php

namespace App\Policies;

use App\Models\Thread;
use App\Models\User;

class ThreadPolicy
{
    /**
     * スレッドの作成権限
     */
    public function create(User $user): bool
    {
        return true; // 認証済みユーザーは誰でも作成可能
    }

    /**
     * スレッドの閲覧権限
     */
    public function view(User $user, Thread $thread): bool
    {
        return $user->id === $thread->user_id;
    }
    /**
     * スレッドの閲覧権限
     */
    public function update(User $user, Thread $thread): bool
    {
        return $user->id === $thread->user_id;
    }

    /**
     * スレッドの削除権限
     */
    public function delete(User $user, Thread $thread): bool
    {
        return $user->id === $thread->user_id;
    }
}
