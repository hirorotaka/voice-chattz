import AppLayout from "@/Layouts/AppLayout";
import ChatContainer from "@/Components/Chat/ChatContainer";
import { LanguageType, MessageType, RoleType, ThreadType } from "@/types/types";
import { useEffect } from "react";
import { useAppContext } from "@/Contexts/AppContext";

interface ShowProps {
    thread: ThreadType;
    threads: ThreadType[];
    messages: MessageType[];
    activeThreadId: number;
    languages: LanguageType[];
    roles: RoleType[];
}

export default function Show({
    thread,
    threads,
    messages,
    activeThreadId,
    languages,
    roles,
}: ShowProps) {
    return (
        <AppLayout
            title="show"
            thread={thread}
            threads={threads}
            activeThreadId={activeThreadId}
            languages={languages}
            roles={roles}
        >
            <ChatContainer
                messages={messages}
                activeThreadId={activeThreadId}
            />
        </AppLayout>
    );
}
