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
            title="スレッド"
            thread={thread}
            threads={threads}
            activeThreadId={activeThreadId}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="h-full sm:h-[calc(100vh-100px)]">
                <ChatContainer
                    thread={thread}
                    messages={messages}
                    activeThreadId={activeThreadId}
                />
            </div>
        </AppLayout>
    );
}
