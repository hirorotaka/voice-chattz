import { flashType, MessageType, ThreadType } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { useAppContext } from "@/Contexts/AppContext";
import RecordRTC, { RecordRTCPromisesHandler } from "recordrtc";
import { MessageList } from "./MessageList";
import { PlaybackSpeedControls } from "./PlaybackControls";
import { MessageOverlay } from "./MessageOverlay";
import { RecordingCancel } from "./RecordingCancel";
import { MicButton } from "./MicButton";

interface ChatContainerProps {
    messages: MessageType[];
    activeThreadId: number;
    thread: ThreadType;
}

const ChatContainer = ({
    messages,
    activeThreadId,
    thread,
}: ChatContainerProps) => {
    const {
        globalPlaybackRate,
        handlePlaybackRateChange,
        handlePlaybackRateReset,
        apiErrorshowToast,
    } = useAppContext();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true); //再レンダリング間でも値を保持する必要があるため、useRefを使用
    const hasMessages = messages.length > 0;

    // 録音関連のstate
    const [isRecording, setIsRecording] = useState(false);
    const audioChunksRef = useRef<Blob[]>([]);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const MAX_RECORDING_TIME = 120; // 5分 = 300秒

    // RecordRTCの参照を保持
    const recorderRef = useRef<RecordRTCPromisesHandler | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // 送信関連のstate
    const [isSending, setIsSending] = useState(false);

    // キャンセルフラグをRefで管理
    const isCancelledRef = useRef(false);

    // プラッシュデータを取得
    const { flashData, error, errorId, audioUrl } = usePage().props
        .flash as flashType;

    // エラーメッセージの監視
    useEffect(() => {
        if (error && errorId) {
            apiErrorshowToast(error, "error");
        }
    }, [errorId]); // errorIdの変更を監視

    const [isActiveAiSound, setIsActiveAiSound] = useState<null | number>(null);

    const handleactivePlayAudio = (messageId: number | null) => {
        setIsActiveAiSound(messageId);
    };

    // メッセージ作成中の状態を追加
    const [isCreatingMessage, setIsCreatingMessage] = useState(false);

    // 録音時間を表示用にフォーマットする関数
    const formatTime = useCallback((seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    }, []);

    const handleMicButtonClickStart = () => {
        // 録音中か、SE音声再生中の場合は何もしない
        if (isRecording) {
            return;
        }

        // 録音開始処理を実行
        startRecording();
    };
    const handleMicButtonClickStop = async () => {
        stopRecording();
    };

    const cancelRecording = async () => {
        if (recorderRef.current && streamRef.current) {
            try {
                // キャンセルフラグを立てる
                isCancelledRef.current = true;

                // 録音停止
                await recorderRef.current.stopRecording();

                // ストリームの停止
                streamRef.current.getTracks().forEach((track) => track.stop());
            } catch (error) {
                console.error("録音のキャンセルに失敗しました:", error);
            } finally {
                // 初期化処理
                cleanupRecording();
            }
        }
    };

    // 初期化処理を共通化
    const cleanupRecording = () => {
        if (recorderRef.current) {
            recorderRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        // 状態を初期化
        setIsRecording(false);
        setRecordingTime(0);

        // タイマーをクリア
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // 音声データを初期化
        audioChunksRef.current = [];
    };

    // 録音時間の管理
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => {
                    if (prev >= MAX_RECORDING_TIME) {
                        stopRecording();
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            setRecordingTime(0);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRecording]);

    // コンポーネントのアンマウント時の処理を追加
    useEffect(() => {
        return () => {
            cleanupRecording();
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: isFirstRender.current ? "smooth" : "auto",
        });
    };

    /**
     * 音声録音を開始する関数
     * マイクへのアクセス権限を取得し、MediaRecorderを使用して録音を開始する
     */
    const startRecording = async () => {
        try {
            // マイクへのアクセス権限を要求
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            // ストリームを保存
            streamRef.current = stream;

            // RecordRTCの初期化
            recorderRef.current = new RecordRTCPromisesHandler(stream, {
                type: "audio",
                mimeType: "audio/webm",
                recorderType: RecordRTC.StereoAudioRecorder,
                numberOfAudioChannels: 1,
                desiredSampRate: 16000,
                timeSlice: 1000,
            });

            // 録音開始
            await recorderRef.current.startRecording();
            setIsRecording(true);
        } catch (error) {
            console.error("録音の開始に失敗しました:", error);

            if (error instanceof DOMException) {
                if (error.name === "NotAllowedError") {
                    alert(
                        "マイクへのアクセスが拒否されています。\n\n" +
                            "マイクを使用するには以下の手順で設定を変更してください：\n\n" +
                            "1. ブラウザのアドレスバーの左側にあるアイコンをクリック\n" +
                            "2. マイクの設定を「許可」に変更\n" +
                            "3. ページを更新して再度お試しください"
                    );
                } else if (error.name === "NotFoundError") {
                    alert(
                        "マイクが見つかりません。マイクが正しく接続されているか確認してください。"
                    );
                } else if (error.name === "NotReadableError") {
                    alert(
                        "マイクにアクセスできません。他のアプリケーションがマイクを使用している可能性があります。"
                    );
                } else {
                    alert(
                        "マイクへのアクセスでエラーが発生しました。ページを更新して再度お試しください。"
                    );
                }
            } else {
                alert(
                    "予期せぬエラーが発生しました。ページを更新して再度お試しください。"
                );
            }
        }
    };

    /**
     * 録音を停止する関数
     * 現在録音中の場合のみ停止処理を実行
     */
    const stopRecording = async () => {
        if (recorderRef.current && streamRef.current) {
            try {
                // 通常の停止なのでキャンセルフラグは false
                isCancelledRef.current = false;

                // ローディング状態をON
                setIsSending(true);

                // 録音停止
                await recorderRef.current.stopRecording();

                // 録音データの取得
                const blob = await recorderRef.current.getBlob();

                // ストリームの停止
                streamRef.current.getTracks().forEach((track) => track.stop());

                // 音声データの送信
                if (!isCancelledRef.current) {
                    await sendAudioToServer(blob);
                }
            } catch (error) {
                console.error("録音の停止に失敗しました:", error);
                alert("録音の停止に失敗しました");
            } finally {
                // 初期化処理
                cleanupRecording();
            }
        }
    };

    /**
     * 録音した音声データをサーバーに送信する関数
     * @param audioBlob - 送信する音声データのBlob
     */
    const sendAudioToServer = async (audioBlob: Blob) => {
        // ファイルサイズの制限チェック
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (audioBlob.size > maxSize) {
            alert("音声ファイルが大きすぎます（上限10MB）");
            return;
        }

        // FormDataオブジェクトを作成
        const formData = new FormData();
        // 音声データをFormDataに追加
        formData.append("audio", audioBlob, "audio.wav");

        // Inertia.jsを使用してサーバーにPOSTリクエストを送信
        router.post(
            route("message.store", { thread: activeThreadId }),
            formData,
            {
                forceFormData: true, // アップロード時にFormDataを強制使用する。
                onSuccess: (response) => {
                    setIsSending(false);
                    // レスポンスの処理
                    console.log("音声アップロード成功:");

                    // ユーザー音声がDBに保存されたら、AI応答の生成を開始
                    if ((response.props.flash as flashType).success) {
                        console.log("AI応答の生成開始");
                        setIsCreatingMessage(true);
                        // AI応答の生成を開始
                        router.post(
                            route("message.generate-ai-response", {
                                thread: activeThreadId,
                            }),
                            {},
                            {
                                preserveScroll: true,
                                onSuccess: () => {
                                    setIsCreatingMessage(false);
                                },
                                onError: (errors) => {
                                    console.error(
                                        "AI応答の生成に失敗しました:",
                                        errors
                                    );
                                    alert("AI応答の生成に失敗しました。");
                                    setIsCreatingMessage(false);
                                },
                            }
                        );
                    }
                },
                onError: (errors) => {
                    console.error("音声の送信に失敗しました:", errors);
                    setIsSending(false);
                },
            }
        );
    };

    // メッセージが存在する場合のみ初回スクロールを実行
    useEffect(() => {
        if (hasMessages && isFirstRender.current) {
            scrollToBottom();
            isFirstRender.current = false;
        }
    }, [hasMessages]);

    // メッセージが更新された時の処理
    useEffect(() => {
        if (!isFirstRender.current && hasMessages) {
            scrollToBottom();
        }
    }, [messages, hasMessages]);

    return (
        <div className="flex flex-col justify-between min-h-full pb-2">
            {/* メッセージリスト - スクロール可能なエリア */}
            <div className="flex-1 overflow-y-auto">
                <MessageList
                    messages={messages}
                    isCreatingMessage={isCreatingMessage}
                    thread={thread}
                    flashData={flashData}
                    handleactivePlayAudio={handleactivePlayAudio}
                    isActiveAiSound={isActiveAiSound}
                    globalPlaybackRate={globalPlaybackRate}
                    audioUrl={audioUrl}
                />
                <div ref={messagesEndRef} /> {/* 末尾に空のdiv */}
            </div>

            {/* マイクボタンとタイマー表示 */}
            <div className="flex items-center justify-end mr-4">
                {/* 録音中は表示しない */}
                {!isRecording && (
                    <PlaybackSpeedControls
                        globalPlaybackRate={globalPlaybackRate}
                        handlePlaybackRateChange={handlePlaybackRateChange}
                        handlePlaybackRateReset={handlePlaybackRateReset}
                    />
                )}

                {/* 録音中・ユーザーメッセージ送信・AI応答生成中のオーバーレイ */}
                <MessageOverlay
                    isRecording={isRecording}
                    isCreatingMessage={isCreatingMessage}
                    isSending={isSending}
                />

                {/* 録音時間とコントロールの表示 */}
                <RecordingCancel
                    isRecording={isRecording}
                    recordingTime={recordingTime}
                    maxRecordingTime={MAX_RECORDING_TIME}
                    formatTime={formatTime}
                    onCancel={cancelRecording}
                />
                {/* マイクボタン - 録音中も操作可能にするため z-40 を設定 */}
                <MicButton
                    isRecording={isRecording}
                    isActiveAiSound={Boolean(isActiveAiSound)}
                    onStart={startRecording}
                    onStop={stopRecording}
                />
            </div>
        </div>
    );
};

export default ChatContainer;
