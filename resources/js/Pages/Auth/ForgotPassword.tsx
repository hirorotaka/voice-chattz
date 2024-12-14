import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import AuthLogo from "./AuthLogo";
import AuthFooter from "./AuthFooter";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("password.email"));
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
                            <div className="mb-4 text-sm text-gray-300">
                                パスワードをお忘れの方は、メールアドレスをご入力ください。
                                パスワードリセット用のリンクをメールでお送りします。
                            </div>

                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-500">
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

                                <div className="flex items-center justify-between">
                                    <Link
                                        href={route("login")}
                                        className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                                    >
                                        ログイン画面に戻る
                                    </Link>

                                    <PrimaryButton
                                        className="justify-center py-3 bg-indigo-600 hover:bg-indigo-500 transition-colors"
                                        disabled={processing}
                                    >
                                        リセットリンクを送信
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
