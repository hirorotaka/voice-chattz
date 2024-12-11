// resources/js/Contexts/LayoutContext.tsx
import { Toast } from "@/Components/Utils/Toast";
import { createContext, useContext, useState, ReactNode } from "react";

// Toastの型定義を追加
interface ToastType {
    message: string;
    type: "success" | "error" | "warning" | "info" | "delete";
}

interface AppContextType {
    isSidebarOpen: boolean;
    handleSidebarToggle: () => void;
    globalPlaybackRate: number;
    setGlobalPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
    handlePlaybackRateChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
    handlePlaybackRateReset: () => void;
    // Toast関連の型を追加
    toast: ToastType | null;
    showToast: (message: string, type: ToastType["type"]) => void;
    hideToast: () => void;
    apiErrorToast: ToastType | null;
    apiErrorshowToast: (message: string, type: ToastType["type"]) => void;
    apiErrorhideToast: () => void;
}

interface AppProviderProps {
    children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // グローバル再生速度
    const [globalPlaybackRate, setGlobalPlaybackRate] = useState(1.0);

    // Toastのstate追加
    const [toast, setToast] = useState<ToastType | null>(null);
    // Toastのstate追加
    const [apiErrorToast, setApiErrorToast] = useState<ToastType | null>(null);

    const handlePlaybackRateChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setGlobalPlaybackRate(parseFloat(event.target.value));
    };

    const handlePlaybackRateReset = () => {
        setGlobalPlaybackRate(1.0);
    };

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Toast関連の関数を追加
    const showToast = (message: string, type: ToastType["type"] = "info") => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 2000);
    };

    const hideToast = () => {
        setToast(null);
    };

    // Toast関連の関数を追加
    const apiErrorshowToast = (
        message: string,
        type: ToastType["type"] = "info"
    ) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 5000);
    };

    const apiErrorhideToast = () => {
        setToast(null);
    };

    const value: AppContextType = {
        isSidebarOpen,
        handleSidebarToggle,
        globalPlaybackRate,
        setGlobalPlaybackRate,
        handlePlaybackRateChange,
        handlePlaybackRateReset,
        // Toast関連の値を追加
        toast,
        showToast,
        hideToast,
        // apiToast関連の値を追加
        apiErrorToast,
        apiErrorshowToast,
        apiErrorhideToast,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            {/* Toastコンポーネントをここで描画 */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDismiss={hideToast}
                />
            )}
        </AppContext.Provider>
    );
}

export function useAppContext(): AppContextType {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
}
