import { Head } from "@inertiajs/react";
import { ReactNode } from "react";
import { GuestSideMenu } from "@/Components/SideMenu/GuestSideMenu";
import { SideToggleButton } from "@/Components/SideMenu/SideToggleButton";
import { useAppContext } from "@/Contexts/AppContext";

interface GuestAppLayoutProps {
    title: string;
    children: ReactNode;
}

// 言語ロケールの型定義
type LocaleType = "en" | "ja" | "ko";

type LanguageTexts = {
    [key in LocaleType]: string;
};

// 言語モードと役割の表示テキストを定義
const languageModeText: LanguageTexts = {
    en: "Language Mode: English",
    ja: "言語モード：日本語",
    ko: "언어 모드: 한국어",
};

const roleText: LanguageTexts = {
    en: "Role: ",
    ja: "役割：",
    ko: "역할: ",
};

const defaultRoleText: LanguageTexts = {
    en: "Default",
    ja: "デフォルト",
    ko: "기본",
};

export default function GuestAppLayout({
    title,
    children,
}: GuestAppLayoutProps) {
    const { isSidebarOpen, handleSidebarToggle } = useAppContext();

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
                    <GuestSideMenu />
                </div>

                {/* Header */}
                <div className="sticky top-0 z-30 bg-blue-950 shadow-lg">
                    <header className="flex items-center h-16 px-4">
                        {!isSidebarOpen && (
                            <SideToggleButton variant="header" />
                        )}
                    </header>
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Content area */}
                    <main className="flex-1 pb-5">{children}</main>
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
