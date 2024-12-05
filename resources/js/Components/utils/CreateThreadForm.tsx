import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { LanguageType } from "@/types/types";

interface CreateThreadFormProps {
    onClose: () => void;
    show: boolean;
    resetScroll: () => void;
    languages: LanguageType[];
}

interface FormData {
    title: string;
    language_id: string;
}

export default function CreateThreadForm({
    onClose,
    show,
    resetScroll,
    languages,
}: CreateThreadFormProps) {
    const form = useForm<FormData>({
        title: "無題のスレッド", // デフォルトタイトルを設定
        language_id: "",
    });

    const handleClose = () => {
        form.clearErrors();
        form.reset();
        onClose();
    };

    // 言語選択時に両方のデータを更新
    const handleLanguageChange = (value: string) => {
        form.setData({
            language_id: value,
            title: value === "2" ? "無題のスレッド" : "Untitled Thread",
        });
    };

    const createThread: FormEventHandler = async (e) => {
        e.preventDefault();

        // データが設定された後で送信
        form.post(route("thread.store"), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                resetScroll();
                handleClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={handleClose}>
            <form onSubmit={createThread} className="p-6">
                <h1 className="text-2xl font-medium text-gray-900">
                    新規スレッドを作成
                </h1>

                <div className="mt-6">
                    <InputLabel value="対話モード *" />
                    <p className="text-sm text-gray-500 mb-4">
                        使用する言語を選択してください
                    </p>
                    <div className="grid grid-cols-2 gap-3 max-w-80">
                        {languages?.map((language) => (
                            <label
                                key={language.locale}
                                className={`
                    relative flex items-center justify-center p-4 rounded-xl cursor-pointer
                    transition-all duration-200 ease-in-out
                    ${
                        form.data.language_id === String(language.id)
                            ? "bg-indigo-100 ring-2 ring-indigo-500"
                            : "bg-white ring-1 ring-gray-200 hover:ring-indigo-200"
                    }
                `}
                            >
                                <input
                                    type="radio"
                                    name="language_id"
                                    value={language.id}
                                    checked={
                                        form.data.language_id ===
                                        String(language.id)
                                    }
                                    onChange={(e) =>
                                        handleLanguageChange(e.target.value)
                                    }
                                    className="sr-only" // ラジオボタンを視覚的に隠す
                                />
                                <span
                                    className={`text-base font-medium ${
                                        form.data.language_id ===
                                        String(language.id)
                                            ? "text-indigo-800"
                                            : "text-gray-900"
                                    }`}
                                >
                                    {language.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton type="button" onClick={handleClose}>
                        キャンセル
                    </SecondaryButton>

                    <PrimaryButton
                        className="ms-3"
                        disabled={form.processing || !form.data.language_id}
                    >
                        作成する
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
