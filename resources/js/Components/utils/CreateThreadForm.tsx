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

    console.log(form.data);

    return (
        <Modal show={show} onClose={handleClose}>
            <form onSubmit={createThread} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    新規スレッドを作成
                </h2>

                <div className="mt-6">
                    <InputLabel htmlFor="language_id" value="対話モード *" />
                    <p className="text-sm text-gray-500 mb-2">
                        使用する言語を選択してください
                    </p>
                    <select
                        id="language_id"
                        name="language_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={form.data.language_id}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                        <option value="">選択してください</option>
                        {languages.map((language) => (
                            <option key={language.locale} value={language.id}>
                                {language.name}
                            </option>
                        ))}
                    </select>
                    {form.errors.language_id && (
                        <div className="text-red-500 text-sm mt-1">
                            {form.errors.language_id}
                        </div>
                    )}
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
