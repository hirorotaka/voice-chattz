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
    public function index()
    {
        $roles = Role::where(function ($query) {
            $query->where('is_public', true)
                ->orWhereHas('users', function ($query) {
                    $query->where('users.id', auth()->id());
                });
        })->with('language')->get();

        $threads = Thread::where('user_id', Auth::user()->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $languages = Language::all();

        return Inertia::render('Role/Index', ['threads' => $threads, 'languages' => $languages, 'roles' => $roles]);
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
}
