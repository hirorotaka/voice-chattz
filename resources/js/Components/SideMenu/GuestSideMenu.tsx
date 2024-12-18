import { BsQuestionCircleFill } from "react-icons/bs";
import { Link } from "@inertiajs/react";
import SideToggleButton from "./SideToggleButton";
import { LoginButton } from "../Utils/LoginButton";
import { RegisterButton } from "../Utils/RegisterButton";
import { HiMicrophone } from "react-icons/hi2";

export const GuestSideMenu = () => {
    return (
        <>
            <div className="bg-blue-600 min-h-screen">
                <div className="w-64 p-4 h-screen flex flex-col">
                    {/* ヘッダー */}
                    <div className="flex items-center text-white mb-4">
                        <Link href={route("top")} className="flex items-center">
                            <HiMicrophone className="h-6 w-6 mr-2" />
                            <h1 className="text-lg font-semibold">
                                voice chattz
                            </h1>
                        </Link>
                        <SideToggleButton
                            className="ml-auto"
                            variant="sidebar"
                        />
                    </div>

                    <Link href={route("how-to-use")}>
                        <div className="flex items-center p-3 mb-4 text-white bg-blue-700 hover:bg-blue-600 rounded-lg shadow-md transition-colors duration-300">
                            <BsQuestionCircleFill className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span className="text-base font-medium">
                                使い方ガイド
                            </span>
                        </div>
                    </Link>
                    <LoginButton />
                    <RegisterButton />
                </div>
            </div>
        </>
    );
};
