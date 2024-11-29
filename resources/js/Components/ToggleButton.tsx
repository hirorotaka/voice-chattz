import { HiMenu } from "react-icons/hi";

interface ToggleButtonProps {
    className?: string;
    onClick?: () => void;
    variant?: "sidebar" | "header";
}

export const ToggleButton = ({
    className = "",
    onClick,
    variant = "header",
}: ToggleButtonProps) => {
    const baseStyles = "flex items-center justify-center border-0 p-2 rounded";
    const variantStyles = {
        sidebar: "bg-blue-700 hover:bg-blue-600",
        header: "bg-blue-800 hover:bg-blue-700 text-white",
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            onClick={onClick}
        >
            <HiMenu className="h-5 w-5" />
        </button>
    );
};

export default ToggleButton;
