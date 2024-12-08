// components/Toast.tsx
import {
    HiCheck,
    HiExclamation,
    HiX,
    HiInformationCircle,
    HiTrash,
} from "react-icons/hi";

type ToastProps = {
    message: string;
    type: "success" | "error" | "warning" | "info" | "delete";
    onDismiss: () => void;
};

const icons = {
    success: HiCheck,
    error: HiX,
    warning: HiExclamation,
    info: HiInformationCircle,
    delete: HiTrash,
};

export const Toast = ({ message, type, onDismiss }: ToastProps) => {
    const Icon = icons[type];

    return (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-[fade-in_0.3s_ease-in-out]">
            <div
                className={`flex items-center p-3 gap-3 min-w-[400px] bg-white/90 backdrop-blur-sm shadow-lg rounded-xl ${
                    type === "success"
                        ? "border-l-4 border-l-green-500"
                        : type === "error"
                        ? "border-l-4 border-l-red-500"
                        : type === "warning"
                        ? "border-l-4 border-l-yellow-500"
                        : type === "delete"
                        ? "border-l-4 border-l-red-500"
                        : "border-l-4 border-l-blue-500"
                } transition-all hover:translate-y-0.5 hover:bg-white/95`}
            >
                <div
                    className={`shrink-0 p-2 rounded-lg ${
                        type === "success"
                            ? "bg-green-100"
                            : type === "error"
                            ? "bg-red-100"
                            : type === "warning"
                            ? "bg-yellow-100"
                            : type === "delete"
                            ? "bg-red-100"
                            : "bg-blue-100"
                    }`}
                >
                    <Icon
                        className={`h-6 w-6 ${
                            type === "success"
                                ? "text-green-600"
                                : type === "error"
                                ? "text-red-600"
                                : type === "warning"
                                ? "text-yellow-600"
                                : type === "delete"
                                ? "text-red-600"
                                : "text-blue-600"
                        }`}
                    />
                </div>
                <div className="text-xl  text-black">{message}</div>
                <button
                    onClick={onDismiss}
                    className="ml-auto p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                >
                    <HiX className="h-6 w-6 text-black" />
                </button>
            </div>
        </div>
    );
};
