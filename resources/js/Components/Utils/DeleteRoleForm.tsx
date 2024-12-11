import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { useAppContext } from "@/Contexts/AppContext";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface DeleteThreadFormProps {
    roleId: number | null;
    onClose: () => void;
    show: boolean;
}

export default function DeleteRoleForm({
    roleId,
    onClose,
    show,
}: DeleteThreadFormProps) {
    const { delete: destroy, processing } = useForm({});

    const { showToast } = useAppContext();

    const handleSuccess = () => {
        showToast("役割を削除しました", "delete");
    };

    const deleteThread: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("roles.destroy", { role: roleId }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                onClose();
                handleSuccess();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={deleteThread} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    役割を削除しますか？
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    一度削除した役割は復元できません。
                </p>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>
                        キャンセル
                    </SecondaryButton>

                    <DangerButton className="ms-3" disabled={processing}>
                        削除する
                    </DangerButton>
                </div>
            </form>
        </Modal>
    );
}
