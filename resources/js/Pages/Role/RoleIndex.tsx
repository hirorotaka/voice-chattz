import { useState } from "react";
import CreateRoleForm from "@/Components/Utils/CreateRoleForm";
import DeleteRoleForm from "@/Components/Utils/DeleteRoleForm";
import EditRoleForm from "@/Components/Utils/EditRoleForm";
import AppLayout from "@/Layouts/AppLayout";
import {
    IsUsingRoleType,
    LanguageType,
    MyRoleType,
    ThreadType,
} from "@/types/types";
import MobileRoleIndexCard from "../../Components/Role/MobileRoleIndexCard";
import DesktopRoleIndexTable from "../../Components/Role/DesktopRoleIndexTable";

interface RoleIndexProps {
    threads: ThreadType[];
    languages: LanguageType[];
    myRoles: MyRoleType[];
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

    const handleOpenCreateModal = () => {
        setRoleCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setRoleCreateModal(false);
    };

    const handleClickOpenEditModal = (role: MyRoleType) => {
        setRoleToEdit(role);
        setRoleEditModal(true);
    };

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

    const handleClickOpenDeleteModal = (roleId: number) => {
        setRoleToDelete(roleId);
        setShowDeleteModal(true);
    };

    const handleClickCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setRoleToDelete(null);
    };

    return (
        <AppLayout
            title="役割一覧(自分)"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="flex flex-col p-3 sm:p-5">
                {myRoles.length === 0 ? (
                    <div className="flex items-center flex-col justify-center h-full">
                        <p className="text-lg sm:text-3xl text-white font-bold mb-10 text-center">
                            あなたが作成した役割が登録されていません。
                            <br />
                            役割を作成してみましょう。
                        </p>
                        <button
                            onClick={handleOpenCreateModal}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-xl sm:text-3xl"
                        >
                            役割作成
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <h1 className="text-xl sm:text-3xl font-semibold text-white text-center">
                                役割一覧(自分)
                            </h1>
                            <button
                                onClick={handleOpenCreateModal}
                                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                役割作成
                            </button>
                        </div>

                        {/* デスクトップビュー */}
                        <div className="hidden sm:block">
                            <DesktopRoleIndexTable
                                myRoles={myRoles}
                                onEdit={handleClickOpenEditModal}
                                onDelete={handleClickOpenDeleteModal}
                            />
                        </div>

                        {/* モバイルビュー */}
                        <div className="block sm:hidden">
                            <div className="space-y-4">
                                {myRoles.map((role) => (
                                    <MobileRoleIndexCard
                                        key={role.id}
                                        role={role}
                                        onEdit={handleClickOpenEditModal}
                                        onDelete={handleClickOpenDeleteModal}
                                    />
                                ))}
                            </div>
                        </div>
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
