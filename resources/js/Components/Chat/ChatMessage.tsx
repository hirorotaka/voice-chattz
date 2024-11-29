import { MessageType } from "@/Pages/Thread/Show";
import { HiSpeakerWave } from "react-icons/hi2";

type ChatMessageProps = {
    message: MessageType;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
    const isUser = message.sender === 1;

    return (
        <div
            className={`flex items-center gap-2 mb-4 ${
                isUser ? "justify-end" : "justify-start"
            }`}
        >
            {!isUser && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300">
                    <span className="text-sm font-medium">AI</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <div
                    className={`px-4 py-2 rounded-lg ${
                        isUser ? "bg-gray-200" : "bg-gray-200"
                    }`}
                >
                    <p className="text-sm">{message.message_en}</p>
                    <p className="text-sm text-gray-600">
                        {message.message_ja}
                    </p>
                </div>
                {!isUser && message.audio_file_path && (
                    <button className="p-1 hover:bg-gray-200 rounded-full">
                        <HiSpeakerWave className="w-5 h-5 text-gray-600" />
                    </button>
                )}
                {!isUser && (
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-200">
                        <span className="text-sm font-medium">Aあ</span>
                    </div>
                )}
            </div>
            {isUser && (
                <div className="flex items-center justify-center px-3 py-1 rounded bg-gray-200">
                    <span className="text-sm font-medium">You</span>
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
