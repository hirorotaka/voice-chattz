<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Language;
use App\Models\Role;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // ページネーション用のクエリを構築
        $query = Role::whereHas('users', function ($query) use ($user) {
            $query->where('users.id', $user->id)
                ->where('role_user.owner', 1);
        })->with('language');

        // ページネーションを実行
        $myRoles = $query->paginate(10);

        // 総ページ数を取得
        $lastPage = $myRoles->lastPage();

        // 現在のページ番号を取得
        $currentPage = $request->input('page', 1);

        // 不正なページ番号の場合は最後のページにリダイレクト
        if ($currentPage > $lastPage && $lastPage > 0) {
            return redirect()->route('roles.index', ['page' => $lastPage]);
        }
        // 0以下のページ番号の場合は1ページ目にリダイレクト
        if ($currentPage < 1) {
            return redirect()->route('roles.index', ['page' => 1]);
        }

        // データを整形
        $myRoles->through(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'first_message' => $role->first_message ?? '',
                'description' => $role->description ?? '',
                'language_id' => $role->language_id,
                'is_public' => $role->is_public,
                'language' => $role->language,
                'created_at' => $role->created_at->toISOString(),
                'updated_at' => $role->updated_at->toISOString(),
            ];
        });

        // 自分のロールのうち、is_using が 1 のものだけを取得（非公開も含む）
        $isUsingMyRoles = $user->roles()
            ->with('language')
            ->wherePivot('is_using', 1) // is_using が 1 のものだけを取得
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'first_message' => $role->first_message,
                    'description' => $role->description,
                    'language' => $role->language,
                    'is_owned' => $role->pivot->owner,
                    'is_using' => $role->pivot->is_using, // 常に 1
                    'is_public' => $role->is_public,
                ];
            });


        $threads = Thread::where('user_id', Auth::user()->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $languages = Language::all();

        return Inertia::render('Role/RoleIndex', ['threads' => $threads, 'languages' => $languages, 'myRoles' => $myRoles, 'isUsingMyRoles' => $isUsingMyRoles]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $validatedData = $request->validated();

        // ログインユーザーのIDを取得
        $userId = Auth::id();

        // ロールを作成
        $role = Role::create($validatedData);

        // ログインユーザーとロールを紐づけ、ownerをtrueにする
        $role->users()->attach(Auth::id(), ['owner' => true]);

        return to_route('roles.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update($request->validated());
        return to_route('roles.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $role->delete();
        return redirect()->route('roles.index');
    }

    public function toggleRolePublic(Role $role)
    {
        $role->is_public = !$role->is_public;
        $role->save();

        return to_route('roles.index');
    }

    public function publicRoles(Request $request)
    {

        $user = Auth::user();

        $search_str = $request->input('search_str');



        // 公開中の全ロールのベースクエリ
        $query = Role::where('is_public', true)
            ->whereDoesntHave('users', function ($query) use ($user) {
                $query->where('users.id', $user->id)
                    ->where('owner', 1);
            })
            ->with(['language', 'users' => function ($query) use ($user) {
                $query->where('users.id', $user->id);
            }]);

        // 検索条件がある場合は追加
        if ($search_str) {
            $query->where(function ($q) use ($search_str) {
                $q->where('name', 'LIKE', '%' . $search_str . '%')
                    ->orWhere('description', 'LIKE', '%' . $search_str . '%');
            });
        }

        // ページネーションを実行
        $publicRoles = $query->paginate(10);

        // 総ページ数を取得
        $lastPage = $publicRoles->lastPage();

        // 現在のページ番号を取得
        $currentPage = $request->input('page', 1);

        // 不正なページ番号の場合のリダイレクト処理
        if ($currentPage > $lastPage && $lastPage > 0) {
            return redirect()->route('roles.public', [
                'page' => $lastPage,
                'search_str' => $search_str
            ]);
        }
        // 0以下のページ番号の場合は1ページ目にリダイレクト
        if ($currentPage < 1) {
            return redirect()->route('roles.public', [
                'page' => 1,
                'search_str' => $search_str
            ]);
        }

        // データの整形
        $publicRoles->through(function ($role) use ($user) {
            $isRelatedToUser = $role->users->isNotEmpty();
            $isUsing = $isRelatedToUser ? $role->users->first()->pivot->is_using : 0;

            return [
                'id' => $role->id,
                'name' => $role->name,
                'first_message' => $role->first_message ?? '', // null対策
                'description' => $role->description ?? '',     // null対策
                'language_name' => $role->language->name,
                'is_using' => $isUsing,
            ];
        });

        // 自分のロールのうち、is_using が 1 のものだけを取得（非公開も含む）
        $isUsingMyRoles = $user->roles()
            ->with('language')
            ->wherePivot('is_using', 1) // is_using が 1 のものだけを取得
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'first_message' => $role->first_message,
                    'description' => $role->description,
                    'language' => $role->language,
                    'is_owned' => $role->pivot->owner,
                    'is_using' => $role->pivot->is_using, // 常に 1
                    'is_public' => $role->is_public,
                ];
            });

        $threads = Thread::where('user_id', $user?->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $languages = Language::all();

        return Inertia::render('Role/PublicRoles', [
            'publicRoles' => $publicRoles, // 公開中の全ロール(自分のものは含まない)
            'isUsingMyRoles' => $isUsingMyRoles,          // 使用中の自分のロール（非公開も含む）is_using が 1 のもの
            'threads' => $threads,
            'languages' => $languages,
            'search_str' => $search_str,
        ]);
    }

    public function toggleRolePublicIsUsing(Role $role)
    {
        $user = Auth::user();
        //ロールを所持しているのか確認
        // 既にロールを持っているかを確認
        $existingRole = $user->roles->find($role->id); // findで直接取得可能




        if ($existingRole) {
            // 既にロールを持っている場合は、is_using を切り替える
            $existingRole->pivot->is_using = !$existingRole->pivot->is_using;
            $existingRole->pivot->save();

            //レスポンスに更新後のis_usingの値を含める
            return back()->with([
                'is_using' => $existingRole->pivot->is_using,
                'role_id' => $role->id
            ]);
        } else {
            // ロールを持っていない場合は、中間テーブルに新しいレコードを作成
            $user->roles()->attach($role->id, ['is_using' => true, 'owner' => false]); // ownerはfalseに設定

            return back()->with([
                'is_using' => true,
                'role_id' => $role->id
            ]);
        }
    }
}
