import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useMemo, useRef, useState } from "react";
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
    role_id: number | null | undefined;
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
        title: "",
        role_id: undefined,
        language_id: undefined,
    });
    const { showToast } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);

    // マウント時の処理
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSuccess = () => {
        showToast("スレッドを作成しました", "success");
    };

    const handleClose = () => {
        form.clearErrors();
        form.reset();
        onClose();
    };

    const handleLanguageChange = (languageId: number) => {
        form.setData({
            role_id: undefined,
            language_id: languageId,
            title: getDefaultTitle(languageId),
        });
    };

    const createThread: FormEventHandler = async (e) => {
        e.preventDefault();

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

    const modalContent = useMemo(
        () => (
            <form onSubmit={createThread} className="p-6">
                <h1 className="text-lg sm:text-2xl font-medium text-gray-900">
                    新規スレッドを作成
                </h1>

                {/* 言語選択 */}
                <div className="mt-6">
                    <InputLabel>
                        対話モード<span className="text-red-500 ml-1">*</span>
                    </InputLabel>
                    <p className="text-sm text-gray-500 mb-4">
                        使用する言語を選択してください
                    </p>
                    <div className="grid grid-cols-4 gap-3 max-w-100">
                        {languages?.map((language) => (
                            <label
                                key={language.locale}
                                className={`
                                relative flex items-center justify-center p-1 sm:p-4 rounded-xl cursor-pointer
                                transition-all duration-200 ease-in-out
                                ${
                                    Number(form.data.language_id) ===
                                    Number(language.id)
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
                                    className="sr-only"
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
                    <InputLabel>
                        AIキャラクターを選択
                        <span className="text-red-500 ml-1">*</span>
                    </InputLabel>
                    <p className="text-xs sm:text-sm text-gray-500 mb-4">
                        目的に合わせたAIキャラクターとの会話が可能です。
                        <br />
                        スレッド作成時に、自作または公開中のAIキャラクターを選択できます。
                        <br />
                        デフォルト（フリートーク）では、一般的なAIキャラクターを選択できます。
                    </p>
                    <div className="flex gap-4 text-sm mb-4">
                        <Link
                            href={route("roles.index")}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 underline-offset-2 hover:underline"
                        >
                            <span>→ AIキャラクター作成</span>
                        </Link>
                        <Link
                            href={route("roles.public")}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 underline-offset-2 hover:underline"
                        >
                            <span>→ 公開AIキャラクター</span>
                        </Link>
                    </div>

                    <div
                        className="relative w-64 h-64 sm:h-60 sm:w-96"
                        ref={dropdownRef}
                    >
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full px-3 py-2 bg-white border rounded-md text-left flex justify-between items-center"
                        >
                            <span
                                className={`
                                    ${
                                        form.data.role_id === undefined
                                            ? "text-gray-400"
                                            : "text-gray-900"
                                    }
                                    text-xs sm:text-base
                                 `}
                            >
                                {form.data.role_id === undefined
                                    ? "AIキャラクターを選択してください"
                                    : form.data.role_id === null
                                    ? "デフォルト（フリートーク）"
                                    : roles.find(
                                          (role) =>
                                              role.id === form.data.role_id
                                      )?.name}
                            </span>
                            <span
                                className={`text-gray-400 transform transition-transform duration-200 ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            >
                                ▼
                            </span>
                        </button>

                        {isOpen && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-sm overflow-y-auto max-h-52 sm:max-h-60">
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
                                            className="text-xs sm:text-sm cursor-pointer px-3 py-2 hover:bg-gray-200"
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
                        disabled={
                            form.processing ||
                            !form.data.language_id ||
                            form.data.role_id === undefined
                        }
                    >
                        作成する
                    </PrimaryButton>
                </div>
            </form>
        ),
        [
            form,
            handleClose,
            handleLanguageChange,
            createThread,
            isOpen,
            roles,
            show,
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
