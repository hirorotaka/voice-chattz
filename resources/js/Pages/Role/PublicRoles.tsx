import TextInput from "@/Components/TextInput";
import AppLayout from "@/Layouts/AppLayout";
import {
    IsUsingRoleType,
    LanguageType,
    PublicRolePaginationType,
    ThreadType,
} from "@/types/types";
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import MobilePublicRolesCard from "../../Components/Role/MobilePublicRolesCard";
import DesktopPublicRolesTable from "../../Components/Role/DesktopPublicRolesTable";
import PublicRolePagination from "@/Components/Role/PublicRolePagination";

interface TopProps {
    threads: ThreadType[];
    languages: LanguageType[];
    publicRoles: PublicRolePaginationType;
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
            title="AIキャラクターリスト（公開中）"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="flex flex-col p-3 sm:p-5">
                <div className="flex flex-col items-center mb-6 gap-4">
                    <h1 className="text-xl sm:text-3xl font-semibold text-white text-center">
                        AIキャラクターリスト（公開中）
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400">
                        『項目：使用する』の下にあるボタンをクリックすると
                        <br />
                        スレッド作成時にキャラクターを選択できます。
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <TextInput
                            id="search_str"
                            type="text"
                            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-72 sm:w-96 sm:placeholder:text-sm placeholder:text-xs"
                            placeholder="AIキャラ名か、AIキャラ人物像を検索"
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
                    <DesktopPublicRolesTable publicRoles={publicRoles.data} />
                </div>
                <div className="block sm:hidden">
                    <div className="space-y-4">
                        {publicRoles.data.length === 0 ? (
                            <div className="text-center text-gray-500 bg-white p-4 rounded-lg">
                                キャラクターが見つかりませんでした
                            </div>
                        ) : (
                            publicRoles.data.map((role) => (
                                <MobilePublicRolesCard
                                    key={role.id}
                                    role={role}
                                />
                            ))
                        )}
                    </div>
                </div>
                <PublicRolePagination
                    currentPage={publicRoles.current_page}
                    lastPage={publicRoles.last_page}
                    links={publicRoles.links}
                    searchStr={searchStr}
                />
            </div>
        </AppLayout>
    );
}
