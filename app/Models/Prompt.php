<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prompt extends Model
{
    protected $fillable = [
        'name',
        'description',
        'thread_id'
    ];


    public function thread(): BelongsTo
    {
        return $this->belongsTo(Thread::class);
    }
}
