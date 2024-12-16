import { HiPlus } from "react-icons/hi";
import { HiMicrophone } from "react-icons/hi2";
import { BsQuestionCircleFill } from "react-icons/bs";
import { Link, router } from "@inertiajs/react";
import SideToggleButton from "./SideToggleButton";
import { LogoutButton } from "../Utils/LogoutButton";
import { IsUsingRoleType, LanguageType, ThreadType } from "@/types/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DeleteThreadForm from "../Utils/DeleteThreadForm";
import CreateThreadForm from "../Utils/CreateThreadForm";
import EditThreadForm from "../Utils/EditThreadForm";
import { FavoriteThread } from "./FavoritedThreadItem";
import { UnfavoritedThread } from "./UnfavoritedThreadItem";

interface SideMenuProps {
    threads: ThreadType[];
    activeThreadId?: number | null;
    languages: LanguageType[];
    roles: IsUsingRoleType[];
}

export const SideMenu = ({
    threads,
    activeThreadId = null,
    languages,
    roles,
}: SideMenuProps) => {
    const navRef = useRef<HTMLElement>(null);

    // 削除モーダルの状態管理を追加
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [threadToDelete, setThreadToDelete] = useState<number | null>(null);

    // 新規作成モーダル用のステート
    const [showCreateModal, setShowCreateModal] = useState(false);

    // 編集モーダル用のステート
    const [showEditModal, setShowEditModal] = useState(false);
    const [threadToEdit, setThreadToEdit] = useState({
        id: 0,
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

    const handleThreadSelect = (threadId: number) => {
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

    const handleThreadDelete = useCallback((threadId: number) => {
        setThreadToDelete(threadId);
        setShowDeleteModal(true);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
        setThreadToDelete(null);
    }, []);

    const handleClickEditToThread = useCallback(
        (threadId: number, title: string) => {
            setThreadToEdit({ id: threadId, title: title });
            setShowEditModal(true);
        },
        []
    );

    const handleCloseEditModal = useCallback(() => {
        setShowEditModal(false);
        setThreadToEdit({ id: 0, title: "" });
    }, []);

    const favoritedThreads = useMemo(
        () => threads.filter((thread) => Boolean(thread.favorite)),
        [threads]
    );

    const unfavoritedThreads = useMemo(
        () => threads.filter((thread) => !Boolean(thread.favorite)),
        [threads]
    );

    return (
        <>
            <div className="bg-blue-600 min-h-screen">
                <div className="w-64 p-4 h-screen flex flex-col">
                    {/* ヘッダー */}
                    <div className="flex items-center text-white mb-8">
                        <Link href={route("top")} className="flex items-center">
                            <HiMicrophone className="h-6 w-6 mr-2" />
                            <h1 className="text-lg font-semibold">
                                voice chattz
                            </h1>
                        </Link>
                        <SideToggleButton
                            className="ml-auto"
                            variant="sidebar"
                        />
                    </div>

                    <Link href={route("how-to-use")}>
                        <div className="flex items-center p-3 mb-8 text-white bg-blue-700 hover:bg-blue-600 rounded-lg shadow-md transition-colors duration-300">
                            <BsQuestionCircleFill className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span className="text-base font-medium">
                                使い方ガイド
                            </span>
                        </div>
                    </Link>

                    {/* 新規スレッド作成ボタン */}
                    <button
                        onClick={handleCreateThread}
                        className="w-full mb-6 p-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
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
                        {favoritedThreads.map((thread) => (
                            <FavoriteThread
                                key={thread.id}
                                thread={thread}
                                isActive={
                                    String(activeThreadId) === String(thread.id)
                                }
                                onSelect={handleThreadSelect}
                                onEdit={handleClickEditToThread}
                                onDelete={handleThreadDelete}
                            />
                        ))}

                        <div className="pb-4">
                            <hr className="border-blue-500/30" />
                        </div>

                        {/* 非フェイバリートスレッド */}
                        {unfavoritedThreads.map((thread) => (
                            <UnfavoritedThread
                                key={thread.id}
                                thread={thread}
                                isActive={
                                    String(activeThreadId) === String(thread.id)
                                }
                                onSelect={handleThreadSelect}
                                onEdit={handleClickEditToThread}
                                onDelete={handleThreadDelete}
                            />
                        ))}
                    </nav>

                    <LogoutButton />
                </div>
            </div>

            {/* 削除モーダルを追加 */}

            <DeleteThreadForm
                show={showDeleteModal}
                onClose={handleCloseDeleteModal}
                threadId={threadToDelete}
                resetScroll={resetScroll}
            />

            {/* 新規作成モーダル */}
            <CreateThreadForm
                show={showCreateModal}
                onClose={handleCloseCreateModal}
                resetScroll={resetScroll}
                languages={languages}
                roles={roles}
            />

            {/* 編集用モーダル */}
            <EditThreadForm
                show={showEditModal}
                onClose={handleCloseEditModal}
                threadToEdit={threadToEdit}
            />
        </>
    );
};
