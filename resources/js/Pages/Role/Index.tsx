import AppLayout from "@/Layouts/AppLayout";
import { LanguageType, RoleType, ThreadType } from "@/types/types";
import { Tooltip } from "flowbite-react";
import { HiTrash, HiOutlinePencil } from "react-icons/hi2";

interface TopProps {
    threads: ThreadType[];
    languages: LanguageType[];
    roles: RoleType[];
}

export default function Index({ threads, languages, roles }: TopProps) {
    return (
        <AppLayout title="roles" threads={threads} languages={languages}>
            <div className="h-full flex flex-col p-5">
                <p className="text-2xl sm:text-3xl font-semibold mb-6 text-white text-center">
                    役割一覧
                </p>
                <div className="overflow-x-auto rounded-lg shadow-md bg-gray-300">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    役割名
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    初回メッセージ
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    説明
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap"
                                >
                                    言語
                                    <br />
                                    モード
                                </th>
                                <th scope="col" className="relative px-6 py-1">
                                    <span className="sr-only">編集</span>
                                </th>
                                <th scope="col" className="relative px-6 py-1">
                                    <span className="sr-only">削除</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] break-words">
                                        {role.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {role.first_message}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {role.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {role.language?.name}
                                    </td>
                                    <td className="text-right text-sm font-medium">
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
                                                }}
                                                className="p-1 rounded text-gray-500 hover:text-gray-400 transition-colors"
                                            >
                                                <HiOutlinePencil className="h-5 w-5" />
                                            </button>
                                        </Tooltip>
                                    </td>
                                    <td className="text-right text-sm font-medium">
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
                                                }}
                                                className="p-1 rounded text-red-400 hover:text-red-300 transition-colors"
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
        </AppLayout>
    );
}
