// types/message.ts
export type MessageType = {
    id: number;
    thread_id: number;
    content: string;
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
    error: string | null;
    errorId: string | null;
    audioUrl: string | null;
}
export interface LanguageType {
    id: number;
    name: string;
    locale: string;
    text_prompt: string;
    audio_prompt: string;
    created_at: string | null;
    updated_at: string | null;
}

// 自分の役割と公開役割（is_using = 1）の型
export interface IsUsingRoleType {
    id: number;
    name: string;
    first_message: string; // first_message を追加
    description: string;
    language: LanguageType;
    is_using: 0 | 1;
    is_public: 0 | 1;
    is_owned: 0 | 1;
}

//公開役割一覧の型
export interface PublicRoleType {
    id: number;
    name: string;
    first_message: string; // first_message を追加
    description: string;
    language_name: string;
    is_using: 0 | 1;
}

//役割一覧の型
export interface MyRoleType {
    id: number;
    name: string;
    first_message: string; // first_message を追加
    description: string;
    language_id: number;
    is_public: 0 | 1;
    language: LanguageType | null;
    created_at: string;
    updated_at: string;
}

export interface PromptType {
    id: number;
    name: string;
    description: string;
    thread_id: number;
}

export interface LanguageSelectType {
    id: number;
    locale: string;
    name: string;
    defaultTitle: string;
}

export interface SlideType {
    title: string;
    description: string;
    image: string;
}
