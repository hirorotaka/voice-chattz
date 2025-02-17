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
                <div className="px-4 py-2 rounded-lg bg-teal-200 sm:max-w-[40vw]">
                    <p className="text-xs sm:text-lg break-words">
                        {message.content}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300">
                <span className="text-sm font-medium">You</span>
            </div>
        </div>
    );
};

export default UserMessage;
