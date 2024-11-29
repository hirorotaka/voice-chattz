import { Head } from "@inertiajs/react";
import { ReactNode, useState } from "react";
import { SideMenu } from "@/Components/SideMenu/SideMenu";
import { SideToggleButton } from "@/Components/SideMenu/SideToggleButton";
import ProfileDropdown from "@/Components/Header/ProfileDropdown";

interface AppLayoutProps {
    title: string;
    activeThreadId?: number;
    children: ReactNode;
}

export default function AppLayout({
    title,
    children,
    activeThreadId,
}: AppLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <Head title={title} />
            <div className="flex max-h-screen bg-blue-950">
                {/* Sidebar */}
                <div
                    className={`fixed md:static overflow-hidden z-40 h-full ${
                        isSidebarOpen ? "w-72" : "w-0"
                    } duration-300 ease-in-out`}
                >
                    <SideMenu
                        onToggle={handleSidebarToggle}
                        activeThreadId={activeThreadId}
                    />
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="sticky top-0 bg-blue-950 p-4">
                        <header className="flex items-center h-8 px-4 bg-blue-950">
                            {!isSidebarOpen && (
                                <SideToggleButton
                                    onClick={handleSidebarToggle}
                                    variant="header"
                                />
                            )}
                            <div className="ml-auto text-white font-bold text-2xl">
                                <ProfileDropdown />
                            </div>
                        </header>
                    </div>

                    {/* Content area - 残りの空間を使用 */}
                    <main className="flex-1 overflow-hidden ">{children}</main>
                </div>

                {/* md以下の時の背景 背景が暗くなってクリックで閉じる*/}
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
