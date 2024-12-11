import { LoginButton } from "@/Components/Utils/LoginButton";
import { RegisterButton } from "@/Components/Utils/RegisterButton";
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import { IsUsingRoleType, LanguageType, ThreadType } from "@/types/types";
import {
    HiMicrophone,
    HiChatBubbleLeftRight,
    HiLanguage,
    HiUserGroup,
    HiPencilSquare,
    HiArrowsRightLeft,
} from "react-icons/hi2";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl">
        <div className="flex mb-2">
            <div className="text-indigo-400 text-2xl mr-4">{icon}</div>
            <h3 className="text-base font-bold text-white mb-2">{title}</h3>
        </div>
        <p className="text-gray-300">{description}</p>
    </div>
);

export default function GuestTop() {
    const features = [
        {
            icon: <HiMicrophone />,
            title: "音声認識でスムーズな入力",
            description:
                "ブラウザの音声認識機能で、あなたの声をリアルタイムで文字に変換。自然な会話をそのまま記録できます。",
        },
        {
            icon: <HiChatBubbleLeftRight />,
            title: "自然な対話で学習",
            description:
                "AIが文脈を理解し、自然な会話を展開。実際のネイティブスピーカーとの会話のような学習体験を提供します。",
        },
        {
            icon: <HiLanguage />,
            title: "複数言語に対応",
            description:
                "英語、日本語、韓国語など、多様な言語でのコミュニケーションをサポート。あなたの目標に合わせて言語を選択できます。",
        },
        {
            icon: <HiPencilSquare />,
            title: "カスタムAIキャラクター",
            description:
                "あなただけのAI会話相手を作成できます。学習目的や興味に合わせて、理想の練習パートナーを設定しましょう。",
        },
        {
            icon: <HiUserGroup />,
            title: "公開キャラクターの活用",
            description:
                "他のユーザーが作成したAIキャラクターを使用可能。様々な学習スタイルや場面に応じた会話練習ができます。",
        },
        {
            icon: <HiArrowsRightLeft />,
            title: "リアルタイム翻訳機能",
            description:
                "AIとの会話を即座に翻訳。言語の理解を深めながら、安心して会話を進めることができます。",
        },
    ];

    return (
        <GuestAppLayout title="トップページ">
            <div className="px-5 py-3 flex flex-col items-center">
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
                    <div className="relative w-full sm:max-w-md">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                        <img
                            src="/storage/images/app_image.svg"
                            alt="アプリケーションイメージ"
                            className="relative rounded-3xl shadow-2xl"
                        />
                    </div>
                </div>

                <div className="text-white text-center mt-3 text-lg  max-w-2xl mx-auto">
                    ログインすると、AIとの会話練習や、オリジナルAIの作成などすべての機能が使えます。
                    さっそく始めてみましょう！
                </div>

                <div className="flex justify-center gap-4">
                    <RegisterButton />
                    <LoginButton />
                </div>

                {/* 特徴セクション */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </GuestAppLayout>
    );
}
