import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface CreateThreadFormProps {
    onClose: () => void;
    show: boolean;
    resetScroll: () => void;
}

export default function CreateThreadForm({
    onClose,
    show,
    resetScroll,
}: CreateThreadFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
    });

    const createThread: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("thread.store"), {
            preserveScroll: true,
            preserveState: true, // バリデーションエラー時にフォームの状態を保持
            onSuccess: () => {
                resetScroll();
                onClose();
                // フォームをリセット
                setData("title", "");
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={createThread} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    新規スレッドを作成
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
                    <SecondaryButton type="button" onClick={onClose}>
                        キャンセル
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        作成する
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
