import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import { Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import AuthLogo from "./AuthLogo";
import AuthFooter from "./AuthFooter";
import { useAppContext } from "@/Contexts/AppContext";
import LegalLinks from "@/Components/Legal/LegalLinks";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        agreement: false,
    });

    const isFormValid = () => {
        return (
            data.name.trim() !== "" &&
            data.email.trim() !== "" &&
            data.password.trim() !== "" &&
            data.password_confirmation.trim() !== "" &&
            data.agreement
        );
    };

    const { showToast } = useAppContext();

    const handleSuccess = () => {
        showToast("ログインしました", "success");
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onSuccess: () => handleSuccess(),
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestAppLayout title="アカウント登録">
            <div className="relative min-h-screen flex flex-col items-center ">
                <div className="w-full max-w-md space-y-4  px-4">
                    {/* ロゴ */}
                    <AuthLogo />

                    {/* フォームコンテナ */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl blur-xl" />
                        <div className="relative bg-white/5 backdrop-blur-lg p-4 shadow-2xl rounded-2xl">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        className="text-slate-100"
                                    >
                                        氏名
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </InputLabel>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full bg-white/5 border-gray-700 focus:border-indigo-500 text-white"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                        placeholder="your name"
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

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
                                        className="mt-1 block w-full bg-white/5 border-gray-700 focus:border-indigo-500 text-white"
                                        autoComplete="username"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                        placeholder="your@email.com"
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
                                        autoComplete="new-password"
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

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        className="text-slate-100"
                                    >
                                        パスワード（確認用）
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </InputLabel>
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full bg-white/5 border-gray-700 focus:border-indigo-500 text-white"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="agreement"
                                            name="agreement"
                                            checked={data.agreement}
                                            onChange={(e) =>
                                                setData(
                                                    "agreement",
                                                    e.target.checked
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-700 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                                            required
                                        />
                                        <label className="text-sm text-slate-100">
                                            <span className="flex items-center">
                                                <span>
                                                    <LegalLinks />
                                                    に同意します
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                    <InputError
                                        message={errors.agreement}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <PrimaryButton
                                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors"
                                        disabled={processing || !isFormValid()}
                                    >
                                        登録する
                                    </PrimaryButton>
                                </div>

                                <div className="text-center">
                                    <Link
                                        href={route("login")}
                                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        アカウントをお持ちの方はこちら
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
