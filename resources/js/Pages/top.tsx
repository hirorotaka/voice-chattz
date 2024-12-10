import AppLayout from "@/Layouts/AppLayout";
import { IsUsingRoleType, LanguageType, ThreadType } from "@/types/types";
import {
    HiMicrophone,
    HiChatBubbleLeftRight,
    HiLanguage,
} from "react-icons/hi2";

interface TopProps {
    threads: ThreadType[];
    languages: LanguageType[];
    isUsingMyRoles: IsUsingRoleType[];
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
        <div className="text-indigo-400 text-3xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
    </div>
);

export default function Top({ threads, languages, isUsingMyRoles }: TopProps) {
    const features = [
        {
            icon: <HiMicrophone />,
            title: "音声認識で簡単入力",
            description:
                "ブラウザの音声をリアルタイムで文字に変換。手間なく会話を記録できます。",
        },
        {
            icon: <HiChatBubbleLeftRight />,
            title: "AIとリアルな会話",
            description:
                "文字起こしされた内容にAIが自然に応答。まるで実際の会話のように学習できます。",
        },
        {
            icon: <HiLanguage />,
            title: "マルチ言語対応",
            description:
                "英語、日本語、韓国語に対応。あなたの学びたい言語でコミュニケーションを。",
        },
    ];

    return (
        <AppLayout
            title="トップページ"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="p-10 flex flex-col items-center justify-around">
                {/* ヒーローセクション */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                        会話を、学びを、もっと自由に
                        <span className="block text-indigo-400">
                            AI Powered Language Learning
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300  mx-auto">
                        音声認識とAIを組み合わせた新しい言語学習プラットフォーム。
                        <br />
                        あなたの声から始まる、革新的な学習体験。
                    </p>
                </div>

                {/* イラストレーション */}
                <div className="flex justify-center mb-10">
                    <div className="relative w-full max-w-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                        <img
                            src="/storage/images/app_image.svg"
                            alt="アプリケーションイメージ"
                            className="relative rounded-3xl shadow-2xl"
                        />
                    </div>
                </div>

                {/* 特徴セクション */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
