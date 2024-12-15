import { Head } from "@inertiajs/react";
import { ReactNode } from "react";
import { SideMenu } from "@/Components/SideMenu/SideMenu";
import { SideToggleButton } from "@/Components/SideMenu/SideToggleButton";
import ProfileDropdown from "@/Components/Header/ProfileDropdown";
import { useAppContext } from "@/Contexts/AppContext";
import { IsUsingRoleType, LanguageType, ThreadType } from "@/types/types";
import { FavoriteButton } from "@/Components/Utils/FavoriteButton";
import { Tooltip } from "flowbite-react";

interface AppLayoutProps {
    title: string;
    children: ReactNode;
    threads: ThreadType[];
    thread?: ThreadType;
    activeThreadId?: number | null;
    languages: LanguageType[];
    roles: IsUsingRoleType[];
}

// 言語ロケールの型定義
type LocaleType = "en" | "ja" | "ko" | "de";

type LanguageTexts = {
    [key in LocaleType]: string;
};

// 言語モードと役割の表示テキストを定義
const languageModeText: LanguageTexts = {
    en: "Language Mode: English",
    ja: "言語モード：日本語",
    ko: "언어 모드: 한국어",
    de: "Sprachmodus: Deutsch",
};

const roleText: LanguageTexts = {
    en: "Role: ",
    ja: "役割：",
    ko: "역할: ",
    de: "Rolle: ",
};

const defaultRoleText: LanguageTexts = {
    en: "Default",
    ja: "デフォルト",
    ko: "기본",
    de: "Standard",
};

export default function AppLayout({
    title,
    children,
    thread,
    threads,
    activeThreadId,
    languages,
    roles,
}: AppLayoutProps) {
    const { isSidebarOpen, handleSidebarToggle } = useAppContext();

    // 言語に基づいて表示テキストを取得する関数
    const getLanguageModeText = (locale: string | undefined): string => {
        if (!locale) return languageModeText.ja; // デフォルトは日本語
        return languageModeText[locale as LocaleType] || languageModeText.ja;
    };

    const getRoleText = (locale: string | undefined): string => {
        if (!locale) return roleText.ja; // デフォルトは日本語
        return roleText[locale as LocaleType] || roleText.ja;
    };

    const getDefaultRoleText = (locale: string | undefined): string => {
        if (!locale) return defaultRoleText.ja; // デフォルトは日本語
        return defaultRoleText[locale as LocaleType] || defaultRoleText.ja;
    };

    // 現在の言語ロケールを安全に取得
    const currentLocale = thread?.language?.locale;

    return (
        <>
            <Head title={title} />
            <div className="flex h-screen overflow-hidden bg-blue-950">
                {/* Sidebar */}
                <div
                    className={`fixed md:static overflow-hidden z-40 h-full ${
                        isSidebarOpen ? "w-64" : "w-0"
                    } duration-300 ease-in-out`}
                >
                    <SideMenu
                        threads={threads}
                        activeThreadId={activeThreadId}
                        languages={languages}
                        roles={roles}
                    />
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Header */}
                    <div className="sticky top-0 z-30 bg-blue-950 shadow-lg w-full">
                        <header className="flex items-center h-10 sm:h-16 px-4">
                            {!isSidebarOpen && (
                                <SideToggleButton variant="header" />
                            )}
                            {thread && (
                                <Tooltip
                                    content={
                                        <span className="text-md font-bold">
                                            ピン留め
                                        </span>
                                    }
                                    placement="bottom"
                                    style="light"
                                >
                                    <FavoriteButton thread={thread} />
                                </Tooltip>
                            )}
                            {thread && (
                                <>
                                    <div>
                                        <div className="text-white font-bold text-xs sm:text-base">
                                            {getLanguageModeText(currentLocale)}
                                        </div>
                                        <div className="text-white font-bold text-xs sm:text-base">
                                            {getRoleText(currentLocale)}
                                            {thread.prompt?.name ||
                                                getDefaultRoleText(
                                                    currentLocale
                                                )}
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="ml-auto text-white font-bold text-2xl">
                                <ProfileDropdown />
                            </div>
                        </header>
                    </div>

                    {/* Content area */}
                    <main className="flex-1 overflow-y-auto">{children}</main>
                </div>

                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={handleSidebarToggle}
                    />
                )}
            </div>
        </>
    );
}
