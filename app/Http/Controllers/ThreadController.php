<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreThreadRequest;
use App\Http\Requests\UpdateThreadRequest;
use App\Models\Language;
use App\Models\Message;
use App\Models\Prompt;
use App\Models\Role;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ThreadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): InertiaResponse
    {

        $threads = Thread::where('user_id', Auth::user()->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $languages = Language::all();

        $roles = Auth::user()->roles()->with('language')->get();

        return Inertia::render('Top', ['threads' => $threads, 'languages' => $languages, 'roles' => $roles]);
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
    public function store(StoreThreadRequest $request)
    {
        $attributes = $request->only(['language_id', 'role_id']);

        // ポリシーチェック
        $result = Gate::inspect('create', [Thread::class, $attributes]);

        if (!$result->allowed()) {
            abort(403);
        }

        return DB::transaction(function () use ($request) {
            $thread = Thread::create([
                'user_id' => auth()->id(),
                'language_id' => $request->language_id,
                'title' => $request->title,
            ]);

            if ($request->role_id) {
                $role = Role::findOrFail($request->role_id);

                Prompt::create([
                    'thread_id' => $thread->id,
                    'name' => $role->name,
                    'description' => $role->description
                ]);

                // 初期メッセージを作成
                Message::create(
                    [
                        'thread_id' => $thread->id,
                        'message_en' => $role->first_message,
                        'message_ja' => "",
                        'audio_file_path' => "",
                        'sender' => 2,
                    ]
                );
            } else {
                // role_idがnullの場合は空の情報で作成
                Prompt::create([
                    'thread_id' => $thread->id,
                    'name' => '',
                    'description' => ''
                ]);

                // 初期メッセージを作成
                $defaultMessage_en = "Hello! I'm your AI assistant. How can I help you today? I can engage in conversations on a wide range of topics, so please feel free to ask me anything.";
                $defaultMessage_ja = "こんにちは！私はAIアシスタントです。どのようなお手伝いができますか？幅広い話題について会話ができますので、気軽にお話しください。";

                Message::create(
                    [
                        'thread_id' => $thread->id,
                        'message_en' => $thread->language_id == 1 ? $defaultMessage_en : $defaultMessage_ja,
                        'message_ja' => "",
                        'audio_file_path' => "",
                        'sender' => 2,
                    ]
                );
            }

            // 音声データを保存する


            return redirect()->route('thread.show', $thread);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Thread $thread)
    {
        $threads = Thread::where('user_id', Auth::user()->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $languages = Language::all();

        $roles = Auth::user()->roles()->with('language')->get();

        $messages = $thread->messages()->get();

        return Inertia::render(
            'Thread/Show',
            [
                'thread' => $thread->load(['language', 'prompt']),  // 個別のthreadに関連するlanguageを取得
                'threads' => $threads,
                'activeThreadId' => $thread->id,
                'messages' => $messages,
                'languages' => $languages,
                'roles' => $roles
            ]
        );
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Thread $thread)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateThreadRequest $request, Thread $thread)
    {
        $thread->update($request->validated());
        return to_route('thread.show', $thread);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Thread $thread)
    {
        $thread->delete();
        return redirect()->route('top');
    }

    public function toggleFavorite(Thread $thread)
    {
        $thread->favorite = !$thread->favorite;
        $thread->save();

        return to_route('thread.show', $thread);
    }
}
