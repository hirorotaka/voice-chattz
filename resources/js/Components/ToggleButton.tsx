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
        sidebar: "bg-green-700 hover:bg-green-600",
        header: "bg-gray-600 hover:bg-gray-400",
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
