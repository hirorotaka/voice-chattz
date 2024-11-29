import { Button } from "flowbite-react";
import { HiOutlineLogout } from "react-icons/hi";

interface LogoutButtonProps {
    className?: string;
    onClick?: () => void;
}

export const LogoutButton = ({
    className = "",
    onClick,
}: LogoutButtonProps) => {
    return (
        <Button
            color="gray"
            className={`bg-gray-300 hover:bg-gray-400 whitespace-nowrap ${className}`}
            onClick={onClick}
        >
            <HiOutlineLogout className="mr-2 h-5 w-5" />
            ログアウト
        </Button>
    );
};
