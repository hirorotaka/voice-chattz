import PublicRoleToggleButton from "@/Components/Role/PublicRoleToggleButton";
import TextInput from "@/Components/TextInput";
import TruncatedText from "@/Components/Utils/TruncatedText";
import AppLayout from "@/Layouts/AppLayout";
import {
    IsUsingRoleType,
    LanguageType,
    PublicRoleType,
    ThreadType,
} from "@/types/types";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

interface TopProps {
    threads: ThreadType[];
    languages: LanguageType[];
    publicRoles: PublicRoleType[];
    isUsingMyRoles: IsUsingRoleType[];
    search_str?: string;
}

export default function PublicRoles({
    threads,
    languages,
    publicRoles,
    isUsingMyRoles,
    search_str,
}: TopProps) {
    const [searchStr, setSearchStr] = useState<string>(search_str || "");
    const form = useForm<{ search_str: string }>({
        search_str: searchStr,
    });

    // ページロード時に実行
    useEffect(() => {
        // 検索パラメータが存在する場合、URLをクリア
        if (window.location.search) {
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, []);

    const searchGo = () => {
        const params: Record<string, any> = {};
        if (searchStr) {
            params.search_str = searchStr; // searchStrが存在する場合のみ追加
        }
        form.get(route("roles.public"), params); // パラメータを渡す
    };

    const handleBlur = () => {
        // 現在の検索文字列が空で、かつ前回の検索文字列が空でない場合に検索を実行
        if (!searchStr && search_str) {
            searchGo();
        }
    };

    return (
        <AppLayout
            title="公開プロンプト一覧"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="h-full flex flex-col p-5">
                <div className="flex items-center mb-6">
                    {" "}
                    {/* ボタンの位置調整 */}
                    <p className="text-2xl sm:text-3xl font-semibold text-white text-center mr-5">
                        役割一覧（公開プロンプト）
                    </p>
                    <div className="flex flex-row items-center gap-2 ">
                        <TextInput
                            id="search_str"
                            type="text"
                            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-72"
                            placeholder="役割名を入力してください"
                            value={searchStr || ""}
                            onChange={(e) => {
                                setSearchStr(e.target.value);
                                form.setData("search_str", e.target.value);
                            }}
                            autoComplete="search_str"
                            onBlur={handleBlur}
                        />
                        <button
                            type="button"
                            onClick={searchGo}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            検索
                        </button>
                    </div>
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
                            {publicRoles.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-2 py-4 text-center text-gray-500"
                                    >
                                        役割が見つかりませんでした
                                    </td>
                                </tr>
                            ) : (
                                publicRoles.map((role) => (
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
                                ))
                            )}
                            {/* {publicRoles.map((role) => (
                                <tr key={role.id} className="hover:bg-gray-50">
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
                            ))} */}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
