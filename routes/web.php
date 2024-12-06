<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ThreadController;
use App\Models\Role;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/', [ThreadController::class, 'index'])->name('top');

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

            // routes/web.php
            Route::post('/message/generate-ai-response', [MessageController::class, 'generateAiResponse'])
                ->name('message.generate-ai-response');
        });
    });

    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('roles.index');

        Route::post('/', [RoleController::class, 'store'])
            ->name('roles.store');

        Route::put('/{role}', [RoleController::class, 'update'])
            ->middleware('can:update,role') // update ポリシーの適用
            ->name('roles.update');

        Route::delete('/{role}', [RoleController::class, 'destroy'])
            ->middleware('can:delete,role') // delete ポリシーの適用
            ->name('roles.destroy');
    });
});
