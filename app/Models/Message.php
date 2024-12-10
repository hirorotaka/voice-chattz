<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    /**
     * 更新時に触れる必要のある親のリレーション
     *
     * @var array
     */
    protected $touches = ['thread'];


    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    protected $fillable = [
        'thread_id',
        'content',
        'message_ja',
        'sender',
        'audio_file_path',
    ];
}
