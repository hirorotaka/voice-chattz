import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { LanguageType, RoleType } from "@/types/types";
import TextArea from "../TextArea";
import { useAppContext } from "@/Contexts/AppContext";

interface EditRoleFormProps {
    onClose: () => void;
    show: boolean;
    languages: LanguageType[];
    roleToEdit: RoleType;
}

interface FormData {
    id: number;
    name: string;
    first_message: string;
    description: string;
    language_id: number;
}

export default function EditRoleForm({
    onClose,
    show,
    languages,
    roleToEdit,
}: EditRoleFormProps) {
    console.log(roleToEdit);
    const form = useForm<FormData>({
        id: roleToEdit.id,
        name: roleToEdit.name,
        first_message: roleToEdit.first_message,
        description: roleToEdit.description,
        language_id: roleToEdit.language_id, // 初期値を空に設定
    });

    const { showToast } = useAppContext();

    const handleSuccess = () => {
        showToast("役割を更新しました", "info");
    };

    useEffect(() => {
        if (show) {
            // モーダルが表示されたときだけデータを更新
            form.setData({
                id: roleToEdit.id,
                name: roleToEdit.name,
                first_message: roleToEdit.first_message,
                description: roleToEdit.description,
                language_id: roleToEdit.language_id,
            });
        }
    }, [roleToEdit, show]);

    const handleClose = () => {
        form.clearErrors();
        onClose();
    };

    const createRole: FormEventHandler = async (e) => {
        e.preventDefault();
        form.put(route("roles.update", { role: roleToEdit.id }), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                handleClose();
                handleSuccess();
            },
        });
    };

    return (
        <Modal show={show} onClose={handleClose}>
            <form
                onSubmit={createRole}
                className="p-6   max-h-[90vh] max-w-[80vw] overflow-y-auto"
            >
                <h1 className="text-2xl font-medium text-gray-900">
                    役割を編集
                </h1>

                <div className="mt-6">
                    <InputLabel htmlFor="name" value="役割名" />
                    <TextInput
                        id="name"
                        name="name"
                        type="text"
                        className="text-xs sm:text-base mt-1 block w-11/12"
                        v-model={form.data.name}
                        onChange={(e) => form.setData("name", e.target.value)} // nameの更新
                        value={form.data.name}
                    />
                    {form.errors.name && (
                        <div className="text-red-500 text-sm mt-1">
                            {form.errors.name}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="first_message"
                        value="初回メッセージ"
                    />
                    <TextArea // TextArea を使用
                        id="first_message"
                        name="first_message"
                        className="text-xs sm:text-base mt-1 block w-full h-24 md:h-28 lg:h-32 placeholder-gray-400" // 高さを小さく調整
                        value={form.data.first_message}
                        placeholder={`スレッド開始時にAIが最初に送信するメッセージを入力してください。\n例：「こんにちは！私は〇〇が得意なAIです。どんな〇〇をしたいですか？」`}
                        onChange={(e) =>
                            form.setData("first_message", e.target.value)
                        }
                        rows={3}
                    />
                    {form.errors.first_message && (
                        <div className="text-red-500 text-sm mt-1">
                            {form.errors.first_message}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="description" value="説明" />
                    <TextArea // TextArea を使用
                        id="description"
                        name="description"
                        className="text-xs sm:text-base mt-1 block w-full h-32 md:h-36 lg:h-40 placeholder-gray-400" // 高さを小さく調整
                        value={form.data.description}
                        onChange={(e) =>
                            form.setData("description", e.target.value)
                        }
                        rows={7}
                        placeholder={`この役割がどのような役割なのか、\nどのような機能を持つのかを説明してください。\n\n例：「〇〇なAIです。〇〇ができます。」`}
                    />
                    {form.errors.description && (
                        <div className="text-red-500 text-sm mt-1">
                            {form.errors.description}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <InputLabel value="対話モード *" />
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                        使用する言語モードを選択してください。
                        <br />
                        英語用には英語モード、日本語用には日本語モードを選択してください。
                        <br />
                        合わせることで精度が高くなります。
                    </p>
                    <div className="grid grid-cols-3 gap-2 max-w-80">
                        {languages?.map((language) => (
                            <label
                                key={language.locale}
                                className={`
                    relative flex items-center justify-center p-2 rounded-xl cursor-pointer
                    transition-all duration-200 ease-in-out
                    ${
                        String(form.data.language_id) === String(language.id)
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
                                        String(form.data.language_id) ===
                                        String(language.id)
                                    }
                                    onChange={(e) =>
                                        form.setData(
                                            "language_id",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="sr-only" // ラジオボタンを視覚的に隠す
                                />
                                <span
                                    className={`text-base font-medium ${
                                        String(form.data.language_id) ===
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
                        type="submit"
                        disabled={form.processing}
                    >
                        更新する
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
