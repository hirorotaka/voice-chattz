<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        // guardsが空の場合は[null]を設定（デフォルトのwebガードを使用）
        $guards = empty($guards) ? [null] : $guards;
        foreach ($guards as $guard) {
            // 各ガードでの認証チェック
            if (Auth::guard($guard)->check()) {
                // ルート名で条件分岐
                if ($request->route()->named('login') || $request->route()->named('register')) {
                    return redirect()->route('top');
                }
            }
        }
        return $next($request);
    }
}
