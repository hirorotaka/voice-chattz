import PublicRoleToggleButton from "@/Components/Role/PublicRoleToggleButton";
import TruncatedText from "@/Components/Utils/TruncatedText";
import { ROLE_TABLE_NAMES } from "@/constants/utils";
import { PublicRoleType } from "@/types/types";

interface DesktopTableProps {
    publicRoles: PublicRoleType[];
}

const DesktopPublicRolesTable = ({ publicRoles }: DesktopTableProps) => (
    <div className="overflow-x-auto  overflow-y-auto rounded-lg shadow-md">
        <div className="overflow-x-auto h-[calc(100vh-300px)]">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                            {ROLE_TABLE_NAMES.ai_character}
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                            {ROLE_TABLE_NAMES.first_message}
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                            {ROLE_TABLE_NAMES.description}
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                            言語 <br />
                            モード
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                            使用
                            <br />
                            する
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {publicRoles.map((role) => (
                        <tr key={role.id} className="hover:bg-gray-50">
                            <td className="px-2 py-3 text-xs text-gray-500 break-words w-24">
                                {role.name}
                            </td>
                            <td className="px-2 py-3 text-xs text-gray-500 min-w-36">
                                <TruncatedText
                                    text={role.first_message}
                                    maxLength={100}
                                />
                            </td>
                            <td className="px-2 py-3 text-xs text-gray-500 max-w-70">
                                <TruncatedText
                                    text={role.description}
                                    maxLength={200}
                                />
                            </td>
                            <td className="px-2 py-3 text-xs text-gray-500 min-w-16">
                                {role.language_name}
                            </td>
                            <td className="px-2 py-3 text-xs text-gray-500">
                                <PublicRoleToggleButton
                                    isUsing={role.is_using}
                                    roleId={role.id}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default DesktopPublicRolesTable;
