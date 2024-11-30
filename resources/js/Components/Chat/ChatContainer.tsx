import { HiMicrophone } from "react-icons/hi2";
import AiMessage from "./AiMessage";
import UserMessage from "./UserMessage";
import { MessageType } from "@/types/types";
import { useEffect, useRef } from "react";
import { useAppContext } from "@/Contexts/AppContext";

const ChatContainer = () => {
    const { messages } = useAppContext();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isFirstRender = useRef(true); //再レンダリング間でも値を保持する必要があるため、useRefを使用
    const hasMessages = messages.length > 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: isFirstRender.current ? "auto" : "smooth",
        });
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
                                    <AiMessage message={message} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div ref={messagesEndRef} /> {/* 末尾に空のdiv */}
            </div>

            {/* マイクボタン - 固定位置 */}
            <div className="ml-auto mb-4">
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
