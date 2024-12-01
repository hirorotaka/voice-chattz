import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface DeleteThreadFormProps {
    threadId: string;
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

    const deleteThread: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("thread.destroy", { thread: threadId }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => resetScroll(),
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
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
        </Modal>
    );
}
