import { Head, router } from "@inertiajs/react";
import { ReactNode, useState } from "react";
import { SideMenu } from "@/Components/SideMenu/SideMenu";
import { SideToggleButton } from "@/Components/SideMenu/SideToggleButton";
import ProfileDropdown from "@/Components/Header/ProfileDropdown";
import { useAppContext } from "@/Contexts/AppContext";
import { ThreadType } from "@/types/types";
import { HiOutlineStar, HiStar } from "react-icons/hi2";
import { FavoriteButton } from "@/Components/Utils/FavoriteButton";
import { Tooltip } from "flowbite-react";

interface AppLayoutProps {
    title: string;
    children: ReactNode;
    threads: ThreadType[];
    thread?: ThreadType;
    activeThreadId?: number | null;
}

export default function AppLayout({
    title,
    children,
    thread,
    threads,
    activeThreadId,
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
                                    placement="right"
                                    style="light"
                                >
                                    <FavoriteButton thread={thread} />
                                </Tooltip>
                            )}
                            <div className="ml-auto text-white font-bold text-2xl">
                                <ProfileDropdown />
                            </div>
                        </header>
                    </div>

                    {/* Content area */}
                    <main className="flex-1 overflow-y-auto p-5">
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
