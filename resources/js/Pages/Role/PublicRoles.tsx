import PublicRoleToggleButton from "@/Components/Role/PublicRoleToggleButton";
import TruncatedText from "@/Components/Utils/TruncatedText";
import AppLayout from "@/Layouts/AppLayout";
import {
    IsUsingRoleType,
    LanguageType,
    PublicRoleType,
    ThreadType,
} from "@/types/types";

interface TopProps {
    threads: ThreadType[];
    languages: LanguageType[];
    publicRoles: PublicRoleType[];
    isUsingMyRoles: IsUsingRoleType[];
}

export default function PublicRoles({
    threads,
    languages,
    publicRoles,
    isUsingMyRoles,
}: TopProps) {
    console.log(publicRoles);
    return (
        <AppLayout
            title="public roles"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="h-full flex flex-col p-5">
                {publicRoles.length === 0 ? (
                    <div className="flex items-center flex-col justify-center h-full">
                        <p className="text-3xl text-white font-bold mb-10">
                            公開中の役割はありません
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            {" "}
                            {/* ボタンの位置調整 */}
                            <p className="text-2xl sm:text-3xl font-semibold text-white text-center">
                                役割一覧(公開中)
                            </p>
                        </div>
                        <div className="overflow-x-auto rounded-lg shadow-md bg-gray-300">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                                        >
                                            役割名
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                                        >
                                            初回メッセージ
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                                        >
                                            説明
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            言語モード
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                                        >
                                            公開中のもの
                                            <br />
                                            を使用する
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {publicRoles.map((role) => (
                                        <tr
                                            key={role.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-2 py-3 text-sm text-gray-500 break-words w-24">
                                                {role.name}
                                            </td>
                                            <td className="px-2 py-3 text-sm text-gray-500 min-w-36">
                                                <TruncatedText
                                                    text={role.first_message}
                                                    maxLength={100}
                                                />
                                            </td>
                                            <td className="px-2 py-3 text-sm text-gray-500 max-w-70">
                                                <TruncatedText
                                                    text={role.description}
                                                    maxLength={200}
                                                />
                                            </td>
                                            <td className="px-2 py-3 text-sm text-gray-500">
                                                {role.language_name}
                                            </td>
                                            <td className="px-2 py-3 text-sm text-gray-500">
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
                    </>
                )}
            </div>
        </AppLayout>
    );
}
