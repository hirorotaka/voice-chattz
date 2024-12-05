import { HiMicrophone } from "react-icons/hi2";
import AiMessage from "./AiMessage";
import UserMessage from "./UserMessage";
import { flashType, MessageType } from "@/types/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import LoadingSppiner from "../Utils/LoadingSppiner";
import startSound from "../../../../storage/app/public/sounds/start.mp3";
import endSound from "../../../../storage/app/public/sounds/end.mp3";
import useSound from "use-sound";
import { Tooltip } from "flowbite-react";

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

    // キャンセルフラグをRefで管理
    const isCancelledRef = useRef(false);

    // プラッシュデータを取得
    const { flashData, success } = usePage().props.flash as flashType;

    // 録音用の音声ファイルを読み込む
    const [startSoundplay, { sound: startSoundHowl }] = useSound(startSound, {
        volume: 0.1,
    });
    const [endSoundplay, { sound: endSoundHowl }] = useSound(endSound, {
        volume: 0.1,
    });

    const [isSePlaying, setIsSePlaying] = useState(false);

    const [isActiveAiSound, setIsActiveAiSound] = useState<null | number>(null);

    const handleactivePlayAudio = (messageId: number | null) => {
        setIsActiveAiSound(messageId);
    };

    // メッセージ作成中の状態を追加
    const [isCreatingMessage, setIsCreatingMessage] = useState(false);

    // 録音時間を表示用にフォーマットする関数
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    const handleMicButtonClickStart = async () => {
        // 録音中か、SE音声再生中の場合は何もしない
        if (isRecording || isSePlaying) {
            return;
        }

        setIsSePlaying(true);
        // 録音処理の前に音を再生
        startSoundplay();

        // 音声の再生が終了したら、録音処理を実行
        // Howlオブジェクトを受け取り、イベントリスナを1回だけ実行
        startSoundHowl?.once("end", async () => {
            // 録音処理を実行
            await startRecording();
            setIsSePlaying(false);
        });
    };
    const handleMicButtonClickStop = async () => {
        //SE音声再生中の場合は何もしない
        if (isSePlaying) {
            return;
        }
        setIsSePlaying(true);
        // 録音停止の前に音を再生
        endSoundplay();

        // 音声の再生が終了したら、録音処理を実行
        endSoundHowl?.once("end", async () => {
            // 録停止処理を実行
            stopRecording();
            setIsSePlaying(false);
        });
    };

    const cancelRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
        ) {
            // キャンセルフラグを立てる（即時反映）
            isCancelledRef.current = true;

            // 初期化処理
            cleanupRecording();
        }
    };

    // 初期化処理を共通化
    const cleanupRecording = () => {
        // 録音を停止
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            // ストリームを停止
            mediaRecorderRef.current.stream
                .getTracks()
                .forEach((track) => track.stop());
            mediaRecorderRef.current = null;
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
            // クリーンアップ処理
            if (mediaRecorderRef.current) {
                cleanupRecording();
            }
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
                // キャンセルされていない場合のみ、データを送信
                if (
                    !isCancelledRef.current &&
                    audioChunksRef.current.length > 0
                ) {
                    const audioBlob = new Blob(audioChunksRef.current, {
                        type: "audio/wav",
                    });
                    await sendAudioToServer(audioBlob);
                }

                // キャンセルフラグをリセット
                isCancelledRef.current = false;

                // ストリームを解放
                stream.getTracks().forEach((track) => track.stop());
            };

            // 録音開始
            mediaRecorder.start();
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
    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
        ) {
            // 通常の停止なのでキャンセルフラグは false
            isCancelledRef.current = false;

            // 録音停止後すぐにPOST送信するためローディング状態をON
            setIsSending(true);

            // 初期化処理
            cleanupRecording();
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
                    console.log("音声アップロード成功:", response);

                    // 音声が無音の場合はアラートを表示
                    if (
                        (response.props.flash as flashType).flashData ===
                        "noSound"
                    ) {
                        alert("無音でした。音声登録をもう一度お願いします。");
                    }

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
                    // エラーメッセージに応じて処理を分岐
                    if (errors.error === "無音でした。") {
                        alert("無音でした。もう一度録音してください。");
                    } else {
                        console.error("音声の送信に失敗しました:", errors);
                        alert("音声の送信に失敗しました。");
                    }
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
                <div className="flex flex-col gap-2 p-4">
                    {messages.map((message) => (
                        <div key={message.id}>
                            {message.sender === 1 ? (
                                <UserMessage message={message} />
                            ) : (
                                <AiMessage
                                    message={message}
                                    flashData={flashData}
                                    handleactivePlayAudio={
                                        handleactivePlayAudio
                                    }
                                    isActiveAiSound={isActiveAiSound}
                                />
                            )}
                        </div>
                    ))}
                    {/* AI応答中の表示 */}
                    {isCreatingMessage && (
                        <div className="animate-pulse">
                            <AiMessage />
                        </div>
                    )}
                </div>
                <div ref={messagesEndRef} /> {/* 末尾に空のdiv */}
            </div>

            {/* マイクボタンとタイマー表示 */}
            <div className="flex items-center justify-end mr-4">
                {/* 録音中またはSE再生中のオーバーレイ - マイクボタン以外を押せないようにする */}
                {(isRecording || isSePlaying) && (
                    <div className="fixed inset-0 bg-black/5 backdrop-blur-[0.7px] z-40" />
                )}
                {/* Ai応答中のオーバーレイ  */}
                {isCreatingMessage && (
                    <div className="fixed inset-0 bg-black/5 backdrop-blur-[0.5px] z-50" />
                )}

                {/* ローディング中の表示とオーバーレイ */}
                {isSending && (
                    <>
                        <div className="fixed inset-0 backdrop-blur-[0.7px] bg-black/5 z-50 transition-all duration-300 ease-in-out" />
                        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ease-in-out">
                            <LoadingSppiner />
                        </div>
                    </>
                )}
                {/* 録音時間とコントロールの表示 */}
                {isRecording && (
                    <div className="flex items-center gap-4 relative mr-4 z-40">
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

                        {/* キャンセルボタン */}
                        <button
                            onClick={cancelRecording}
                            className="px-4 py-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors duration-200"
                            aria-label="録音キャンセル"
                        >
                            キャンセル
                        </button>
                    </div>
                )}

                {/* マイクボタン - 録音中も操作可能にするため z-40 を設定 */}
                {isActiveAiSound ? (
                    <button className="p-3 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none  relative z-40 bg-gray-400">
                        <HiMicrophone className="w-12 h-12 text-gray-600" />
                    </button>
                ) : (
                    <Tooltip
                        content={
                            <span className="text-md font-bold">
                                {isRecording ? "録音停止" : "録音開始"}
                            </span>
                        }
                        placement="top"
                        style="light"
                        arrow={false}
                        theme={{
                            base: "absolute z-40 inline-block rounded-lg px-3 py-2 text-sm font-medium shadow-sm",
                        }}
                        // baseのレイアウトを修正
                    >
                        <button
                            className={`p-3 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-40
            ${
                isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-white hover:bg-gray-50"
            }`}
                            onClick={
                                isRecording
                                    ? handleMicButtonClickStop
                                    : handleMicButtonClickStart
                            }
                            aria-label={isRecording ? "録音停止" : "録音開始"}
                        >
                            <HiMicrophone
                                className={`w-12 h-12 ${
                                    isRecording ? "text-white" : "text-gray-600"
                                }`}
                            />
                        </button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

export default ChatContainer;
