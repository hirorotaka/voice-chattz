import { HiPlus, HiOutlineChatAlt2 } from "react-icons/hi";
import { HiTrash, HiOutlinePencil } from "react-icons/hi2";
import { BsFillPinAngleFill } from "react-icons/bs";
import { Link, router } from "@inertiajs/react";
import SideToggleButton from "./SideToggleButton";
import { LogoutButton } from "../Utils/LogoutButton";
import { ThreadType } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import DeleteThreadForm from "../Utils/DeleteThreadForm";
import CreateThreadForm from "../Utils/CreateThreadForm";
import EditThreadForm from "../Utils/EditThreadForm";

interface SideMenuProps {
    threads: ThreadType[];
    activeThreadId?: number | null;
}

export const SideMenu = ({ threads, activeThreadId = null }: SideMenuProps) => {
    const navRef = useRef<HTMLElement>(null);

    // 削除モーダルの状態管理を追加
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [threadToDelete, setThreadToDelete] = useState<string | null>(null);

    // 新規作成モーダル用のステート
    const [showCreateModal, setShowCreateModal] = useState(false);

    // 編集モーダル用のステート
    const [showEditModal, setShowEditModal] = useState(false);
    const [threadToEdit, setThreadToEdit] = useState({
        id: "",
        title: "",
    });

    // スクロール位置の管理をまとめた関数
    const scrollManager = {
        save: (scrollTop: number) => {
            localStorage.setItem(
                "sideMenuScrollPosition",
                scrollTop.toString()
            );
        },
        restore: () => {
            const nav = navRef.current;
            if (!nav) return;

            const savedPosition = localStorage.getItem(
                "sideMenuScrollPosition"
            );
            if (savedPosition) {
                nav.scrollTop = parseInt(savedPosition);
            }
        },
    };

    // スクロール位置をリセットする関数
    const resetScroll = () => {
        if (navRef.current) {
            navRef.current.scrollTop = 0;
            scrollManager.save(0);
        }
    };

    // スクロール位置を監視
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        const handleScroll = () => scrollManager.save(nav.scrollTop);
        nav.addEventListener("scroll", handleScroll);
        return () => nav.removeEventListener("scroll", handleScroll);
    }, []);

    // マウント時に位置を復元
    useEffect(() => {
        scrollManager.restore();
    }, []);

    const handleCreateThread = () => {
        setShowCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleThreadSelect = (threadId: string) => {
        // nav要素のrefを使用してスクロール位置を取得
        const navScrollPosition = navRef.current?.scrollTop;

        router.visit(route("thread.show", { thread: threadId }), {
            preserveScroll: true,
            // preserveState: true, //Show.tsx → Show.tsx への遷移はstateを維持
            onSuccess: () => {
                // スクロール位置を復元
                if (navRef.current && navScrollPosition) {
                    navRef.current.scrollTop = navScrollPosition;
                }
            },
        });
    };

    const handleThreadDelete = (threadId: string) => {
        setThreadToDelete(threadId);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setThreadToDelete(null);
    };

    const handleClickEditToThread = (threadId: string, title: string) => {
        setThreadToEdit({ id: threadId, title: title });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const favariteThread = threads.filter(
        (thread) => Boolean(thread.favorite) === true
    );

    const unFavariteThread = threads.filter(
        (thread) => Boolean(thread.favorite) === false
    );

    return (
        <>
            <div className="bg-blue-600 min-h-screen">
                <div className="w-64 p-4 h-screen flex flex-col">
                    {/* ヘッダー */}
                    <div className="flex items-center text-white mb-8">
                        <Link href={route("top")} className="flex items-center">
                            <HiOutlineChatAlt2 className="h-6 w-6 mr-2" />
                            <h1 className="text-lg font-semibold">
                                MyEnglishApp
                            </h1>
                        </Link>
                        <SideToggleButton
                            className="ml-auto"
                            variant="sidebar"
                        />
                    </div>

                    {/* 新規スレッド作成ボタン */}
                    <button
                        onClick={handleCreateThread}
                        className="w-full mb-6 p-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <HiPlus className="h-6 w-6 flex-shrink-0" />{" "}
                            {/* サイズを h-6 w-6 に増やし、flex-shrink-0 を追加 */}
                            <span className="text-lg font-medium">
                                新規スレッド作成
                            </span>
                        </div>
                    </button>

                    {/* スレッドリスト */}
                    <nav
                        ref={navRef}
                        className="space-y-2 overflow-y-auto flex-1"
                    >
                        {/* フェイバリートスレッド */}
                        {favariteThread.map((thread) => {
                            const isActive =
                                String(activeThreadId) === String(thread.id);
                            return (
                                <div
                                    key={thread.id}
                                    className={`flex items-center text-white rounded cursor-pointer transition-colors duration-200 ${
                                        isActive
                                            ? "bg-blue-800 font-bold transition-none"
                                            : "hover:bg-blue-700"
                                    }`}
                                >
                                    <button
                                        onClick={() =>
                                            handleThreadSelect(thread.id)
                                        }
                                        className="flex-1 flex items-center p-2.5 min-w-0"
                                    >
                                        <BsFillPinAngleFill className="flex-shrink-0 h-4 w-4 text-blue-200 mr-2" />
                                        <p className="text-sm text-blue-50 truncate">
                                            {thread.title}
                                        </p>
                                    </button>
                                    {/* アクションボタン */}
                                    <div
                                        className={`w-12 flex justify-end mr-1 space-x-1 ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-0 group-hover:opacity-100"
                                        } transition-opacity duration-200`}
                                    >
                                        {isActive ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleClickEditToThread(
                                                            thread.id,
                                                            thread.title
                                                        )
                                                    }
                                                    className="p-1 rounded hover:bg-blue-400/50 text-blue-200 hover:text-blue-100 transition-colors"
                                                >
                                                    <HiOutlinePencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleThreadDelete(
                                                            thread.id
                                                        )
                                                    }
                                                    className="p-1 mr-2 rounded hover:bg-blue-400/50 text-blue-200 hover:text-blue-100 transition-colors"
                                                >
                                                    <HiTrash className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}

                        <div className="my-3">
                            <hr className="border-blue-500/30" />
                        </div>

                        {/* 非フェイバリートスレッド */}
                        {unFavariteThread.map((thread) => {
                            const isActive =
                                String(activeThreadId) === String(thread.id);
                            return (
                                <div
                                    key={thread.id}
                                    className={`flex items-center text-white rounded cursor-pointer transition-colors duration-200 ${
                                        isActive
                                            ? "bg-blue-800 font-bold transition-none"
                                            : "hover:bg-blue-700"
                                    }`}
                                >
                                    <button
                                        onClick={() =>
                                            handleThreadSelect(thread.id)
                                        }
                                        className="flex-1 flex items-center p-2"
                                    >
                                        <HiOutlineChatAlt2 className="flex-shrink-0 h-5 w-5 mr-2" />
                                        <p className="text-sm text-left">
                                            {thread.title}
                                        </p>
                                    </button>
                                    {/* 非アクティブ時も同じ幅のスペースを確保 */}
                                    <div className="w-12 flex justify-center">
                                        {isActive ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleClickEditToThread(
                                                            thread.id,
                                                            thread.title
                                                        )
                                                    }
                                                    className="p-1 rounded hover:bg-blue-400/50 text-blue-200 hover:text-blue-100 transition-colors"
                                                >
                                                    <HiOutlinePencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleThreadDelete(
                                                            thread.id
                                                        )
                                                    }
                                                    className="p-1 mr-2 rounded hover:bg-blue-400/50 text-blue-200 hover:text-blue-100 transition-colors"
                                                >
                                                    <HiTrash className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </nav>

                    <LogoutButton />
                </div>
            </div>

            {/* 削除モーダルを追加 */}
            {threadToDelete && (
                <DeleteThreadForm
                    show={showDeleteModal}
                    onClose={handleCloseDeleteModal}
                    threadId={threadToDelete}
                    resetScroll={resetScroll}
                />
            )}

            {/* 新規作成モーダル */}
            <CreateThreadForm
                show={showCreateModal}
                onClose={handleCloseCreateModal}
                resetScroll={resetScroll}
            />

            {/* 編集用モーダル */}
            <EditThreadForm
                show={showEditModal}
                onClose={handleCloseEditModal}
                threadId={threadToEdit.id}
                title={threadToEdit.title}
            />
        </>
    );
};
