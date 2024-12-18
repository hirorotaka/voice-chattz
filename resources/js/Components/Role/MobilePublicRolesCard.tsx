import PublicRoleToggleButton from "@/Components/Role/PublicRoleToggleButton";
import TruncatedText from "@/Components/Utils/TruncatedText";
import { ROLE_FORM_NAMES, ROLE_TABLE_NAMES } from "@/constants/utils";
import { PublicRoleType } from "@/types/types";
import React from "react";

interface MobileRoleCardProps {
    role: PublicRoleType;
}

const MobilePublicRolesCard = ({ role }: MobileRoleCardProps) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="space-y-2">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700">{role.name}</h3>
                <span className="text-sm text-gray-500">
                    {role.language_name}
                </span>
            </div>

            <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">
                    {ROLE_TABLE_NAMES.first_message}:
                </p>
                <TruncatedText text={role.first_message} maxLength={100} />
            </div>

            <div className="text-xs text-gray-600">
                <p className="font-medium mb-1">
                    {ROLE_TABLE_NAMES.description}:
                </p>
                <TruncatedText text={role.description} maxLength={150} />
            </div>

            <div className="flex justify-end mt-2">
                <PublicRoleToggleButton
                    isUsing={role.is_using}
                    roleId={role.id}
                />
            </div>
        </div>
    </div>
);

export default MobilePublicRolesCard;
