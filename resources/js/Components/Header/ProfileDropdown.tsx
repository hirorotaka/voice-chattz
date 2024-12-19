import { Link, router, usePage } from "@inertiajs/react";
import { HiUserCircle } from "react-icons/hi2";
import { HiHome } from "react-icons/hi2"; // TOPアイコン
import { HiQuestionMarkCircle } from "react-icons/hi2"; // 使い方ガイドアイコン
import { HiArrowLeftOnRectangle } from "react-icons/hi2"; // ログアウトアイコン
import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";

const ProfileDropdown = () => {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        router.post(route("logout"));
    };

    // ユーザー名を省略する関数
    const truncateName = (name: string) => {
        return name.length > 20 ? name.substring(0, 20) + "..." : name;
    };

    return (
        <div className="relative mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 flex items-center text-white bg-blue-700/100 hover:bg-blue-600/100 rounded-lg transition-colors duration-200"
            >
                <span className="text-xs sm:text-base font-bold flex-grow text-left">
                    {truncateName(auth.user?.name || "メニュー")}
                </span>
                <IoSettingsOutline
                    className={`h-4 w-4 sm:h-6 sm:w-6 text-blue-200 transition-transform duration-300 ${
                        isOpen ? "rotate-45 transform" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg overflow-hidden z-20">
                        <div className="py-1">
                            <Link
                                href={route("top")}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            >
                                <HiHome className="h-5 w-5 mr-2 text-gray-500" />
                                TOP
                            </Link>
                            <Link
                                href={route("how-to-use")}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            >
                                <HiQuestionMarkCircle className="h-5 w-5 mr-2 text-gray-500" />
                                使い方ガイド
                            </Link>
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            >
                                <HiUserCircle className="h-5 w-5 mr-2 text-gray-500" />
                                プロフィール
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                            >
                                <HiArrowLeftOnRectangle className="h-5 w-5 mr-2 text-gray-500" />
                                ログアウト
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileDropdown;
