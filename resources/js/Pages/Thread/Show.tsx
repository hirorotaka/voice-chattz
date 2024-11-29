import AppLayout from "@/Layouts/AppLayout";
import ChatContainer from "@/Components/Chat/ChatContainer";

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
        <AppLayout title="show" activeThreadId={3}>
            <ChatContainer messages={messages} />
        </AppLayout>
    );
}
