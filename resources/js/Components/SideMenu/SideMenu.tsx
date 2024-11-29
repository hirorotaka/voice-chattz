import { HiPlus, HiOutlineChatAlt2 } from "react-icons/hi";
import SideToggleButton from "./SideToggleButton";
import { Link } from "@inertiajs/react";

interface SideMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    activeThreadId?: number;
}

export const SideMenu = ({
    isOpen,
    onToggle,
    activeThreadId,
}: SideMenuProps) => {
    return (
        <div
            className={`
            ${isOpen ? "w-64" : "w-0"}
            bg-blue-600 min-h-screen
            transition-all duration-300
            overflow-hidden
        `}
        >
            <div className="w-64 p-4">
                {/* ヘッダー */}
                <div className="flex items-center text-white mb-8">
                    <HiOutlineChatAlt2 className="h-6 w-6 mr-2" />
                    <span className="text-lg font-semibold">MyEnglishApp</span>
                    <SideToggleButton
                        className="ml-auto"
                        onClick={onToggle}
                        variant="sidebar"
                    />
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
                <nav className="space-y-2">
                    {[1, 2, 3, 4].map((num) => (
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
            </div>
        </div>
    );
};
