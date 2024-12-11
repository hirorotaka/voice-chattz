import { router } from "@inertiajs/react";
import { Button } from "flowbite-react";
import { FiEdit } from "react-icons/fi";

interface LogoutButtonProps {
    className?: string;
    onClick?: () => void;
}

export const RegisterButton = ({ className = "" }: LogoutButtonProps) => {
    const handleLogout = () => {
        router.get(route("register"));
    };

    return (
        <Button
            color="gray"
            className={`mt-4 font-bold bg-gray-300 hover:bg-gray-400 whitespace-nowrap ${className}`}
            onClick={handleLogout}
        >
            <FiEdit className="mr-2 h-5 w-5" />
            新規登録
        </Button>
    );
};
