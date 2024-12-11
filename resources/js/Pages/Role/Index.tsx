import React, { useState } from "react";
import ToggleButton from "@/Components/Role/RoleToggleButton";
import CreateRoleForm from "@/Components/Utils/CreateRoleForm";
import DeleteRoleForm from "@/Components/Utils/DeleteRoleForm";
import EditRoleForm from "@/Components/Utils/EditRoleForm";
import TruncatedText from "@/Components/Utils/TruncatedText";
import AppLayout from "@/Layouts/AppLayout";
import {
    IsUsingRoleType,
    LanguageType,
    MyRoleType,
    ThreadType,
} from "@/types/types";
import { Tooltip } from "flowbite-react";
import { HiTrash, HiOutlinePencil } from "react-icons/hi2";

interface RoleIndexProps {
    threads: ThreadType[];
    languages: LanguageType[];
    myRoles: MyRoleType[];
    isUsingMyRoles: IsUsingRoleType[];
}

interface MobileRoleCardProps {
    role: MyRoleType;
    onEdit: (role: MyRoleType) => void;
    onDelete: (roleId: number) => void;
}

const MobileRoleCard: React.FC<MobileRoleCardProps> = ({
    role,
    onEdit,
    onDelete,
}) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="space-y-3">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-700">{role.name}</h3>
                <div className="flex items-center gap-2">
                    <Tooltip
                        content={
                            <span className="text-md font-bold">編集</span>
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
                    <Tooltip
                        content={
                            <span className="text-md font-bold">削除</span>
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
                            className="rounded text-red-400 hover:text-red-300 transition-colors"
                        >
                            <HiTrash className="h-5 w-5" />
                        </button>
                    </Tooltip>
                </div>
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">初回メッセージ:</p>
                <TruncatedText text={role.first_message} maxLength={100} />
            </div>

            <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">説明:</p>
                <TruncatedText text={role.description} maxLength={150} />
            </div>

            <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">
                    {role.language?.name}
                </span>
                <ToggleButton isPublic={role.is_public} roleId={role.id} />
            </div>
        </div>
    </div>
);

interface DesktopTableProps {
    myRoles: MyRoleType[];
    onEdit: (role: MyRoleType) => void;
    onDelete: (roleId: number) => void;
}

const DesktopTable: React.FC<DesktopTableProps> = ({
    myRoles,
    onEdit,
    onDelete,
}) => (
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
                                <ToggleButton
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

export default function Index({
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
            <div className="min-h-screen flex flex-col p-3 sm:p-5">
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
                            <DesktopTable
                                myRoles={myRoles}
                                onEdit={handleClickOpenEditModal}
                                onDelete={handleClickOpenDeleteModal}
                            />
                        </div>

                        {/* モバイルビュー */}
                        <div className="block sm:hidden">
                            <div className="space-y-4">
                                {myRoles.map((role) => (
                                    <MobileRoleCard
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
