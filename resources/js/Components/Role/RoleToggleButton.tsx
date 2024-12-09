import { router } from "@inertiajs/react";
import { useState } from "react";

interface TogglePublicFormProps {
    isPublic: 0 | 1;
    roleId: number;
}

const TogglePublicForm = ({ isPublic, roleId }: TogglePublicFormProps) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handlerolePublicToggle = async () => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            await router.put(
                // PUTメソッドを使用
                route("roles.toggle-public", { role: roleId }),
                {}, // データを送信しない場合は空のオブジェクトでOK
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setIsUpdating(false),
                }
            );
        } catch (error) {
            console.error("公開設定の更新に失敗しました:", error);
            setIsUpdating(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handlerolePublicToggle}
            disabled={isUpdating}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full
                transition-colors duration-200 ease-in-out focus:outline-none
                ${isPublic === 1 ? "bg-blue-600" : "bg-gray-200"}
                ${
                    isUpdating
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                }
            `}
            aria-pressed={isPublic === 1}
            aria-label={isPublic === 1 ? "公開" : "非公開"}
        >
            <span className="sr-only">
                {isPublic === 1 ? "公開" : "非公開"}
            </span>
            <div
                className={`
                    inline-block h-4 w-4 rounded-full bg-white shadow
                    transform transition-transform duration-200 ease-in-out
                    ${isPublic === 1 ? "translate-x-6" : "translate-x-1"}
                `}
            />
        </button>
    );
};

export default TogglePublicForm;
