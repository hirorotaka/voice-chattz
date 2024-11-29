import { Head } from "@inertiajs/react";
import { useState } from "react";
import { LearningGrid } from "@/Components/LearningGrid";
import { SideMenu } from "@/Components/SideMenu/SideMenu";
import { LogoutButton } from "@/Components/utils/LogoutButton";
import { SideToggleButton } from "@/Components/SideMenu/SideToggleButton";

export default function Top() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        // ログアウト処理をここに実装
        console.log("Logout clicked");
    };

    return (
        <>
            <Head title="top" />
            <div className="flex min-h-screen bg-blue-950">
                <SideMenu isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                <div className="flex-1 min-w-0">
                    <div className="sticky top-0 z-10 bg-blue-950 p-4">
                        <div className="flex justify-between items-center">
                            {!isSidebarOpen && (
                                <SideToggleButton
                                    onClick={toggleSidebar}
                                    variant="header"
                                />
                            )}
                            <LogoutButton
                                className="ml-auto"
                                onClick={handleLogout}
                            />
                        </div>
                    </div>
                    <div className="p-4 sm:p-8 flex flex-col">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white">
                            英会話学習記録
                        </h2>
                        <div className="overflow-x-auto">
                            <LearningGrid />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
