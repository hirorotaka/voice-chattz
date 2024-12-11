import { router } from "@inertiajs/react";
import { Button } from "flowbite-react";
import { HiOutlineLogout } from "react-icons/hi";

interface LogoutButtonProps {
    className?: string;
    onClick?: () => void;
}

export const LogoutButton = ({ className = "" }: LogoutButtonProps) => {
    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <Button
            color="gray"
            className={`mt-4 font-bold bg-gray-300 hover:bg-gray-400 whitespace-nowrap ${className}`}
            onClick={handleLogout}
        >
            <HiOutlineLogout className="mr-2 h-5 w-5" />
            ログアウト
        </Button>
    );
};
