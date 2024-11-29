import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { SideMenu } from "@/Components/SideMenu/SideMenu";
import { LogoutButton } from "@/Components/utils/LogoutButton";

import ChatContainer from "@/Components/Chat/ChatContainer";
import SideToggleButton from "@/Components/SideMenu/SideToggleButton";

// types/message.ts
export type MessageType = {
    id: number;
    thread_id: string;
    message_en: string;
    message_ja: string;
    sender: 1 | 2; // 1: user, 2: AI
    audio_file_path: string | null;
    created_at: string; // ISO形式のタイムスタンプ
    updated_at: string; // ISO形式のタイムスタンプ
};

export default function Show() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        router.post(route("logout"));
    };

    // チャットのメッセージ仮データ
    // メッセージデータをデータベース定義に合わせて修正
    const messages: MessageType[] = [
        {
            id: 1,
            thread_id: "thread_1",
            message_en: "Hello",
            message_ja: "こんにちは",
            sender: 1,
            audio_file_path: "/audios/hello.mp3",
            created_at: "2024-03-14T10:00:00Z",
            updated_at: "2024-03-14T10:00:00Z",
        },
        {
            id: 2,
            thread_id: "thread_1",
            message_en: "Hi there! How can I help you today?",
            message_ja: "こんにちは！今日はどのようにお手伝いできますか？",
            sender: 2,
            audio_file_path: "/audios/response1.mp3",
            created_at: "2024-03-14T10:00:05Z",
            updated_at: "2024-03-14T10:00:05Z",
        },
        {
            id: 3,
            thread_id: "thread_1",
            message_en: "How are you?",
            message_ja: "お元気ですか？",
            sender: 1,
            audio_file_path: "/audios/how_are_you.mp3",
            created_at: "2024-03-14T10:00:10Z",
            updated_at: "2024-03-14T10:00:10Z",
        },
        {
            id: 4,
            thread_id: "thread_1",
            message_en: "I'm doing great, thank you! How about you?",
            message_ja: "はい、元気です！あなたはいかがですか？",
            sender: 2,
            audio_file_path: "/audios/response2.mp3",
            created_at: "2024-03-14T10:00:15Z",
            updated_at: "2024-03-14T10:00:15Z",
        },
    ];

    return (
        <>
            <Head title="show" />
            <div className="flex min-h-screen bg-blue-950">
                {/* Sidebar */}
                <div
                    className={`
                            fixed md:static
                            overflow-hidden
                            z-40 md:z-30
                            h-full
                            ${isSidebarOpen ? "w-64" : "w-0"}
                            duration-300 ease-in-out
                        `}
                >
                    <SideMenu onToggle={toggleSidebar} activeThreadId={2} />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0 flex flex-col h-screen">
                    {/* Header */}
                    <div className="sticky top-0 z-20 bg-blue-950 p-4">
                        <div className="flex justify-between items-center">
                            {!isSidebarOpen && (
                                <SideToggleButton
                                    onClick={toggleSidebar}
                                    variant="header"
                                />
                            )}
                            <LogoutButton
                                className="ml-auto"
                                onClick={handleLogout}
                            />
                        </div>
                    </div>

                    {/* Chat content */}
                    <div className="flex-1">
                        <ChatContainer messages={messages} />
                    </div>
                </div>

                {/* md以下の時の背景 背景が暗くなってクリックで閉じる*/}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </div>
        </>
    );
}
