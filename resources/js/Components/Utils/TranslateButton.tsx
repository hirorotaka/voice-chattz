import { MessageType, ThreadType } from "@/types/types";
import { useForm } from "@inertiajs/react";

interface TranslateButtonProps {
    thread: ThreadType | undefined;
    messageId: number;
    threadId: number;
    setShowJapanese: React.Dispatch<React.SetStateAction<boolean>>;
}

// 言語IDの型定義
type LanguageId = 1 | 2 | 3 | 4;

// 翻訳テキストの型定義
interface TranslationText {
    icon: string;
    translating: string;
    translate: string;
}

// 言語ごとの翻訳テキストの型定義
type TranslationTexts = {
    [key in LanguageId | "default"]: TranslationText;
};

// 言語ごとの翻訳テキストを定義
const translationText: TranslationTexts = {
    1: {
        // 英語
        icon: "Aあ",
        translating: "Translating...",
        translate: "Translate",
    },
    2: {
        // 日本語（必要に応じて）
        icon: "Aあ",
        translating: "翻訳中...",
        translate: "翻訳",
    },
    3: {
        // 韓国語
        icon: "한あ",
        translating: "번역 중...",
        translate: "번역",
    },
    4: {
        // ドイツ語
        icon: "AÜあ",
        translating: "Übersetzung läuft...",
        translate: "Übersetzen",
    },
    default: {
        icon: "Aあ",
        translating: "翻訳中...",
        translate: "翻訳",
    },
};

const TranslateButton = ({
    thread,
    messageId,
    threadId,
    setShowJapanese,
}: TranslateButtonProps) => {
    // フォームデータに翻訳したい文章を含める
    const { post, processing } = useForm({});

    // 言語IDに基づいてテキストを取得
    const getText = (): TranslationText => {
        const languageId = thread?.language_id as LanguageId;
        if (!languageId) return translationText.default;
        return translationText[languageId] || translationText.default;
    };

    const buttonText = getText();

    const handleTranslate = () => {
        post(
            route("message.translate-to-japanese", {
                thread: threadId,
                message: messageId,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowJapanese(true);
                    console.log("翻訳完了");
                },
            }
        );
    };

    return (
        <button
            onClick={handleTranslate}
            disabled={processing}
            className="text-white hover:text-gray-700 flex items-center gap-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
        >
            <span>{buttonText.icon}</span>
            <span>
                {processing ? buttonText.translating : buttonText.translate}
            </span>
        </button>
    );
};

export default TranslateButton;
