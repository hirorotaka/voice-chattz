import { MessageType } from "@/Pages/Thread/Show";
import { HiSpeakerWave } from "react-icons/hi2";

type AiMessageProps = {
    message: MessageType;
};

const AiMessage = ({ message }: AiMessageProps) => {
    return (
        <div className="flex items-center gap-2 mb-4 justify-start">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300">
                <span className="text-sm font-medium">AI</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-gray-200">
                    <p className="text-lg">{message.message_en}</p>
                    <p className="text-lg text-gray-600">
                        {message.message_ja}
                    </p>
                </div>
                {message.audio_file_path && (
                    <button className="p-1 hover:bg-gray-200 rounded-full">
                        <HiSpeakerWave className="w-5 h-5 text-gray-400" />
                    </button>
                )}
                <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-200">
                    <span className="text-sm font-medium">Aあ</span>
                </div>
            </div>
        </div>
    );
};

export default AiMessage;
