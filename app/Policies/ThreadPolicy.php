<?php

namespace App\Policies;

use App\Models\Language;
use App\Models\Role;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ThreadPolicy
{
    /**
     * スレッドの作成権限
     */
    public function create(User $user, array $attributes = []): bool|Role
    {
        // language_idの検証
        if (
            !isset($attributes['language_id']) ||
            !Language::where('id', $attributes['language_id'])->exists()
        ) {
            return false;
        }

        // role_idが指定されている場合のみ検証
        if (!empty($attributes['role_id'])) {
            $role = Role::find($attributes['role_id']);

            // ロールが存在しないか、ユーザーがそのロールを持っていない場合
            if (!$role || !$user->roles()->where('role_id', $attributes['role_id'])->exists()) {
                return false;
            }

            return $role;  // ロールオブジェクトを返す
        }

        return true;
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
