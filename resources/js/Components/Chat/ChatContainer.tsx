import { MessageType } from "@/Pages/Thread/Show";
import { HiMicrophone } from "react-icons/hi2";
import AiMessage from "./AiMessage";
import UserMessage from "./UserMessage";

interface ChatProps {
    messages: MessageType[];
}

const ChatContainer = ({ messages }: ChatProps) => {
    return (
        <div className="relative h-full">
            {/* メッセージエリア */}
            <div className="absolute inset-0 p-10 overflow-y-auto">
                <div className="space-y-4 pb-24">
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
            </div>

            {/* マイクボタン */}
            <div className="absolute bottom-8 right-8">
                <button className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-transform hover:scale-105">
                    <HiMicrophone className="w-12 h-12 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default ChatContainer;
