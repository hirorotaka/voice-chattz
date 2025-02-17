<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    /** @use HasFactory<\Database\Factories\RoleFactory> */
    use HasFactory;

    public function threads()
    {
        return $this->hasMany(Message::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }

    protected $casts = [
        'users.pivot.is_using' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withPivot('owner', 'is_using')->withTimestamps();
    }


    protected $fillable = [
        'name',
        'first_message',
        'description',
        'language_id',
        'is_public',
    ];
}
