import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useMemo, useState } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { LanguageType } from "@/types/types";
import TextArea from "../TextArea";
import { useAppContext } from "@/Contexts/AppContext";
import { ROLE_FORM_NAMES } from "@/constants/utils";

interface CreateRoleFormProps {
    onClose: () => void;
    show: boolean;
    languages: LanguageType[];
}

interface FormData {
    name: string;
    first_message: string;
    description: string;
    language_id: string; // 言語IDを追加
}

export default function CreateRoleForm({
    onClose,
    show,
    languages,
}: CreateRoleFormProps) {
    const form = useForm<FormData>({
        name: "",
        first_message: "",
        description: "",
        language_id: "", // 初期値を空に設定
    });

    const { showToast } = useAppContext();

    const [mounted, setMounted] = useState(false);

    // マウント時の処理
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSuccess = () => {
        showToast(`${ROLE_FORM_NAMES.ai_chara}を作成しました`, "success");
    };

    const handleClose = () => {
        form.clearErrors();
        form.reset();
        onClose();
    };

    const createRole: FormEventHandler = async (e) => {
        e.preventDefault();
        form.post(route("roles.store"), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                handleClose();
                handleSuccess();
            },
        });
    };

    const modalContent = useMemo(
        () => (
            <form
                onSubmit={createRole}
                className="p-6  max-h-[90vh] max-w-[90vw] overflow-y-auto"
            >
                <h1 className="text-lg sm:text-2xl font-medium text-gray-900">
                    {ROLE_FORM_NAMES.ai_chara}を作成
                </h1>

                <div className="mt-6">
                    <InputLabel htmlFor="name">
                        {ROLE_FORM_NAMES.ai_character}
                        <span className="text-red-500 ml-1">*</span>
                    </InputLabel>
                    <TextInput
                        id="name"
                        name="name"
                        type="text"
                        className="mt-1 block w-11/12"
                        v-model={form.data.name}
                        onChange={(e) => form.setData("name", e.target.value)} // nameの更新
                    />
                    {form.errors.name && (
                        <div className="text-red-500 text-sm mt-1">
                            {form.errors.name}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="first_message">
                        {ROLE_FORM_NAMES.first_message}
                        <span className="text-red-500 ml-1">*</span>
                    </InputLabel>
                    <TextArea // TextArea を使用
                        id="first_message"
                        name="first_message"
                        className="mt-1 block w-full h-24 md:h-28 lg:h-32 placeholder-gray-400 sm:placeholder:text-sm placeholder:text-xs" // 高さを小さく調整
                        value={form.data.first_message}
                        placeholder={`スレッド開始時にAIが最初に送信するメッセージを入力してください。\n例：「こんにちは！私は〇〇が得意なAIです。どんな〇〇をしたいですか？」\n\n※こちらを作成することで会話の方向性を強化します。`}
                        onChange={(e) =>
                            form.setData("first_message", e.target.value)
                        }
                        rows={5}
                    />
                    {form.errors.first_message && (
                        <div className="text-red-500 text-sm mt-1">
                            {form.errors.first_message}
                        </div>
                    )}
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="description">
                        {ROLE_FORM_NAMES.description}
                        <span className="text-red-500 ml-1">*</span>
                    </InputLabel>
                    <TextArea // TextArea を使用
                        id="description"
                        name="description"
                        className="mt-1 block w-full h-32 md:h-36 lg:h-40 placeholder-gray-400 sm:placeholder:text-sm placeholder:text-xs" // 高さを小さく調整
                        value={form.data.description}
                        onChange={(e) =>
                            form.setData("description", e.target.value)
                        }
                        rows={10}
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
                    <InputLabel>
                        対話モード
                        <span className="text-red-500 ml-1">*</span>
                    </InputLabel>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                        会話する言語に合わせてモードを選択すると、より正確な応答が得られます。
                    </p>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-100">
                        {languages?.map((language) => (
                            <label
                                key={language.locale}
                                className={`
                    relative flex items-center justify-center p-1 sm:p-4 rounded-xl cursor-pointer
                    transition-all duration-200 ease-in-out text-xs sm:text-sm
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
                                        form.setData(
                                            "language_id",
                                            e.target.value
                                        )
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
                    {form.errors.language_id && (
                        <div className="text-red-500 text-sm mt-1">
                            {form.errors.language_id}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end ">
                    <SecondaryButton type="button" onClick={handleClose}>
                        キャンセル
                    </SecondaryButton>

                    <PrimaryButton
                        className="ms-3"
                        type="submit"
                        disabled={
                            form.processing ||
                            !form.data.name ||
                            !form.data.first_message ||
                            !form.data.description ||
                            !form.data.language_id
                        }
                    >
                        作成する
                    </PrimaryButton>
                </div>
            </form>
        ),
        [
            form.data,
            form.errors,
            createRole,
            handleClose,
            languages,
            form.setData,
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
