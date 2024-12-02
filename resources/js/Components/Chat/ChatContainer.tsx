import { HiMicrophone } from "react-icons/hi2";
import AiMessage from "./AiMessage";
import UserMessage from "./UserMessage";
import { flashType, MessageType } from "@/types/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import LoadingSppiner from "../Utils/LoadingSppiner";

interface ChatContainerProps {
    messages: MessageType[];
    activeThreadId: number;
}

const ChatContainer = ({ messages, activeThreadId }: ChatContainerProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true); //再レンダリング間でも値を保持する必要があるため、useRefを使用
    const hasMessages = messages.length > 0;

    // 録音関連のstate
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const MAX_RECORDING_TIME = 300; // 5分 = 300秒

    // 送信関連のstate
    const [isSending, setIsSending] = useState(false);

    // プラッシュデータを取得
    const { flashData } = usePage().props.flash as flashType;

    // 録音時間を表示用にフォーマットする関数
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
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
                audio: true,
            });
            // MediaRecorderインスタンスを作成
            const mediaRecorder = new MediaRecorder(stream);
            // 現在のMediaRecorderへの参照を保存
            mediaRecorderRef.current = mediaRecorder;
            // 音声データチャンクを格納する配列を初期化
            audioChunksRef.current = [];

            // 録音データが利用可能になるたびに呼び出されるイベントハンドラ
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    // 音声データのチャンクを配列に追加
                    audioChunksRef.current.push(event.data);
                }
            };

            // 録音停止時に実行されるイベントハンドラ
            mediaRecorder.onstop = async () => {
                // 収集した音声チャンクをBlobとして結合
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: "audio/wav",
                });
                // サーバーに音声データを送信
                await sendAudioToServer(audioBlob);

                // 使用していたマイクのストリームを解放
                stream.getTracks().forEach((track) => track.stop());
            };

            // 録音開始
            mediaRecorder.start();
            // 録音中状態をUIに反映
            setIsRecording(true);
        } catch (error) {
            console.error("録音の開始に失敗しました:", error);
            alert("マイクへのアクセスが拒否されたか、エラーが発生しました。");
        }
    };

    /**
     * 録音を停止する関数
     * 現在録音中の場合のみ停止処理を実行
     */
    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
        ) {
            // 録音を停止（これによりonstopイベントが発火）
            mediaRecorderRef.current.stop();
            // 録音状態をUIに反映
            setIsRecording(false);
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

        // 送信開始時にローディング状態をON
        setIsSending(true);

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
                    // レスポンスの処理
                    console.log("音声アップロード成功:", response);
                    setIsSending(false);
                },
                onError: (errors) => {
                    console.error("音声の送信に失敗しました:", errors);
                    alert("音声の送信に失敗しました。");
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

    // 最新のsender: 2のメッセージを取得
    const latestSenderMessage: MessageType | undefined = useMemo(() => {
        return [...messages].reverse().find((message) => message.sender === 2);
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            {/* メッセージリスト - スクロール可能なエリア */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-4 p-4">
                    {messages.map((message) => (
                        <div key={message.id}>
                            {message.sender === 1 ? (
                                <UserMessage message={message} />
                            ) : (
                                <div>
                                    <AiMessage
                                        message={message}
                                        flashData={flashData}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div ref={messagesEndRef} /> {/* 末尾に空のdiv */}
            </div>

            {/* ローディング中の表示 */}
            {isSending && <LoadingSppiner />}

            {/* マイクボタンとタイマー表示 */}
            <div className="flex items-center justify-end gap-4 mb-4 mr-4">
                {/* 録音時間の表示 */}
                {isRecording && (
                    <div className="flex items-center gap-2">
                        <div className="animate-pulse">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-lg font-medium text-white min-w-[130px] text-right font-mono">
                            {`${formatTime(recordingTime)}/${formatTime(
                                MAX_RECORDING_TIME
                            )}`}
                        </span>
                    </div>
                )}

                {/* マイクボタン */}
                <button
                    className={`p-3 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${
                            isRecording
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-white hover:bg-gray-50"
                        }`}
                    onClick={isRecording ? stopRecording : startRecording}
                    aria-label={isRecording ? "録音停止" : "録音開始"}
                >
                    <HiMicrophone
                        className={`w-12 h-12 ${
                            isRecording ? "text-white" : "text-gray-600"
                        }`}
                    />
                </button>
            </div>
        </div>
    );
};

export default ChatContainer;
