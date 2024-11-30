// resources/js/Contexts/LayoutContext.tsx
import { MessageType, ThreadType } from "@/types/types";
import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
    isSidebarOpen: boolean;
    handleSidebarToggle: () => void;
    threads: ThreadType[];
    setThreads: React.Dispatch<React.SetStateAction<ThreadType[]>>;
    activeThread: number | null;
    setActiveThread: React.Dispatch<React.SetStateAction<number | null>>;
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

interface AppProviderProps {
    children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [threads, setThreads] = useState<ThreadType[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [activeThread, setActiveThread] = useState<number | null>(null);

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const value: AppContextType = {
        isSidebarOpen,
        handleSidebarToggle,
        threads,
        setThreads,
        activeThread,
        setActiveThread,
        messages,
        setMessages,
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
