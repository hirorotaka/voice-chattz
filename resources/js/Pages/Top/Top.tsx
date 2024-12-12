import { features } from "@/Components/Top/Features";
import AppLayout from "@/Layouts/AppLayout";
import { IsUsingRoleType, LanguageType, ThreadType } from "@/types/types";
import { FeatureCard } from "../../Components/Top/FeatureCard";
import { useState } from "react";

interface TopProps {
    threads: ThreadType[];
    languages: LanguageType[];
    isUsingMyRoles: IsUsingRoleType[];
}

export default function Top({ threads, languages, isUsingMyRoles }: TopProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <AppLayout
            title="トップページ"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="px-5 flex flex-col items-center">
                {/* ヒーローセクション */}
                <div className="text-center">
                    <h1 className="text-xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                        会話を、学びを、もっと自由に
                        <span className="block text-indigo-400">
                            AI Powered Language Learning
                        </span>
                    </h1>
                    <p className="text-xs sm:text-xl text-gray-300  mx-auto">
                        音声認識とAIを組み合わせた新しい言語学習プラットフォーム。
                        <br />
                        あなたの声から始まる、革新的な学習体験。
                    </p>
                </div>

                {/* イラストレーション */}
                <div className="flex justify-center mb-10">
                    <div className="relative w-full sm:max-w-xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                        <img
                            src="/images/app_image.svg"
                            alt="アプリケーションイメージ"
                            className={`relative rounded-3xl shadow-2xl transition-opacity duration-300 ${
                                imageLoaded ? "opacity-100" : "opacity-0"
                            }`}
                            onLoad={() => setImageLoaded(true)}
                        />
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 特徴セクション */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
