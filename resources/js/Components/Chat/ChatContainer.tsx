import { MessageType } from "@/Pages/Thread/Show";
import ChatMessage from "./ChatMessage";
import { HiMicrophone } from "react-icons/hi2";

interface ChatProps {
    messages: MessageType[];
}

const ChatContainer = ({ messages }: ChatProps) => {
    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto pb-20">
                {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                ))}
            </div>
            <div className="fixed bottom-8 right-8">
                <button className="p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-transform hover:scale-105">
                    <HiMicrophone className="w-12 h-12 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default ChatContainer;
