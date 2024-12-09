import AppLayout from "@/Layouts/AppLayout";
import ChatContainer from "@/Components/Chat/ChatContainer";
import {
    IsUsingRoleType,
    LanguageType,
    MessageType,
    ThreadType,
} from "@/types/types";

interface ShowProps {
    thread: ThreadType;
    threads: ThreadType[];
    messages: MessageType[];
    activeThreadId: number;
    languages: LanguageType[];
    isUsingMyRoles: IsUsingRoleType[];
}

export default function Show({
    thread,
    threads,
    messages,
    activeThreadId,
    languages,
    isUsingMyRoles,
}: ShowProps) {
    return (
        <AppLayout
            title="show"
            thread={thread}
            threads={threads}
            activeThreadId={activeThreadId}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <ChatContainer
                thread={thread}
                messages={messages}
                activeThreadId={activeThreadId}
            />
        </AppLayout>
    );
}
