import { ButtonHTMLAttributes } from "react";

export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={`
                inline-flex items-center justify-center gap-2 rounded-md
                border border-transparent bg-gray-800 px-4 py-2
                text-xs font-semibold uppercase tracking-widest text-white
                transition duration-150 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                ${
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900"
                }
                ${className}
            `}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
