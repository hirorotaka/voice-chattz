<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreThreadRequest;
use App\Http\Requests\UpdateThreadRequest;
use App\Models\Language;
use App\Models\Thread;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        return Inertia::render('Top', ['threads' => $threads, 'languages' => $languages]);
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
        $thread = $request->user()->threads()->create($request->validated());

        return to_route('thread.show', $thread);
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

        $messages = $thread->messages()->get();

        return Inertia::render(
            'Thread/Show',
            [
                'thread' => $thread->load('language'),  // 個別のthreadに関連するlanguageを取得
                'threads' => $threads,
                'activeThreadId' => $thread->id,
                'messages' => $messages,
                'languages' => $languages
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
