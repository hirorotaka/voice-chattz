import { flashType, MessageType } from "@/types/types";
import { HiSpeakerWave, HiPause } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";

type AiMessageProps = {
    message?: MessageType;
    flashData?: flashType["flashData"];
};

const AiMessage = ({ message, flashData }: AiMessageProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasBeenPlayed, setHasBeenPlayed] = useState(false); // 再生履歴を追跡する新しいstate
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (flashData === message?.id) {
            handlePlayAudio();
        }
    }, []);

    // コンポーネントのアンマウント時のクリーンアップ
    useEffect(() => {
        // クリーンアップ関数
        return () => {
            if (audioRef.current) {
                audioRef.current.pause(); // 音声を停止
                audioRef.current.currentTime = 0; // 再生位置をリセット
                setIsPlaying(false);
                setHasBeenPlayed(false);
                audioRef.current = null; // 参照をクリア
            }
        };
    }, []); // 空の依存配列でコンポーネントのマウント時のみ実行

    const handlePlayAudio = () => {
        if (!audioRef.current) {
            if (!message?.audio_file_path) {
                return;
            }

            const audioUrl = `/storage/${message.audio_file_path}`;
            audioRef.current = new Audio(audioUrl);

            audioRef.current.onended = () => {
                setIsPlaying(false);
                setHasBeenPlayed(false); // 再生終了時にフラグを立てる
            };
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            setHasBeenPlayed(true); // 手動で停止した時もフラグを立てる
        } else {
            audioRef.current.play().catch((error) => {
                console.error("音声の再生に失敗しました:", error);
                setIsPlaying(false);
            });
            setIsPlaying(true);
        }
    };

    return (
        <div className="flex items-center gap-2 mb-4 justify-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300">
                <span className="text-sm font-medium">AI</span>
            </div>
            <div className="flex items-center gap-2 w-5/6">
                <div className="px-4 py-2 rounded-lg bg-gray-200">
                    <p className="text-lg">
                        {message?.message_en || "メッセージを作成しています..."}
                    </p>
                    <p className="text-lg text-gray-600">
                        {message?.message_ja}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {message?.audio_file_path && (
                        <button
                            className={`p-2 rounded-full transition-colors duration-200 ${
                                isPlaying
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-200 text-gray-400"
                            }`}
                            onClick={handlePlayAudio}
                            aria-label={isPlaying ? "音声を停止" : "音声を再生"}
                        >
                            {isPlaying || !hasBeenPlayed ? (
                                <HiSpeakerWave className="w-5 h-5" />
                            ) : (
                                <HiPause className="w-5 h-5" />
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiMessage;
