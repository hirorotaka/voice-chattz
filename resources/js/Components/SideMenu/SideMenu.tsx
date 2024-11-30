import { HiPlus, HiOutlineChatAlt2 } from "react-icons/hi";
import SideToggleButton from "./SideToggleButton";
import { Link, usePage } from "@inertiajs/react";
import { LogoutButton } from "../Utils/LogoutButton";

export const SideMenu = () => {
    const { props } = usePage();

    let activeThreadId = null;
    if (props.activeThreadId) {
        activeThreadId = props.activeThreadId;
    }

    return (
        <div className="bg-blue-600 min-h-screen">
            <div className="p-4 h-screen flex flex-col">
                {/* ヘッダー */}
                <div className="flex items-center text-white mb-8">
                    <Link href={route("top")} className="flex items-center">
                        <HiOutlineChatAlt2 className="h-6 w-6 mr-2" />
                        <h1 className="text-lg font-semibold">MyEnglishApp</h1>
                    </Link>
                    <SideToggleButton className="ml-auto" variant="sidebar" />
                </div>

                {/* 新規スレッド作成ボタン */}
                <button className="w-full mb-6 p-3 bg-blue-700 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                    <div className="flex items-center justify-center">
                        <HiPlus className="h-5 w-5 flex-shrink-0" />
                        <span className="text-lg font-medium ml-2">
                            新規スレッド作成
                        </span>
                    </div>
                </button>

                {/* スレッドリスト */}
                <nav className="space-y-2 overflow-y-auto flex-1 p-3">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                        <Link
                            href={`/thread/${num}`}
                            key={num}
                            className={`
                                flex items-center text-white p-3 rounded cursor-pointer transition-colors duration-200
                                ${
                                    activeThreadId === num
                                        ? "bg-blue-800 font-bold"
                                        : "hover:bg-blue-700"
                                }
                            `}
                        >
                            <HiOutlineChatAlt2 className="h-5 w-5 mr-2" />
                            <span>英会話スレッド{num}</span>
                        </Link>
                    ))}
                </nav>

                <LogoutButton />
            </div>
        </div>
    );
};
