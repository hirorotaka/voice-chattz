import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useMemo, useState } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { LanguageType, MyRoleType } from "@/types/types";
import TextArea from "../TextArea";
import { useAppContext } from "@/Contexts/AppContext";
import { ROLE_FORM_NAMES } from "@/constants/utils";

interface EditRoleFormProps {
    onClose: () => void;
    show: boolean;
    languages: LanguageType[];
    roleToEdit: MyRoleType;
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
    const form = useForm<FormData>({
        id: roleToEdit.id,
        name: roleToEdit.name,
        first_message: roleToEdit.first_message,
        description: roleToEdit.description,
        language_id: roleToEdit.language_id, // 初期値を空に設定
    });

    const [mounted, setMounted] = useState(false);

    const { showToast } = useAppContext();

    const handleSuccess = () => {
        showToast(`${ROLE_FORM_NAMES.ai_chara}を更新しました`, "info");
    };

    // マウント時の処理
    useEffect(() => {
        setMounted(true);
    }, []);

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

    const editRole: FormEventHandler = async (e) => {
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

    // フォームの内容をメモ化
    const modalContent = useMemo(
        () => (
            <form
                onSubmit={editRole}
                className="p-6   max-h-[90vh] max-w-[80vw] overflow-y-auto"
            >
                <h1 className="text-2xl font-medium text-gray-900">
                    {ROLE_FORM_NAMES.ai_chara}を編集
                </h1>

                <div className="mt-6">
                    <InputLabel
                        htmlFor="name"
                        value={ROLE_FORM_NAMES.ai_character}
                    />
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
                        value={ROLE_FORM_NAMES.first_message}
                    />
                    <TextArea // TextArea を使用
                        id="first_message"
                        name="first_message"
                        className="text-xs sm:text-base mt-1 block w-full h-24 md:h-28 lg:h-32 placeholder-gray-400" // 高さを小さく調整
                        value={form.data.first_message}
                        placeholder={`スレッド開始時にAIが最初に送信するメッセージを入力してください。\n例：「こんにちは！私は〇〇が得意なAIです。どんな〇〇をしたいですか？」\n\n※こちらを作成することで会話の方向性を強化します。`}
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
                    <InputLabel
                        htmlFor="description"
                        value={ROLE_FORM_NAMES.description}
                    />
                    <TextArea // TextArea を使用
                        id="description"
                        name="description"
                        className="text-xs sm:text-base mt-1 block w-full h-32 md:h-36 lg:h-40 placeholder-gray-400" // 高さを小さく調整
                        value={form.data.description}
                        onChange={(e) =>
                            form.setData("description", e.target.value)
                        }
                        rows={7}
                        placeholder={`このキャラクターがどのような性格なのか、\nどのような能力を持つのかを記載してください。\n\n例：「私は褒めるのが得意なカウンセラーです。とにかく話を聞くのが得意です。」
                            `}
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
                        会話する言語に合わせてモードを選択すると、より正確な応答が得られます。
                    </p>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-100">
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
        ),
        [
            form.data,
            form.errors,
            form.processing,
            editRole,
            handleClose,
            languages,
        ]
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
