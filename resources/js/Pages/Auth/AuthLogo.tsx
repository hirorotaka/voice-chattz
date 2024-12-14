import { Link } from "@inertiajs/react";
import { HiMicrophone } from "react-icons/hi2";

const AuthLogo = () => {
    return (
        <div className="text-center">
            <Link href="/" className="group flex items-center justify-center">
                <div className="flex items-center justify-center w-8 h-8 sm:w-16 sm:h-16 mr-4 bg-white/10 rounded-2xl backdrop-blur-lg transition-all duration-300 group-hover:scale-105">
                    <HiMicrophone className="w-4 h-4 sm:w-8 sm:h-8 text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        voice chattz
                    </h1>
                    <p className="text-sm text-gray-400">AIと育む語学力</p>
                </div>
            </Link>
        </div>
    );
};

export default AuthLogo;
