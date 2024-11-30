<?php

use App\Http\Controllers\ThreadController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/top', [ThreadController::class, 'index'])->name('top');
    Route::get('/thread/{thread}', [ThreadController::class, 'show'])->name('thread.show');
});
