import { HiPlus, HiOutlineChatAlt2 } from "react-icons/hi";
import SideToggleButton from "./SideToggleButton";
import { Link, router } from "@inertiajs/react";
import { LogoutButton } from "../Utils/LogoutButton";
import { useAppContext } from "@/Contexts/AppContext";

export const SideMenu = () => {
    const { threads, activeThread } = useAppContext();

    let activeThreadId = activeThread || null;

    const handleCreateThread = () => {
        router.post(route("thread.store"), {
            title: `英会話スレッド${threads.length + 1}`,
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
                <nav className="space-y-2 overflow-y-auto flex-1 p-3">
                    {threads.map((thread) => (
                        <Link
                            href={route("thread.show", { thread: thread.id })}
                            key={thread.id}
                            className={`
                                flex items-center text-white p-3 rounded cursor-pointer transition-colors duration-200
                                ${
                                    String(activeThreadId) === String(thread.id)
                                        ? "bg-blue-800 font-bold"
                                        : "hover:bg-blue-700"
                                }
                            `}
                        >
                            <HiOutlineChatAlt2 className="h-5 w-5 mr-2" />
                            <span>英会話スレッド{thread.id}</span>
                        </Link>
                    ))}
                </nav>

                <LogoutButton />
            </div>
        </div>
    );
};
