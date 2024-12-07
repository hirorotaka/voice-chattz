import { Head, router } from "@inertiajs/react";
import { ReactNode, useState } from "react";
import { SideMenu } from "@/Components/SideMenu/SideMenu";
import { SideToggleButton } from "@/Components/SideMenu/SideToggleButton";
import ProfileDropdown from "@/Components/Header/ProfileDropdown";
import { useAppContext } from "@/Contexts/AppContext";
import { LanguageType, RoleType, ThreadType } from "@/types/types";
import { HiOutlineStar, HiStar } from "react-icons/hi2";
import { FavoriteButton } from "@/Components/Utils/FavoriteButton";
import { Tooltip } from "flowbite-react";

interface AppLayoutProps {
    title: string;
    children: ReactNode;
    threads: ThreadType[];
    thread?: ThreadType;
    activeThreadId?: number | null;
    languages: LanguageType[];
    roles: RoleType[];
}

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
                    <div className="sticky top-0 z-30 bg-blue-950 shadow-md">
                        <header className="flex items-center h-16 px-4">
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
                                        <div className="text-white font-bold text-base">
                                            {thread?.language?.locale === "en"
                                                ? "Language Mode:English"
                                                : "言語モード:日本語"}
                                        </div>
                                        <div className="text-white font-bold text-base">
                                            {thread?.language?.locale ===
                                            "en" ? (
                                                // 英語の場合
                                                <>
                                                    Role:{" "}
                                                    {thread.prompt?.name ||
                                                        "Default"}
                                                </>
                                            ) : (
                                                // 日本語の場合
                                                <>
                                                    役割：
                                                    {thread.prompt?.name ||
                                                        "デフォルト"}
                                                </>
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
                    <main className="flex-1 overflow-y-auto pb-5">
                        {children}
                    </main>
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
