import React from "react";
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
import { useState, useEffect } from "react";

interface TopProps {
    threads: ThreadType[];
    languages: LanguageType[];
    publicRoles: PublicRoleType[];
    isUsingMyRoles: IsUsingRoleType[];
    search_str?: string;
}

interface MobileRoleCardProps {
    role: PublicRoleType;
}

const MobileRoleCard = ({ role }: MobileRoleCardProps) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="space-y-2">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700">{role.name}</h3>
                <span className="text-sm text-gray-500">
                    {role.language_name}
                </span>
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">初回メッセージ:</p>
                <TruncatedText text={role.first_message} maxLength={100} />
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">説明:</p>
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

interface DesktopTableProps {
    publicRoles: PublicRoleType[];
}

const DesktopTable = ({ publicRoles }: DesktopTableProps) => (
    <div className="overflow-x-auto rounded-lg shadow-md bg-gray-300">
        <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-200">
                <tr>
                    <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                        役割名
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                        初回メッセージ
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                        説明
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                        言語モード
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-bold text-gray-600 uppercase">
                        使用する
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {publicRoles.map((role) => (
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
                ))}
            </tbody>
        </table>
    </div>
);

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

    useEffect(() => {
        if (window.location.search) {
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, []);

    const searchGo = () => {
        const params: Record<string, any> = {};
        if (searchStr) {
            params.search_str = searchStr;
        }
        form.get(route("roles.public"), params);
    };

    const handleBlur = () => {
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
            <div className="min-h-screen flex flex-col p-3 sm:p-5">
                <div className="flex flex-col items-center mb-6 gap-4">
                    <h1 className="text-xl sm:text-3xl font-semibold text-white text-center">
                        役割一覧（公開プロンプト）
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <TextInput
                            id="search_str"
                            type="text"
                            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full sm:w-72 sm:placeholder:text-sm placeholder:text-xs"
                            placeholder="役割名を入力してください"
                            value={searchStr}
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
                            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            検索
                        </button>
                    </div>
                </div>

                {/* レスポンシブ切り替え */}
                <div className="hidden sm:block">
                    <DesktopTable publicRoles={publicRoles} />
                </div>
                <div className="block sm:hidden">
                    <div className="space-y-4">
                        {publicRoles.length === 0 ? (
                            <div className="text-center text-gray-500 bg-white p-4 rounded-lg">
                                役割が見つかりませんでした
                            </div>
                        ) : (
                            publicRoles.map((role) => (
                                <MobileRoleCard key={role.id} role={role} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
