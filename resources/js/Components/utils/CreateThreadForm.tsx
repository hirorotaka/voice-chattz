import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import InputLabel from "@/Components/InputLabel";
import { LanguageType, RoleType } from "@/types/types";

interface CreateThreadFormProps {
    onClose: () => void;
    show: boolean;
    resetScroll: () => void;
    languages: LanguageType[];
    roles: RoleType[];
}

interface FormData {
    title: string;
    role_id: number | null;
    language_id: number | null;
}

export default function CreateThreadForm({
    onClose,
    show,
    resetScroll,
    languages,
    roles,
}: CreateThreadFormProps) {
    const form = useForm<FormData>({
        title: "無題のスレッド", // デフォルトタイトルを設定
        role_id: null,
        language_id: null,
    });

    const handleClose = () => {
        form.clearErrors();
        form.reset();
        onClose();
    };

    // 言語選択時に両方のデータを更新
    const handleLanguageChange = (value: number) => {
        form.setData({
            role_id: null,
            language_id: value,
            title: value === 2 ? "無題のスレッド" : "Untitled Thread",
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
                <h1 className="text-2xl font-medium text-gray-900">
                    新規スレッドを作成
                </h1>

                {/* 言語選択 */}
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
                        Number(form.data.language_id) === Number(language.id)
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
                                        Number(form.data.language_id) ===
                                        Number(language.id)
                                    }
                                    onChange={(e) =>
                                        handleLanguageChange(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="sr-only" // ラジオボタンを視覚的に隠す
                                />
                                <span
                                    className={`text-base font-medium ${
                                        Number(form.data.language_id) ===
                                        Number(language.id)
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

                {/* 役割選択 */}
                <div className="mt-6">
                    <InputLabel value="役割選択 *" />
                    <p className="text-sm text-gray-500 mb-4">
                        AIに特定の役割や専門性を持たせることができます。
                        <br />
                        例えば、プログラマー役で技術的な会話や、ライター役で文章作成の相談など、
                        <br />
                        目的に応じて選択してください。
                        選択しない場合は、汎用的なAIとして会話します。
                    </p>
                    <select
                        value={form.data.role_id || ""}
                        onChange={(e) =>
                            form.setData("role_id", Number(e.target.value))
                        }
                        className="w-10/12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">デフォルト（フリートーク）</option>
                        {roles
                            .filter(
                                (role) =>
                                    role.language_id === form.data.language_id
                            )
                            .map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                    </select>
                    {form.errors.role_id && (
                        <div className="text-red-500 text-sm mt-1">
                            {form.errors.role_id}
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
