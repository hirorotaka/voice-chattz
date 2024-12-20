import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect } from "react";
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import AuthLogo from "./AuthLogo";
import AuthFooter from "./AuthFooter";
import { useAppContext } from "@/Contexts/AppContext";

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    flash: {
        success?: string;
        error?: string;
        flashData?: any;
        errorId?: string;
        audioUrl?: string;
    };
}

export default function Login({ status, canResetPassword, flash }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const { showToast } = useAppContext();

    const handleSuccess = () => {
        showToast("ログインしました", "success");
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onSuccess: () => handleSuccess(),
            onFinish: () => reset("password"),
        });
    };

    //ログアウト時のメッセージ
    useEffect(() => {
        if (flash.success) {
            showToast("ログアウトしました", "success");
        }
    }, [flash.success]);

    return (
        <GuestAppLayout title="ログイン">
            <div className="relative min-h-screen flex flex-col items-center ">
                <div className="w-full max-w-md space-y-8 px-4">
                    {/* ロゴ */}
                    <AuthLogo />

                    {/* フォームコンテナ */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl blur-xl" />
                        <div className="relative bg-white/5 backdrop-blur-lg p-4 shadow-2xl rounded-2xl">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        className="text-slate-100"
                                    >
                                        メールアドレス
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </InputLabel>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full bg-white/5 border-gray-700 focus:border-indigo-500 text-white placeholder-gray-500"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="your@email.com"
                                        required
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        className="text-slate-100"
                                    >
                                        パスワード
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </InputLabel>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full bg-white/5 border-gray-700 focus:border-indigo-500 text-white"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                            className="border-gray-700 text-indigo-500 focus:ring-indigo-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-300">
                                            ログイン状態を保持
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                                        >
                                            パスワードをお忘れの方
                                        </Link>
                                    )}
                                </div>

                                <div>
                                    <PrimaryButton
                                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors"
                                        disabled={processing}
                                    >
                                        ログイン
                                    </PrimaryButton>
                                </div>

                                <div className="text-center">
                                    <Link
                                        href={route("register")}
                                        className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        アカウントをお持ちでない方はこちら
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* フッター */}
                    <AuthFooter />
                </div>
            </div>
        </GuestAppLayout>
    );
}
