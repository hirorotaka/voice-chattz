import { MessageType, ThreadType } from "@/types/types";
import { memo } from "react";
import UserMessage from "./UserMessage";
import AiMessage from "./AiMessage";

interface MessageListProps {
    messages: MessageType[];
    isCreatingMessage: boolean;
    thread: ThreadType;
    flashData: any;
    handleactivePlayAudio: (id: number | null) => void;
    isActiveAiSound: number | null;
    globalPlaybackRate: number;
    audioUrl: string | null;
}

export const MessageList = memo(
    ({
        messages,
        isCreatingMessage,
        thread,
        flashData,
        handleactivePlayAudio,
        isActiveAiSound,
        globalPlaybackRate,
        audioUrl,
    }: MessageListProps) => (
        <div className="flex flex-col gap-2 p-4">
            {messages.map((message) => (
                <div key={message.id}>
                    {message.sender === 1 ? (
                        <UserMessage message={message} />
                    ) : (
                        <AiMessage
                            message={message}
                            flashData={flashData}
                            handleactivePlayAudio={handleactivePlayAudio}
                            isActiveAiSound={isActiveAiSound}
                            playbackRate={globalPlaybackRate}
                            thread={thread}
                            audioUrl={audioUrl}
                        />
                    )}
                </div>
            ))}
            {isCreatingMessage && (
                <div className="animate-pulse">
                    <AiMessage />
                </div>
            )}
        </div>
    )
);

MessageList.displayName = "MessageList";
