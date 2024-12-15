import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/Contexts/AppContext";

interface CreateThreadFormProps {
    onClose: () => void;
    show: boolean;
    threadToEdit: {
        id: number;
        title: string;
    };
}

export default function EditThreadForm({
    onClose,
    show,
    threadToEdit,
}: CreateThreadFormProps) {
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        id: threadToEdit.id,
        title: threadToEdit.title,
    });

    const { showToast } = useAppContext();

    const [mounted, setMounted] = useState(false);

    // マウント時の処理
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSuccess = () => {
        showToast("スレッドを更新しました", "info");
    };

    useEffect(() => {
        if (show) {
            // モーダルが表示されたときだけデータを更新
            setData({
                id: threadToEdit.id,
                title: threadToEdit.title,
            });
        }
    }, [threadToEdit, show]);

    const handleClose = () => {
        clearErrors();
        onClose();
    };

    const editThreadsubmit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("thread.update", { thread: data.id }), {
            preserveScroll: true,
            preserveState: true, // バリデーションエラー時にフォームの状態を保持
            onSuccess: () => {
                handleSuccess();
                handleClose();
            },
        });
    };

    // フォームの内容をメモ化
    const modalContent = useMemo(
        () => (
            <form onSubmit={editThreadsubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    スレッドを編集
                </h2>

                <div className="mt-6">
                    <input
                        type="text"
                        className={`w-full rounded-md border-gray-300 ${
                            errors.title ? "border-red-500" : ""
                        }`}
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        placeholder="スレッドのタイトル"
                        autoFocus
                    />
                    {errors.title && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.title}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={handleClose}>
                        キャンセル
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        更新する
                    </PrimaryButton>
                </div>
            </form>
        ),
        [data, errors, processing, handleClose, editThreadsubmit, setData]
    );

    // マウント前はnullを返す
    if (!mounted) {
        return null;
    }

    return (
        <Modal show={show} onClose={handleClose}>
            {modalContent}
        </Modal>
    );
}
