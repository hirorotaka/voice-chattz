import { MessageType } from "@/Pages/Thread/Show";

type UserMessageProps = {
    message: MessageType;
};

const UserMessage = ({ message }: UserMessageProps) => {
    return (
        <div className="flex items-center gap-2 mb-4 justify-end">
            <div className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-gray-200">
                    <p className="text-lg">{message.message_en}</p>
                    <p className="text-lg text-gray-600">
                        {message.message_ja}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center px-3 py-1 rounded bg-gray-200">
                <span className="text-sm font-medium">You</span>
            </div>
        </div>
    );
};

export default UserMessage;
