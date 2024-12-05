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
        title: "",
        language_id: "",
    });

    const handleClose = () => {
        form.clearErrors();
        form.reset();
        onClose();
    };

    const createThread: FormEventHandler = (e) => {
        e.preventDefault();

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
                <h2 className="text-lg font-medium text-gray-900">
                    新規スレッドを作成
                </h2>

                <div className="mt-6">
                    <InputLabel htmlFor="title" value="タイトル *" />
                    <TextInput
                        id="title"
                        name="title"
                        type="text"
                        className={`mt-1 block w-full ${
                            form.errors.title ? "border-red-500" : ""
                        }`}
                        value={form.data.title}
                        onChange={(e) => form.setData("title", e.target.value)}
                        placeholder="スレッドのタイトル"
                        isFocused={true}
                    />
                    {form.errors.title && (
                        <div className="text-red-500 text-sm mt-1">
                            {form.errors.title}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="local" value="言語 *" />
                    <select
                        id="language_id"
                        name="language_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={form.data.language_id}
                        onChange={(e) =>
                            form.setData("language_id", e.target.value)
                        }
                    >
                        <option value="">選択してください</option>
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

                    <PrimaryButton className="ms-3" disabled={form.processing}>
                        作成する
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
