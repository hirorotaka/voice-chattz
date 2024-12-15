import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { useAppContext } from "@/Contexts/AppContext";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useMemo, useState } from "react";

interface DeleteThreadFormProps {
    threadId: number | null;
    onClose: () => void;
    show: boolean;
    resetScroll: () => void;
}

export default function DeleteThreadForm({
    threadId,
    onClose,
    show,
    resetScroll,
}: DeleteThreadFormProps) {
    const { delete: destroy, processing } = useForm({});

    const { showToast } = useAppContext();

    const [mounted, setMounted] = useState(false);

    const handleSuccess = () => {
        showToast("スレッドを削除しました", "delete");
    };

    const deleteThread: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("thread.destroy", { thread: threadId }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                handleSuccess();
                resetScroll();
                onClose();
            },
        });
    };

    // コンポーネントのマウント時に一度だけ実行
    useEffect(() => {
        setMounted(true);
    }, []);

    // フォームの内容をメモ化
    const modalContent = useMemo(
        () => (
            <form onSubmit={deleteThread} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    スレッドを削除しますか？
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    一度削除したスレッドは復元できません。
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
        ),
        [deleteThread, onClose, processing]
    );

    // マウント前はnullを返す
    if (!mounted) {
        return null;
    }

    return (
        <Modal show={show} onClose={onClose}>
            {modalContent}
        </Modal>
    );
}
