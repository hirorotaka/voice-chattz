import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { HiMicrophone } from "react-icons/hi2";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen  px-4">
            {/* メインコンテンツ */}
            <div className="relative min-h-screen flex flex-col items-center justify-center">
                <div className="w-full max-w-md space-y-8">
                    {/* ロゴ */}
                    <div className="text-center">
                        <Link
                            href="/"
                            className="group flex items-center justify-center"
                        >
                            <div className="flex items-center justify-center w-8 h-8 sm:w-16 sm:h-16 mr-4 bg-white/10 rounded-2xl backdrop-blur-lg transition-all duration-300 group-hover:scale-105">
                                <HiMicrophone className="w-4 h-4 sm:w-8 sm:h-8 text-indigo-400" />
                            </div>
                            <div className="mt-4">
                                <h1 className="text-2xl font-bold text-white">
                                    voice chattz
                                </h1>
                                <p className="text-sm text-gray-400">
                                    AIと育む語学力
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* フォームコンテナ */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl blur-xl" />
                        <div className="relative bg-white/5 backdrop-blur-lg p-8 shadow-2xl rounded-2xl">
                            {children}
                        </div>
                    </div>

                    {/* フッター */}
                    <div className="text-center text-sm text-gray-400">
                        © 2024 voice chattz. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}
