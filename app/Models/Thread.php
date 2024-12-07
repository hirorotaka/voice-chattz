<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Thread extends Model
{
    /** @use HasFactory<\Database\Factories\ThreadFactory> */
    use HasFactory;

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function prompt(): HasOne
    {
        return $this->hasOne(Prompt::class);
    }

    protected  $fillable = [
        'title',
        'user_id',
        'language_id'
    ];
}
