// resources/js/Contexts/LayoutContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
    isSidebarOpen: boolean;
    handleSidebarToggle: () => void;
    globalPlaybackRate: number;
    setGlobalPlaybackRate: React.Dispatch<React.SetStateAction<number>>;
    handlePlaybackRateChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
    handlePlaybackRateReset: () => void;
}

interface AppProviderProps {
    children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // グローバル再生速度
    const [globalPlaybackRate, setGlobalPlaybackRate] = useState(1.0);

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

    const value: AppContextType = {
        isSidebarOpen,
        handleSidebarToggle,
        globalPlaybackRate,
        setGlobalPlaybackRate,
        handlePlaybackRateChange,
        handlePlaybackRateReset,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }
    return context;
}
