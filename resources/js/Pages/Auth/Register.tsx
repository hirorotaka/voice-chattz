import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import GuestAuthLayout from "@/Layouts/GuestAuthLayout";

import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestAppLayout title="アカウント登録">
            <GuestAuthLayout>
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel
                            htmlFor="name"
                            value="氏名"
                            className="text-slate-100"
                        />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full bg-white/5 border-gray-700 focus:border-indigo-500 text-white"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            placeholder="your name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

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
                            className="mt-1 block w-full bg-white/5 border-gray-700 focus:border-indigo-500 text-white"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
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
                            value="パスワード（確認用）"
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
                                setData("password_confirmation", e.target.value)
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
            </GuestAuthLayout>
        </GuestAppLayout>
    );
}
