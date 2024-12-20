import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
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

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSuccess = () => {
        showToast("スレッドを更新しました", "info");
    };

    useEffect(() => {
        if (show) {
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
            preserveState: true,
            onSuccess: () => {
                handleSuccess();
                handleClose();
            },
        });
    };

    const modalContent = useMemo(
        () => (
            <form onSubmit={editThreadsubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    スレッドを編集<span className="text-red-500 ml-1">*</span>
                </h2>

                <div className="mt-6">
                    <InputLabel htmlFor="title">
                        タイトル
                        <span className="text-red-500 ml-1">*</span>
                    </InputLabel>
                    <TextInput
                        id="title"
                        name="title"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        placeholder="スレッドのタイトル"
                        isFocused={true}
                        required
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

    if (!mounted) {
        return null;
    }

    return (
        <Modal show={show} onClose={handleClose}>
            {modalContent}
        </Modal>
    );
}
