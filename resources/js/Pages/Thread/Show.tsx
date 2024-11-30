import AppLayout from "@/Layouts/AppLayout";
import ChatContainer from "@/Components/Chat/ChatContainer";
import { MessageType, ThreadType } from "@/types/types";
import { useEffect } from "react";
import { useAppContext } from "@/Contexts/AppContext";

interface ShowProps {
    threads: ThreadType[];
    messages: MessageType[];
    activeThreadId: number;
}

export default function Show({ threads, messages, activeThreadId }: ShowProps) {
    return (
        <AppLayout
            title="show"
            threads={threads}
            activeThreadId={activeThreadId}
        >
            <ChatContainer messages={messages} />
        </AppLayout>
    );
}
