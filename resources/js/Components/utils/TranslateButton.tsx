import { MessageType } from "@/types/types";
import { useForm } from "@inertiajs/react";

interface TranslateButtonProps {
    messageId: number;
    threadId: number;
    setShowJapanese: React.Dispatch<React.SetStateAction<boolean>>;
}

const TranslateButton = ({
    messageId,
    threadId,
    setShowJapanese,
}: TranslateButtonProps) => {
    // フォームデータに翻訳したい文章を含める
    const { post, processing } = useForm({});

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
            <span>Aあ</span>
            <span>{processing ? "翻訳中..." : "翻訳"}</span>
        </button>
    );
};

export default TranslateButton;
