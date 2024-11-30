import { HiMicrophone } from "react-icons/hi2";
import AiMessage from "./AiMessage";
import UserMessage from "./UserMessage";
import { MessageType } from "@/types/types";
import { useEffect, useRef } from "react";

// チャットのメッセージ仮データ
// メッセージデータをデータベース定義に合わせて修正
const messages: MessageType[] = [
    {
        id: 1,
        thread_id: "thread_1",
        message_en: "Hello",
        message_ja: "こんにちは",
        sender: 1,
        audio_file_path: "/audios/hello.mp3",
        created_at: "2024-03-14T10:00:00Z",
        updated_at: "2024-03-14T10:00:00Z",
    },
    {
        id: 2,
        thread_id: "thread_1",
        message_en: "Hi there! How can I help you today?",
        message_ja: "こんにちは！今日はどのようにお手伝いできますか？",
        sender: 2,
        audio_file_path: "/audios/response1.mp3",
        created_at: "2024-03-14T10:00:05Z",
        updated_at: "2024-03-14T10:00:05Z",
    },
    {
        id: 3,
        thread_id: "thread_1",
        message_en: "How are you?",
        message_ja: "お元気ですか？",
        sender: 1,
        audio_file_path: "/audios/how_are_you.mp3",
        created_at: "2024-03-14T10:00:10Z",
        updated_at: "2024-03-14T10:00:10Z",
    },
    {
        id: 4,
        thread_id: "thread_1",
        message_en: "I'm doing great, thank you! How about you?",
        message_ja: "はい、元気です！あなたはいかがですか？",
        sender: 2,
        audio_file_path: "/audios/response2.mp3",
        created_at: "2024-03-14T10:00:15Z",
        updated_at: "2024-03-14T10:00:15Z",
    },
];

const ChatContainer = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true); //再レンダリング間でも値を保持する必要があるため、useRefを使用

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: isFirstRender.current ? "auto" : "smooth",
        });
    };

    // 初回レンダリング時の処理
    useEffect(() => {
        scrollToBottom();
        isFirstRender.current = false;
    }, []);

    // メッセージが更新された時の処理
    useEffect(() => {
        if (!isFirstRender.current) {
            scrollToBottom();
        }
    }, [messages]);

    return (
        <div className="relative flex flex-col h-full">
            {/* メッセージリスト - スクロール可能なエリア */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-4 p-4">
                    {messages.map((message) => (
                        <div key={message.id}>
                            {message.sender === 1 ? (
                                <UserMessage message={message} />
                            ) : (
                                <div>
                                    <AiMessage message={message} />
                                    <AiMessage message={message} />
                                    <AiMessage message={message} />
                                    <AiMessage message={message} />
                                    <AiMessage message={message} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div ref={messagesEndRef} /> {/* 末尾に空のdiv */}
            </div>

            {/* マイクボタン - 固定位置 */}
            <div className="absolute bottom-6 right-6">
                <button
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="マイク"
                >
                    <HiMicrophone className="w-8 h-8 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default ChatContainer;
