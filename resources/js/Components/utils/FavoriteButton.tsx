import { BsPin, BsPinFill } from "react-icons/bs";
import { router } from "@inertiajs/react";
import { ThreadType } from "@/types/types";

interface FavoriteButtonProps {
    thread: ThreadType;
}

export function FavoriteButton({ thread }: FavoriteButtonProps) {
    const handleFavoriteToggle = async () => {
        try {
            await router.post(
                route("thread.toggleFavorite", { thread: thread.id }),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleFavoriteToggle}
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
