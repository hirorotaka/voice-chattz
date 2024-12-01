import { HiPlus, HiOutlineChatAlt2 } from "react-icons/hi";
import { HiTrash } from "react-icons/hi2";
import { Link, router } from "@inertiajs/react";
import SideToggleButton from "./SideToggleButton";
import { LogoutButton } from "../Utils/LogoutButton";
import { ThreadType } from "@/types/types";
import { useEffect, useRef } from "react";

interface SideMenuProps {
    threads: ThreadType[];
    activeThreadId?: number | null;
}

export const SideMenu = ({ threads, activeThreadId = null }: SideMenuProps) => {
    const navRef = useRef<HTMLElement>(null);

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
        // スクロール位置をリセット
        if (navRef.current) {
            navRef.current.scrollTop = 0;
            scrollManager.save(0); // localStorageの保存値も更新
        }
        router.post(
            route("thread.store"),
            {
                title: `英会話スレッド${threads.length + 1}`,
            },
            {
                preserveState: false,
            }
        );
    };

    const handleThreadSelect = (threadId: string) => {
        // nav要素のrefを使用してスクロール位置を取得
        const navScrollPosition = navRef.current?.scrollTop;

        router.visit(route("thread.show", { thread: threadId }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // スクロール位置を復元
                if (navRef.current && navScrollPosition) {
                    navRef.current.scrollTop = navScrollPosition;
                }
            },
        });
    };

    const handleThreadDelete = (threadId: string) => {
        // スクロール位置をリセット
        if (navRef.current) {
            navRef.current.scrollTop = 0;
            scrollManager.save(0); // localStorageの保存値も更新
        }

        router.delete(route("thread.destroy", { thread: threadId }), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="bg-blue-600 min-h-screen">
            <div className="w-64 p-4 h-screen flex flex-col">
                {/* ヘッダー */}
                <div className="flex items-center text-white mb-8">
                    <Link href={route("top")} className="flex items-center">
                        <HiOutlineChatAlt2 className="h-6 w-6 mr-2" />
                        <h1 className="text-lg font-semibold">MyEnglishApp</h1>
                    </Link>
                    <SideToggleButton className="ml-auto" variant="sidebar" />
                </div>

                {/* 新規スレッド作成ボタン */}
                <button
                    onClick={handleCreateThread}
                    className="w-full mb-6 p-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                    <div className="flex items-center justify-center">
                        <HiPlus className="h-5 w-5 flex-shrink-0" />
                        <span className="text-lg font-medium ml-2">
                            新規スレッド作成
                        </span>
                    </div>
                </button>

                {/* スレッドリスト */}
                <nav ref={navRef} className="space-y-2 overflow-y-auto flex-1">
                    {threads.map((thread) => {
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
                                    <HiOutlineChatAlt2 className="h-5 w-5 mr-2" />
                                    <p>英会話スレッド{thread.id}</p>
                                </button>
                                {isActive && (
                                    <button
                                        onClick={() =>
                                            handleThreadDelete(thread.id)
                                        }
                                        className="p-2 hover:text-red-400 transition-colors"
                                    >
                                        <HiTrash className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <LogoutButton />
            </div>
        </div>
    );
};
