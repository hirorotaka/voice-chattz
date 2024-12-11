import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import InputLabel from "@/Components/InputLabel";
import { IsUsingRoleType, LanguageType } from "@/types/types";
import { useAppContext } from "@/Contexts/AppContext";
import { getDefaultTitle } from "@/constants/languages";

interface CreateThreadFormProps {
    onClose: () => void;
    show: boolean;
    resetScroll: () => void;
    languages: LanguageType[];
    roles: IsUsingRoleType[];
}

interface FormData {
    title: string;
    role_id: number | null;
    language_id: number | null | undefined;
}

export default function CreateThreadForm({
    onClose,
    show,
    resetScroll,
    languages,
    roles,
}: CreateThreadFormProps) {
    const form = useForm<FormData>({
        title: getDefaultTitle(2), // デフォルトは日本語
        role_id: null,
        language_id: undefined,
    });
    const { showToast } = useAppContext();

    const handleSuccess = () => {
        showToast("スレッドを作成しました", "success");
    };

    const handleClose = () => {
        form.clearErrors();
        form.reset();
        onClose();
    };

    // 言語選択時に両方のデータを更新
    const handleLanguageChange = (languageId: number) => {
        form.setData({
            role_id: null,
            language_id: languageId,
            title: getDefaultTitle(languageId),
        });
    };

    const createThread: FormEventHandler = async (e) => {
        e.preventDefault();

        // データが設定された後で送信
        form.post(route("thread.store"), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                handleSuccess();
                resetScroll();
                handleClose();
            },
        });
    };

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // クリックアウトサイドで閉じる
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    <div className="grid grid-cols-3 gap-3 max-w-80">
                        {languages?.map((language) => (
                            <label
                                key={language.locale}
                                className={`
                    relative flex items-center justify-center p-2 sm:p-4 rounded-xl cursor-pointer
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

                <div className="mt-6">
                    <InputLabel value="役割選択 *" />
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                        AIに特定の役割や専門性を持たせることができます。
                    </p>

                    <div
                        className="relative w-60  h-72 sm:h-60 sm:w-96"
                        ref={dropdownRef}
                    >
                        {/* トリガーボタン */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full px-3 py-2 bg-white border rounded-md text-left flex justify-between items-center"
                        >
                            <span>
                                {form.data.role_id
                                    ? roles.find(
                                          (role) =>
                                              role.id === form.data.role_id
                                      )?.name
                                    : "デフォルト（フリートーク）"}
                            </span>
                            <span className="text-gray-400">▼</span>
                        </button>

                        {/* オプションリスト */}
                        {isOpen && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-sm overflow-y-auto max-h-60">
                                <div
                                    className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                                    onClick={() => {
                                        form.setData("role_id", null);
                                        setIsOpen(false);
                                    }}
                                >
                                    デフォルト（フリートーク）
                                </div>
                                {roles
                                    .filter(
                                        (role) =>
                                            role.language?.id ===
                                            form.data.language_id
                                    )
                                    .map((role) => (
                                        <div
                                            key={role.id}
                                            className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                                            onClick={() => {
                                                form.setData(
                                                    "role_id",
                                                    role.id
                                                );
                                                setIsOpen(false);
                                            }}
                                        >
                                            {role.name}
                                        </div>
                                    ))}
                            </div>
                        )}
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
