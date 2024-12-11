import { router } from "@inertiajs/react";
import { Button } from "flowbite-react";
import { HiOutlineLogin } from "react-icons/hi";

interface LogoutButtonProps {
    className?: string;
    onClick?: () => void;
}

export const LoginButton = ({ className = "" }: LogoutButtonProps) => {
    const handleLogout = () => {
        router.get(route("login"));
    };

    return (
        <Button
            color="gray"
            className={`mt-4 font-bold bg-gray-300 hover:bg-gray-400 whitespace-nowrap ${className}`}
            onClick={handleLogout}
        >
            <HiOutlineLogin className="mr-2 h-5 w-5" />
            ログイン
        </Button>
    );
};
