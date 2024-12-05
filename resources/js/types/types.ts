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

export type ThreadType = {
    id: string;
    user_id: string;
    title: string;
    favorite: boolean;
    created_at: string; // ISO形式のタイムスタンプ
    updated_at: string; // ISO形式のタイムスタンプ
};

export interface flashType {
    success: boolean | null;
    flashData: number | string | null;
}
export interface LanguageType {
    id: number;
    name: string;
    locale: string;
    text_prompt: string;
    audio_prompt: string;
    created_at: string;
    updated_at: string;
}
