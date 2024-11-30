<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Middleware\RedirectIfAuthenticated;
use Illuminate\Support\Facades\Route;

// ログイン関連（個別ミドルウェア適用）ログインしているときに/loginへアクセスしたときの処理
Route::middleware(RedirectIfAuthenticated::class)->group(function () {

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
