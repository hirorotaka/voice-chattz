import { HiMicrophone } from "react-icons/hi2";
import AiMessage from "./AiMessage";
import UserMessage from "./UserMessage";
import { MessageType } from "@/Pages/Thread/Show";

interface ChatProps {
    messages: MessageType[];
}

const ChatContainer = ({ messages }: ChatProps) => {
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
