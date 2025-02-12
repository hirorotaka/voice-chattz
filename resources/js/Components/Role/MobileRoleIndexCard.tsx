import RoleToggleButton from "@/Components/Role/RoleToggleButton";
import TruncatedText from "@/Components/Utils/TruncatedText";
import { ROLE_FORM_NAMES } from "@/constants/utils";
import { MyRoleType } from "@/types/types";
import { Tooltip } from "flowbite-react";
import React from "react";
import { HiTrash } from "react-icons/hi";
import { HiOutlinePencil } from "react-icons/hi2";

interface MobileRoleCardProps {
    role: MyRoleType;
    onEdit: (role: MyRoleType) => void;
    onDelete: (roleId: number) => void;
}

const MobileRoleIndexCard = ({
    role,
    onEdit,
    onDelete,
}: MobileRoleCardProps) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="space-y-3">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700">{role.name}</h3>
                <div className="flex items-center gap-2">
                    <Tooltip
                        content={
                            <span className="text-md font-bold">編集</span>
                        }
                        placement="bottom"
                        style="dark"
                        arrow={false}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(role);
                            }}
                            className="rounded text-gray-500 hover:text-gray-400 transition-colors"
                        >
                            <HiOutlinePencil className="h-5 w-5" />
                        </button>
                    </Tooltip>
                    <Tooltip
                        content={
                            <span className="text-md font-bold">削除</span>
                        }
                        placement="bottom"
                        style="dark"
                        arrow={false}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(role.id);
                            }}
                            className="rounded text-red-400 hover:text-red-300 transition-colors"
                        >
                            <HiTrash className="h-5 w-5" />
                        </button>
                    </Tooltip>
                </div>
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">
                    {ROLE_FORM_NAMES.first_message}:
                </p>
                <TruncatedText
                    text={role.first_message}
                    maxLength={100}
                    className="break-all"
                />
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">
                    {ROLE_FORM_NAMES.description}:
                </p>
                <TruncatedText
                    text={role.description}
                    maxLength={150}
                    className="break-all"
                />
            </div>

            <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">
                    {role.language?.name}
                </span>
                <RoleToggleButton isPublic={role.is_public} roleId={role.id} />
            </div>
        </div>
    </div>
);

export default MobileRoleIndexCard;
