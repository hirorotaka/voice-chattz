import GuestAppLayout from "@/Layouts/GuestAppLayout";
import { FeatureCard } from "../../Components/Top/FeatureCard";
import { features } from "@/Components/Top/Features";
import { useState } from "react";
import TopImage from "@/Components/Top/TopImage";

export default function GuestTop() {
    return (
        <GuestAppLayout title="トップページ">
            <div className="overflow-y-auto">
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
                            音声認識とAIを組み合わせた
                            <br />
                            新しい言語学習プラットフォーム。
                            <br />
                            あなたの声から始まる、革新的な学習体験。
                        </p>
                    </div>

                    {/* イラストレーション */}
                    <div className="flex justify-center mb-10 w-full">
                        <div className="relative w-full sm:max-w-2xl px-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                            <div className="relative rounded-3xl shadow-2xl">
                                <TopImage
                                    className="w-full h-auto"
                                    preserveAspectRatio="xMidYMid meet"
                                    viewBox="0 0 868.98 474.67"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-white text-center mt-3 text-lg  max-w-2xl mx-auto">
                        ログインすると、AIとの会話練習や、オリジナルAIの作成などすべての機能が使えます。
                        さっそく始めてみましょう！
                    </div>

                    {/* 特徴セクション */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </div>
            </div>
        </GuestAppLayout>
    );
}
