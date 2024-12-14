import RoleToggleButton from "@/Components/Role/RoleToggleButton";
import TruncatedText from "@/Components/Utils/TruncatedText";
import { MyRoleType } from "@/types/types";
import { Tooltip } from "flowbite-react";
import { HiTrash, HiOutlinePencil } from "react-icons/hi2";

interface DesktopTableProps {
    myRoles: MyRoleType[];
    onEdit: (role: MyRoleType) => void;
    onDelete: (roleId: number) => void;
}

const DesktopRoleIndexTable = ({
    myRoles,
    onEdit,
    onDelete,
}: DesktopTableProps) => (
    <div className="overflow-x-auto rounded-lg shadow-md ">
        <div className="overflow-x-auto h-[calc(100vh-300px)]">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-200">
                    <tr className="font-bold">
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            役割名
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            初回メッセージ
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            説明
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            言語モード
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            公開状態
                        </th>
                        <th scope="col">
                            <span className="sr-only">編集</span>
                        </th>
                        <th scope="col">
                            <span className="sr-only">削除</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {myRoles.map((role) => (
                        <tr key={role.id} className="hover:bg-gray-50">
                            <td className="px-2 py-3 text-xs text-gray-500 break-words w-24">
                                {role.name}
                            </td>
                            <td className="px-2 py-3 text-xs text-gray-500 min-w-40">
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
                            <td className="px-2 py-3 text-xs text-gray-500">
                                {role.language?.name}
                            </td>
                            <td className="px-2 py-3 text-xs text-gray-500">
                                <RoleToggleButton
                                    isPublic={role.is_public}
                                    roleId={role.id}
                                />
                            </td>
                            <td className="text-right text-sm">
                                <Tooltip
                                    content={
                                        <span className="text-md font-bold">
                                            編集
                                        </span>
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
                            </td>
                            <td className="text-right text-sm">
                                <Tooltip
                                    content={
                                        <span className="text-md font-bold">
                                            削除
                                        </span>
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
                                        className="pr-3 rounded text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <HiTrash className="h-5 w-5" />
                                    </button>
                                </Tooltip>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default DesktopRoleIndexTable;
