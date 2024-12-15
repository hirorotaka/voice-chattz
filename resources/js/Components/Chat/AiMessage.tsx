import { useState, useRef, useEffect } from "react";
import { HiSpeakerWave, HiLanguage } from "react-icons/hi2";
import { flashType, MessageType, ThreadType } from "@/types/types";
import MessageDisplay from "./MessageDisplay";
import { Avatar } from "flowbite-react";
import TranslateButton from "../Utils/TranslateButton";
import axios from "axios";

type AiMessageProps = {
    message?: MessageType;
    flashData?: flashType["flashData"];
    isActiveAiSound?: number | null;
    handleactivePlayAudio?: (messageId: number | null) => void;
    playbackRate?: number;
    thread?: ThreadType;
    audioUrl?: string | null;
};

const AiMessage = ({
    message,
    flashData,
    isActiveAiSound,
    handleactivePlayAudio,
    playbackRate,
    thread,
    audioUrl, //作成時の署名付きURL
}: AiMessageProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [showJapanese, setShowJapanese] = useState(false); // 日本語表示の状態管理

    const [currentAudioUrl, setCurrentAudioUrl] = useState(
        audioUrl || undefined
    );

    const isDisabled =
        isActiveAiSound !== null && isActiveAiSound !== message?.id;

    // 音声URL取得処理
    const fetchAudioUrl = async () => {
        if (!message?.id) return null;

        try {
            const response = await axios.get(`/audio/url/${message.id}`);
            return response.data.url;
        } catch (error) {
            console.error("Failed to fetch audio URL:", error);
            return null;
        }
    };

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
        // iOS向けの初期化
        const initializeAudioContext = async () => {
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                const AudioContext =
                    window.AudioContext || (window as any).webkitAudioContext;
                const audioContext = new AudioContext();
                await audioContext.resume();
            }
        };

        initializeAudioContext();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
            setIsPlaying(false);
            handleactivePlayAudio?.(null);
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
    //     if (!message?.audio_file_path || isDisabled) return;

    //     // アクティブな音声再生の制御
    //     if (isActiveAiSound !== null && isActiveAiSound !== message.id) {
    //         handleactivePlayAudio?.(null);
    //     }

    //     // 音声URLの取得処理
    //     // 現在の音声URLがない場合は取得を試みる
    //     const audioUrlToUse = currentAudioUrl ?? (await fetchAudioUrl());

    //     // URLが取得できない場合はエラー処理
    //     if (!audioUrlToUse) {
    //         console.error("Could not retrieve audio URL");
    //         return;
    //     }

    //     // 初回再生時のAudioオブジェクト作成
    //     if (!audioRef.current) {
    //         audioRef.current = new Audio(audioUrlToUse);

    //         // 再生速度の設定
    //         if (playbackRate !== undefined) {
    //             audioRef.current.playbackRate = playbackRate;
    //         }

    //         // 再生終了時のイベントハンドラ
    //         audioRef.current.onended = () => {
    //             setIsPlaying(false);
    //             handleactivePlayAudio?.(null);
    //         };
    //     }

    //     // 再生/停止の切り替え
    //     if (isPlaying) {
    //         stopAudio();
    //     } else {
    //         try {
    //             // 音声再生
    //             await audioRef.current.play();
    //             setIsPlaying(true);
    //             handleactivePlayAudio?.(message.id);
    //         } catch (error) {
    //             console.error("Audio play error:", error);

    //             // 再生エラー時の追加処理
    //             try {
    //                 // 新しいURLを取得
    //                 const newAudioUrl = await fetchAudioUrl();

    //                 if (newAudioUrl) {
    //                     // 新しいAudioオブジェクトを作成
    //                     audioRef.current = new Audio(newAudioUrl);
    //                     setCurrentAudioUrl(newAudioUrl);

    //                     // 再生速度の再設定
    //                     if (playbackRate !== undefined) {
    //                         audioRef.current.playbackRate = playbackRate;
    //                     }

    //                     // 再生
    //                     await audioRef.current.play();
    //                     setIsPlaying(true);
    //                     handleactivePlayAudio?.(message.id);
    //                 } else {
    //                     // URL取得に失敗した場合
    //                     setIsPlaying(false);
    //                     handleactivePlayAudio?.(null);
    //                     console.error("Failed to retrieve new audio URL");
    //                 }
    //             } catch (retryError) {
    //                 console.error(
    //                     "Failed to retry audio playback:",
    //                     retryError
    //                 );
    //                 setIsPlaying(false);
    //                 handleactivePlayAudio?.(null);
    //             }
    //         }
    //     }
    // };

    const handlePlayAudio = async () => {
        if (!message?.audio_file_path || isDisabled) return;

        // アクティブな音声再生の制御
        if (isActiveAiSound !== null && isActiveAiSound !== message.id) {
            handleactivePlayAudio?.(null);
        }

        try {
            // 音声URLの取得処理
            // 現在の音声URLがない場合は取得を試みる
            const audioUrlToUse = currentAudioUrl ?? (await fetchAudioUrl());
            if (!audioUrlToUse) return;

            if (isPlaying) {
                stopAudio();
                return;
            }

            // iOS Safariのための設定
            audioRef.current = new Audio();
            // iOSのための属性設定
            audioRef.current.setAttribute("playsinline", "");
            audioRef.current.setAttribute("webkit-playsinline", "");
            // コンテキストの確立のための無音ファイル再生
            audioRef.current.src = audioUrlToUse;

            // 再生速度の設定
            if (playbackRate !== undefined) {
                audioRef.current.playbackRate = playbackRate;
            }

            // 再生終了時のイベントハンドラ
            audioRef.current.onended = () => {
                setIsPlaying(false);
                handleactivePlayAudio?.(null);
            };

            // iOS Safariのための追加設定
            audioRef.current.preload = "auto";
            await audioRef.current.load();

            // インタラクション状態のチェック
            if (document.body.hasAttribute("data-ios-interaction")) {
                await audioRef.current.play();
                setIsPlaying(true);
                handleactivePlayAudio?.(message.id);
            } else {
                // 初回インタラクション時にフラグを設定
                document.body.setAttribute("data-ios-interaction", "true");
                // 無音ファイルを再生してからメインの音声を再生
                const silentPlay = audioRef.current.play();
                await silentPlay;
                setIsPlaying(true);
                handleactivePlayAudio?.(message.id);
            }
        } catch (error) {
            console.error("Audio play error:", error);

            try {
                // 新しいURLでリトライ
                const newAudioUrl = await fetchAudioUrl();
                if (!newAudioUrl) {
                    throw new Error("Failed to retrieve new audio URL");
                }

                // iOS Safariのための設定を再度適用
                audioRef.current = new Audio();
                audioRef.current.setAttribute("playsinline", "");
                audioRef.current.setAttribute("webkit-playsinline", "");
                audioRef.current.src = newAudioUrl;
                setCurrentAudioUrl(newAudioUrl);

                if (playbackRate !== undefined) {
                    audioRef.current.playbackRate = playbackRate;
                }

                audioRef.current.preload = "auto";
                await audioRef.current.load();
                await audioRef.current.play();

                setIsPlaying(true);
                handleactivePlayAudio?.(message.id);
            } catch (retryError) {
                console.error("Failed to retry audio playback:", retryError);
                setIsPlaying(false);
                handleactivePlayAudio?.(null);
            }
        }
    };

    return (
        <div className="flex items-center gap-2 mb-4 justify-start">
            <div className="flex flex-wrap gap-2 bg-gray-300 rounded-full">
                {isPlaying ? (
                    <Avatar img="/images/icon_chat.gif" rounded />
                ) : (
                    <Avatar img="/images/icon_chat.webp" rounded />
                )}
            </div>
            <div className="flex items-center gap-2 w-5/6">
                <div className="p-2 rounded-lg bg-gray-200">
                    <MessageDisplay
                        content={
                            message?.content || "メッセージを作成しています..."
                        }
                    />
                    {/* 日本語訳の条件付きレンダリング */}
                    {message?.message_ja && showJapanese && (
                        <p className="text-lg text-gray-600">
                            {message.message_ja}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {message?.audio_file_path && (
                        <>
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
                                aria-label={
                                    isPlaying ? "音声を停止" : "音声を再生"
                                }
                            >
                                <HiSpeakerWave className="w-5 h-5" />
                            </button>
                            {/* 英語の場合のみ翻訳関連のボタンを表示 */}
                            {thread?.language_id !== 2 && (
                                <>
                                    {message?.message_ja ? (
                                        <button
                                            className={`p-2 rounded-full transition-all duration-200
                            ${
                                showJapanese
                                    ? "bg-blue-500 text-white"
                                    : "hover:bg-gray-200 text-gray-400"
                            }`}
                                            onClick={() =>
                                                setShowJapanese(!showJapanese)
                                            }
                                            aria-label={
                                                showJapanese
                                                    ? "日本語を非表示"
                                                    : "日本語を表示"
                                            }
                                        >
                                            <HiLanguage className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <TranslateButton
                                            thread={thread}
                                            threadId={message.thread_id}
                                            messageId={message.id}
                                            setShowJapanese={setShowJapanese}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AiMessage;
