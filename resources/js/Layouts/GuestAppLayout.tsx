import { Head } from "@inertiajs/react";
import { ReactNode } from "react";
import { GuestSideMenu } from "@/Components/SideMenu/GuestSideMenu";
import { SideToggleButton } from "@/Components/SideMenu/SideToggleButton";
import { useAppContext } from "@/Contexts/AppContext";

interface GuestAppLayoutProps {
    title: string;
    children: ReactNode;
}

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

                {/* Main content */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Header */}
                    <header className="flex items-center h-16 p-4">
                        {!isSidebarOpen && (
                            <SideToggleButton variant="header" />
                        )}
                    </header>
                    {/* Content area */}
                    <main className="flex-1 pb-5 overflow-y-auto">
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
