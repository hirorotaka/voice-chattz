<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\ThreadController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/top', [ThreadController::class, 'index'])->name('top');

    Route::prefix('thread')->group(function () {
        Route::post('/', [ThreadController::class, 'store'])->name('thread.store');
        Route::prefix('{thread}')->group(function () {
            Route::get('/', [ThreadController::class, 'show'])
                ->middleware('can:view,thread')
                ->name('thread.show');

            Route::put('/', [ThreadController::class, 'update'])
                ->middleware('can:update,thread')
                ->name('thread.update');

            Route::delete('/', [ThreadController::class, 'destroy'])
                ->middleware('can:delete,thread')
                ->name('thread.destroy');

            Route::post('/favorite', [ThreadController::class, 'toggleFavorite'])->name('thread.toggleFavorite');

            Route::post('/message', [MessageController::class, 'store'])->name('message.store');
        });
    });
});
