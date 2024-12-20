import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import AuthLogo from "./AuthLogo";
import AuthFooter from "./AuthFooter";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestAppLayout title="パスワードリセット">
            <Head title="パスワードリセット" />
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
                                        htmlFor="password"
                                        className="text-slate-100"
                                    >
                                        パスワード
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
                                        value="新しいパスワード"
                                        className="text-slate-100"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full bg-white/5 border-gray-700 focus:border-indigo-500 text-white"
                                        autoComplete="new-password"
                                        isFocused={true}
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
                                        value="新しいパスワード（確認）"
                                        className="text-slate-100"
                                    />
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

                                <div>
                                    <PrimaryButton
                                        className="w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors"
                                        disabled={processing}
                                    >
                                        パスワードをリセット
                                    </PrimaryButton>
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
