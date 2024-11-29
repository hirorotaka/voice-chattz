import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { LearningGrid } from "@/Components/LearningGrid";
import { SideMenu } from "@/Components/SideMenu/SideMenu";
import { LogoutButton } from "@/Components/Utils/LogoutButton";
import { SideToggleButton } from "@/Components/SideMenu/SideToggleButton";
import { Dropdown } from "flowbite-react";
import ProfileDropdown from "@/Components/Header/ProfileDropdown";

export default function Top() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <Head title="show" />
            <div className="flex min-h-screen bg-blue-950">
                {/* Sidebar */}
                <div
                    className={`fixed md:static overflow-hidden z-40 md:z-30 h-full ${
                        isSidebarOpen ? "w-64" : "w-0"
                    } duration-300 ease-in-out`}
                >
                    <SideMenu onToggle={toggleSidebar} activeThreadId={2} />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="sticky top-0 z-20 bg-blue-950 p-4">
                        <div className="flex justify-between items-center">
                            {!isSidebarOpen && (
                                <SideToggleButton
                                    onClick={toggleSidebar}
                                    variant="header"
                                />
                            )}
                            <div className="ml-auto text-white font-bold text-2xl">
                                <ProfileDropdown />
                            </div>
                        </div>
                    </div>

                    {/* Chat content */}
                    <div className="p-4 sm:p-8 flex flex-col">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white">
                            英会話学習記録
                        </h2>
                        <div className="overflow-x-auto">
                            <LearningGrid />
                        </div>
                    </div>
                </div>

                {/* md以下の時の背景 背景が暗くなってクリックで閉じる*/}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </div>
        </>
    );
}
