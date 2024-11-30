<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    //
    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    protected $fillable = [
        'thread_id',
        'message_en',
        'message_ja',
        'sender',
    ];
}
