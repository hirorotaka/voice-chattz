<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreThreadRequest;
use App\Http\Requests\UpdateThreadRequest;
use App\Models\Language;
use App\Models\Message;
use App\Models\Prompt;
use App\Models\Role;
use App\Models\Thread;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ThreadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): InertiaResponse
    {
        if ((Auth::check()) === false) {
            return Inertia::render('Top/GuestTop');
        }

        $user = Auth::user();

        $threads = Thread::where('user_id', Auth::user()->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $languages = Language::all();

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

        return Inertia::render('Top/Top', ['threads' => $threads, 'languages' => $languages, 'isUsingMyRoles' => $isUsingMyRoles]);
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
                        'content' => $role->first_message,
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

                // 各言語のデフォルトメッセージを定義
                $defaultMessages = [
                    1 => "Hello! I'm your AI assistant. How can I help you today? I can engage in conversations on a wide range of topics, so please feel free to ask me anything.",
                    2 => "こんにちは！私はAIアシスタントです。どのようなお手伝いができますか？幅広い話題について会話ができますので、気軽にお話しください。",
                    3 => "안녕하세요! 저는 AI 어시스턴트입니다. 어떤 도움이 필요하신가요? 다양한 주제에 대해 대화를 나눌 수 있으니 편하게 말씀해 주세요."
                ];

                // 言語IDに基づいてメッセージを選択（存在しない場合は日本語をデフォルトとする）
                $selectedMessage = $defaultMessages[$thread->language_id] ?? $defaultMessages[2];

                Message::create(
                    [
                        'thread_id' => $thread->id,
                        'content' => $selectedMessage,
                        'message_ja' => '',
                        'audio_file_path' => "",
                        'sender' => 2,
                    ]
                );
            }


            return redirect()->route('thread.show', $thread);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Thread $thread)
    {

        $user = Auth::user();

        $threads = Thread::where('user_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $languages = Language::all();

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

        $messages = $thread->messages()->get();

        return Inertia::render(
            'Thread/Show',
            [
                'thread' => $thread->load(['language', 'prompt']),  // 個別のthreadに関連するlanguageを取得
                'threads' => $threads,
                'activeThreadId' => $thread->id,
                'messages' => $messages,
                'languages' => $languages,
                'isUsingMyRoles' => $isUsingMyRoles
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


    public function howToUse(): InertiaResponse
    {
        if ((Auth::check()) === false) {
            return Inertia::render('HowToUse/GuestHowToUse');
        }

        $user = Auth::user();

        $threads = Thread::where('user_id', Auth::user()->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $languages = Language::all();

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

        return Inertia::render('HowToUse/HowToUse', ['threads' => $threads, 'languages' => $languages, 'isUsingMyRoles' => $isUsingMyRoles]);
    }
}
