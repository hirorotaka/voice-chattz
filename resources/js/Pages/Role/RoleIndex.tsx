import { lazy, useCallback, useEffect, useMemo, useState } from "react";

import AppLayout from "@/Layouts/AppLayout";
import {
    IsUsingRoleType,
    LanguageType,
    MyRolePaginationType,
    MyRoleType,
    ThreadType,
} from "@/types/types";
import MobileRoleIndexCard from "../../Components/Role/MobileRoleIndexCard";
import DesktopRoleIndexTable from "../../Components/Role/DesktopRoleIndexTable";
import MyRolePagination from "@/Components/Role/MyRolePagination";
import { ROLE_FORM_NAMES } from "@/constants/utils";

// 動的インポートでモーダルコンポーネントを遅延ロード
const CreateRoleForm = lazy(() => import("@/Components/Utils/CreateRoleForm"));
const EditRoleForm = lazy(() => import("@/Components/Utils/EditRoleForm"));
const DeleteRoleForm = lazy(() => import("@/Components/Utils/DeleteRoleForm"));

interface RoleIndexProps {
    threads: ThreadType[];
    languages: LanguageType[];
    myRoles: MyRolePaginationType;
    isUsingMyRoles: IsUsingRoleType[];
}

export default function RoleIndex({
    threads,
    languages,
    myRoles,
    isUsingMyRoles,
}: RoleIndexProps) {
    const [roleCreateModal, setRoleCreateModal] = useState(false);
    const [roleEditModal, setRoleEditModal] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState<MyRoleType>({
        id: 0,
        name: "",
        is_public: 0,
        first_message: "",
        description: "",
        language_id: 0,
        language: null,
        created_at: "",
        updated_at: "",
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    // イベントハンドラをメモ化
    const handleOpenCreateModal = useCallback(() => {
        setRoleCreateModal(true);
    }, []);

    const handleCloseCreateModal = useCallback(() => {
        setRoleCreateModal(false);
    }, []);

    const handleClickOpenEditModal = useCallback((role: MyRoleType) => {
        setRoleToEdit(role);
        setRoleEditModal(true);
    }, []);

    const handleCloseEditModal = () => {
        setRoleEditModal(false);
        setRoleToEdit({
            id: 0,
            name: "",
            is_public: 0,
            first_message: "",
            description: "",
            language_id: 0,
            language: null,
            created_at: "",
            updated_at: "",
        });
    };

    const handleClickOpenDeleteModal = useCallback((roleId: number) => {
        setRoleToDelete(roleId);
        setShowDeleteModal(true);
    }, []);

    const handleClickCloseDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
        setRoleToDelete(null);
    }, []);

    return (
        <AppLayout
            title="マイAIキャラクター"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="flex flex-col p-3 sm:p-5">
                {myRoles.data.length === 0 ? (
                    <div className="flex items-center flex-col justify-center h-full">
                        <p className="text-lg sm:text-3xl text-white font-bold mb-10 text-center">
                            あなたが作成したAIキャラクターが登録されていません。
                            <br />
                            AIキャラクターを作成してみましょう。
                            <br />
                            <br />
                            作成したキャラクターはスレッド作成時に選択できます。
                        </p>
                        <button
                            onClick={handleOpenCreateModal}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-xl sm:text-3xl"
                        >
                            {ROLE_FORM_NAMES.ai_chara}作成
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-xl sm:text-3xl font-semibold text-white">
                                    マイAIキャラクター
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-400">
                                    作成したキャラクターをスレッド作成時に選択できます。
                                </p>
                            </div>
                            <button
                                onClick={handleOpenCreateModal}
                                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                AIキャラ作成
                            </button>
                        </div>

                        {/* デスクトップビュー */}
                        <div className="hidden sm:block">
                            <DesktopRoleIndexTable
                                myRoles={myRoles.data}
                                onEdit={handleClickOpenEditModal}
                                onDelete={handleClickOpenDeleteModal}
                            />
                        </div>

                        {/* モバイルビュー */}
                        <div className="block sm:hidden">
                            <div className="space-y-4">
                                {myRoles.data.map((role) => (
                                    <MobileRoleIndexCard
                                        key={role.id}
                                        role={role}
                                        onEdit={handleClickOpenEditModal}
                                        onDelete={handleClickOpenDeleteModal}
                                    />
                                ))}
                            </div>
                        </div>
                        <MyRolePagination
                            currentPage={myRoles.current_page}
                            lastPage={myRoles.last_page}
                            links={myRoles.links}
                        />
                    </>
                )}

                {/* モーダル */}
                <CreateRoleForm
                    show={roleCreateModal}
                    onClose={handleCloseCreateModal}
                    languages={languages}
                />
                <EditRoleForm
                    show={roleEditModal}
                    onClose={handleCloseEditModal}
                    languages={languages}
                    roleToEdit={roleToEdit}
                />
                <DeleteRoleForm
                    show={showDeleteModal}
                    onClose={handleClickCloseDeleteModal}
                    roleId={roleToDelete}
                />
            </div>
        </AppLayout>
    );
}
