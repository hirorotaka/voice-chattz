import { MessageType } from "@/types/types";

type UserMessageProps = {
    message: MessageType;
};

const UserMessage = ({ message }: UserMessageProps) => {
    return (
        <div className="flex items-center gap-2 mb-4 justify-end w-full">
            {" "}
            {/* w-1/2を削除、w-fullに変更 */}
            <div className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-lg bg-teal-200 max-w-[30vw]">
                    <p className="text-lg break-words">{message.message_en}</p>
                    <p className="text-lg text-gray-600 break-words">
                        {message.message_ja}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center px-3 py-1 rounded bg-gray-200 flex-shrink-0">
                <span className="text-sm font-medium">You</span>
            </div>
        </div>
    );
};

export default UserMessage;
