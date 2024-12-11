import AppLayout from "@/Layouts/AppLayout";
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import { IsUsingRoleType, LanguageType, ThreadType } from "@/types/types";
import { useState } from "react";

interface SlideType {
    title: string;
    description: string;
    image: string;
}

interface HowToUseProps {
    threads: ThreadType[];
    languages: LanguageType[];
    isUsingMyRoles: IsUsingRoleType[];
}

const slides: SlideType[] = [
    {
        title: "Step 1: スレッドを作成",
        description:
            "サイドバーの「+新規スレッド作成」をクリック。\n学習したい言語とAIの役割を選んで会話を始めましょう。",
        image: "/storage/images/step1.png",
    },
    {
        title: "Step 2: 会話を始める",
        description:
            "画面下部のマイクボタンをクリックして録音開始。\n赤色に変わったら、話しかけてみましょう。",
        image: "/storage/images/step2.png",
    },
    {
        title: "Step 3: 会話を送信",
        description:
            "話し終わったら、もう一度マイクボタンをクリック。\nあなたの声が、AIに送信されます。",
        image: "/storage/images/step3.png",
    },
    {
        title: "Step 4: AIと対話",
        description:
            "AIが音声で応答します。\n右下のスライダーで音声の速度を調整できます。\n必要な場合は、日本語訳も表示できます。",
        image: "/storage/images/step4.png",
    },
    {
        title: "カスタム機能1: オリジナルAIを作る",
        description:
            "右上のユーザー名 → 「役割一覧（自分）」をクリック。\n自分だけのAIキャラクターを作成できます。\n作ったAIは「公開」をオンにすると、他のユーザーにもシェアできます。",
        image: "/storage/images/step5.png",
    },
    {
        title: "カスタム機能2: コミュニティAIを使う",
        description:
            "右上のユーザー名 → 「役割一覧（公開中）」をクリック。\n「公開中のものを使用する」をオンにすると、\n他のユーザーが作成したAIキャラクターを使えます。\n役割はスレッドを作成するときに選べるようになります。",
        image: "/storage/images/step6.png",
    },
    {
        title: "注意点: ブラウザからのマイクのアクセス許可(chrome,edge)",
        description:
            "ブラウザからマイクのアクセス許可のポップアップが出る方は、許可をクリックしてください。\n拒否を押してしまった方は、URL欄左端にあるアイコンをクリックしてマイクの許可をしてください。また動作が安定しているChrome,Edgeでのご利用をよろしくお願いします。",
        image: "/storage/images/step7.png",
    },
];

export default function HowToUse({
    threads,
    languages,
    isUsingMyRoles,
}: HowToUseProps) {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const nextSlide = (): void => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = (): void => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <AppLayout
            title="トップページ"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="container mx-auto px-4 md:px-8 lg:px-12 py-2 sm:py-8 md:py-12">
                <div className="flex  items-center justify-center">
                    <h1 className="text-white text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-8 md:mb-12 text-center mr-4">
                        使い方ガイド
                    </h1>

                    {/* Progress indicator */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-900 rounded-full px-2 py-1 sm:px-4 sm:py-2">
                            <span className="text-white">
                                {currentSlide + 1} / {slides.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="max-w-full mx-auto">
                    <div className="bg-blue-900 rounded-lg shadow-lg">
                        <div className="p-6 md:p-8 sm:min-h-96">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Image section */}
                                <div className="relative aspect-video bg-blue-800 rounded-lg overflow-hidden">
                                    <img
                                        src={slides[currentSlide].image}
                                        alt={slides[currentSlide].title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Text content */}
                                <div className="text-white min-h-48 sm:min-h-full">
                                    <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
                                        {slides[currentSlide].title}
                                    </h2>
                                    <p className="sm:text-xs md:text-sm lg:text-base whitespace-pre-line">
                                        {slides[currentSlide].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={prevSlide}
                            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={currentSlide === 0}
                        >
                            <span className="mr-2">←</span>
                            前へ
                        </button>
                        <button
                            onClick={nextSlide}
                            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={currentSlide === slides.length - 1}
                        >
                            次へ
                            <span className="ml-2">→</span>
                        </button>
                    </div>

                    {/* Mobile-friendly dot navigation */}
                    <div className="flex justify-center gap-2 mt-6">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full ${
                                    currentSlide === index
                                        ? "bg-white"
                                        : "bg-blue-800"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
