import { BsPin, BsPinFill } from "react-icons/bs";
import { router } from "@inertiajs/react";
import { ThreadType } from "@/types/types";
import { useState } from "react";

interface FavoriteButtonProps {
    thread: ThreadType;
}

export function FavoriteButton({ thread }: FavoriteButtonProps) {
    const [isSubmitting, setIsSubmitting] = useState(false); // ボタンの状態を管理するstate

    const handleFavoriteToggle = async () => {
        if (isSubmitting) return; // 既にリクエスト中の場合は何もしない

        setIsSubmitting(true); // ボタンを非活性状態にする

        try {
            await router.put(
                route("thread.toggleFavorite", { thread: thread.id }),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false); // ボタンを活性状態に戻す
        }
    };

    return (
        <button
            onClick={handleFavoriteToggle}
            disabled={isSubmitting} // ボタンを非活性にする
            className="p-4 hover:bg-blue-900 rounded-full transition-colors duration-200"
            aria-label={
                thread.favorite ? "お気に入りを解除" : "お気に入りに追加"
            }
        >
            {thread.favorite ? (
                <BsPinFill className="w-6 h-6 text-yellow-400" />
            ) : (
                <BsPin className="w-6 h-6 text-white hover:text-yellow-400" />
            )}
        </button>
    );
}
