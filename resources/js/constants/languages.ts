import { LanguageSelectType } from "@/types/types";

export const LANGUAGE_CONFIGS: { [key: number]: LanguageSelectType } = {
    1: {
        id: 1,
        locale: "en",
        name: "English",
        defaultTitle: "Untitled Thread",
    },
    2: {
        id: 2,
        locale: "ja",
        name: "日本語",
        defaultTitle: "無題のスレッド",
    },
    3: {
        id: 3,
        locale: "ko",
        name: "한국어",
        defaultTitle: "제목 없는 스레드",
    },
    // 新しい言語を追加する場合はここに追加するだけ
};

// 言語関連のユーティリティ関数
export const getLanguageConfig = (
    id: number
): LanguageSelectType | undefined => {
    return LANGUAGE_CONFIGS[id];
};

export const getDefaultTitle = (languageId: number): string => {
    return (
        LANGUAGE_CONFIGS[languageId]?.defaultTitle ||
        LANGUAGE_CONFIGS[2].defaultTitle
    ); // デフォルトは日本語
};
