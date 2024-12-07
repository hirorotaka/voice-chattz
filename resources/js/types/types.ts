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
    id: number;
    user_id: string;
    language_id: number;
    role_id: number;
    title: string;
    favorite: boolean;
    created_at: string; // ISO形式のタイムスタンプ
    updated_at: string; // ISO形式のタイムスタンプ
    language?: LanguageType;
    prompt?: PromptType;
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

export interface RoleType {
    id: number;
    name: string;
    first_message: string; // first_message を追加
    description: string;
    language?: LanguageType;
    language_id: number;
    created_at: string;
    updated_at: string;
}

export interface PromptType {
    id: number;
    name: string;
    description: string;
    thread_id: number;
}
