// resources/js/Contexts/LayoutContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
    isSidebarOpen: boolean;
    handleSidebarToggle: () => void;
}

interface AppProviderProps {
    children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const value: AppContextType = {
        isSidebarOpen,
        handleSidebarToggle,
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
