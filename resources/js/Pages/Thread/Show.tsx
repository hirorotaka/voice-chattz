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

export default function Show({
    threads: initialThreads,
    messages: initialMessages,
    activeThreadId,
}: ShowProps) {
    const { setThreads, setActiveThread, setMessages } = useAppContext();

    useEffect(() => {
        setThreads(initialThreads);
        setActiveThread(activeThreadId);
        setMessages(initialMessages);
    }, [initialThreads, activeThreadId, initialMessages]);

    return (
        <AppLayout title="show">
            <ChatContainer />
        </AppLayout>
    );
}
