import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import GuestAuthLayout from "@/Layouts/GuestAuthLayout";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestAppLayout title="ログイン">
            <GuestAuthLayout>
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-400">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="メールアドレス"
                            className="text-slate-100"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full bg-white/5 border-gray-700 focus:border-indigo-500 text-white placeholder-gray-500"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="your@email.com"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="パスワード"
                            className="text-slate-100"
                        />
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
                                    setData("remember", e.target.checked)
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
            </GuestAuthLayout>
        </GuestAppLayout>
    );
}
