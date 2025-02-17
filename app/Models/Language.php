<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    /** @use HasFactory<\Database\Factories\LanguageFactory> */
    use HasFactory;

    public function threads()
    {
        return $this->hasMany(Message::class);
    }
    public function roles()
    {
        return $this->hasMany(Role::class);
    }
}
