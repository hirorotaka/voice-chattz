import { HiPlus, HiOutlineChatAlt2 } from "react-icons/hi";
import { HiTrash } from "react-icons/hi2";
import { Link, router } from "@inertiajs/react";
import SideToggleButton from "./SideToggleButton";
import { LogoutButton } from "../Utils/LogoutButton";
import { ThreadType } from "@/types/types";

interface SideMenuProps {
    threads: ThreadType[];
    activeThreadId?: number | null;
}

export const SideMenu = ({ threads, activeThreadId = null }: SideMenuProps) => {
    const handleCreateThread = () => {
        router.post(route("thread.store"), {
            title: `英会話スレッド${threads.length + 1}`,
        });
    };

    const handleThreadSelect = (threadId: string) => {
        router.get(route("thread.show", { thread: threadId }));
    };

    const handleThreadDelete = (threadId: string) => {
        console.log(`Delete thread: ${threadId}`);
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
                <nav className="space-y-2 overflow-y-auto flex-1">
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
