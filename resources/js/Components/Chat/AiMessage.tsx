import { useState, useRef, useEffect } from "react";
import { HiSpeakerWave } from "react-icons/hi2";
import { flashType, MessageType } from "@/types/types";
import MessageDisplay from "./MessageDisplay";
import { Avatar } from "flowbite-react";

type AiMessageProps = {
    message?: MessageType;
    flashData?: flashType["flashData"];
    isActiveAiSound?: number | null;
    handleactivePlayAudio?: (messageId: number | null) => void;
    playbackRate?: number;
};

const AiMessage = ({
    message,
    flashData,
    isActiveAiSound,
    handleactivePlayAudio,
    playbackRate,
}: AiMessageProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const isDisabled =
        isActiveAiSound !== null && isActiveAiSound !== message?.id;

    useEffect(() => {
        if (flashData === message?.id) {
            handlePlayAudio();
        }
    }, [flashData]);

    useEffect(() => {
        if (
            isActiveAiSound !== null &&
            isActiveAiSound !== message?.id &&
            isPlaying
        ) {
            stopAudio();
        }
    }, [isActiveAiSound]);

    useEffect(() => {
        if (audioRef.current) {
            if (playbackRate !== undefined) {
                audioRef.current.playbackRate = playbackRate;
            }
        }
    }, [playbackRate]); // playbackRate が変更されるたびに実行

    useEffect(() => {
        return () => {
            stopAudio();
            audioRef.current = null;
        };
    }, []);

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            handleactivePlayAudio?.(null);
        }
    };

    const handlePlayAudio = () => {
        if (!message?.audio_file_path || isDisabled) return;

        if (isActiveAiSound !== null && isActiveAiSound !== message.id) {
            handleactivePlayAudio?.(null);
        }

        if (!audioRef.current) {
            const audioUrl = `/storage/${message.audio_file_path}`;
            audioRef.current = new Audio(audioUrl);

            if (playbackRate !== undefined) {
                audioRef.current.playbackRate = playbackRate; // props の playbackRate を使用する
            }

            audioRef.current.onended = () => {
                setIsPlaying(false);
                handleactivePlayAudio?.(null);
            };
        }

        if (isPlaying) {
            stopAudio();
        } else {
            audioRef.current.play().catch((error) => {
                console.error("Failed to play audio:", error);
                setIsPlaying(false);
                handleactivePlayAudio?.(null);
            });
            setIsPlaying(true);
            handleactivePlayAudio?.(message.id);
        }
    };

    return (
        <div className="flex items-center gap-2 mb-4 justify-start">
            <div className="flex flex-wrap gap-2 bg-gray-300 rounded-full">
                {isPlaying ? (
                    <Avatar img="/storage/images/icon_chat.gif" rounded />
                ) : (
                    <Avatar img="/storage/images/icon_chat.png" rounded />
                )}
            </div>
            <div className="flex items-center gap-2 w-5/6">
                <div className="p-2 rounded-lg bg-gray-200">
                    <MessageDisplay
                        content={
                            message?.message_en ||
                            "メッセージを作成しています..."
                        }
                    />
                    <p className="text-lg text-gray-600">
                        {message?.message_ja}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {message?.audio_file_path && (
                        <button
                            className={`p-2 rounded-full transition-all duration-200 ${
                                isPlaying
                                    ? "bg-blue-500 text-white"
                                    : isDisabled
                                    ? "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50"
                                    : "hover:bg-gray-200 text-gray-400"
                            }`}
                            onClick={handlePlayAudio}
                            disabled={isDisabled}
                            aria-label={isPlaying ? "音声を停止" : "音声を再生"}
                        >
                            <HiSpeakerWave className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiMessage;
