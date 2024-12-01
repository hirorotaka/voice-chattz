import AppLayout from "@/Layouts/AppLayout";
import ChatContainer from "@/Components/Chat/ChatContainer";
import { MessageType, ThreadType } from "@/types/types";
import { useEffect } from "react";
import { useAppContext } from "@/Contexts/AppContext";

interface ShowProps {
    thread: ThreadType;
    threads: ThreadType[];
    messages: MessageType[];
    activeThreadId: number;
}

export default function Show({
    thread,
    threads,
    messages,
    activeThreadId,
}: ShowProps) {
    return (
        <AppLayout
            title="show"
            thread={thread}
            threads={threads}
            activeThreadId={activeThreadId}
        >
            <ChatContainer messages={messages} />
        </AppLayout>
    );
}
