<?php

use App\Http\Controllers\ThreadController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/top', [ThreadController::class, 'index'])->name('top');

    Route::post('/thread', [ThreadController::class, 'store'])
        ->name('thread.store');

    Route::get('/thread/{thread}', [ThreadController::class, 'show'])
        ->middleware('can:view,thread')
        ->name('thread.show');

    Route::delete('/thread/{thread}', [ThreadController::class, 'destroy'])
        ->middleware('can:delete,thread')
        ->name('thread.destroy');
});
