import AppLayout from "@/Layouts/AppLayout";
import { LanguageType, RoleType, ThreadType } from "@/types/types";
import { Tooltip } from "flowbite-react";
import { HiTrash, HiOutlinePencil } from "react-icons/hi2";

interface TopProps {
    threads: ThreadType[];
    languages: LanguageType[];
}

export default function Index({ threads, languages }: TopProps) {
    const sampleRoles: RoleType[] = [
        {
            id: 1,
            name: "プログラマーあああああああああああああああ",
            first_message:
                "こんにちは！私はプログラミングが得意なAIです。どんなプログラムを作りたいですか？",
            description:
                "様々なプログラミング言語で、あなたの要望に沿ったプログラムを作成します。",
        },
        {
            id: 2,
            name: "ライター",
            first_message:
                "はじめまして！私は文章を書くのが得意なAIです。どんな記事を書きたいですか？",
            description:
                "ブログ記事、小説、詩など、様々なジャンルの文章を作成できます。",
        },
        {
            id: 3,
            name: "翻訳家",
            first_message:
                "Hello! I am an AI who is good at translation. What language do you want to translate?",
            description:
                "英語、日本語、中国語など、様々な言語の翻訳に対応しています。",
        },
        {
            id: 4,
            name: "詩人",
            first_message:
                "こんにちは。私は詩を書くAIです。あなたの心に響く詩を詠みます。",
            description: "美しい言葉で、あなたの心を表現する詩を創作します。",
        },
        {
            id: 5,
            name: "作曲家",
            first_message:
                "どうも！私は作曲ができるAIです。どんな音楽を作りたいですか？",
            description: "様々なジャンルの音楽を制作できます。",
        },
    ];

    return (
        <AppLayout title="roles" threads={threads} languages={languages}>
            <div className="h-full flex flex-col p-5">
                <p className="text-2xl sm:text-3xl font-semibold mb-6 text-white text-center">
                    役割一覧
                </p>
                <div className="overflow-x-auto rounded-lg shadow-md bg-gray-300">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    役割名
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    初回メッセージ
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    説明
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">編集</span>
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">削除</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sampleRoles.map((role) => (
                                <tr key={role.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] break-words">
                                        {role.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {role.first_message}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {role.description}
                                    </td>
                                    <td className="text-right text-sm font-medium">
                                        <Tooltip
                                            content={
                                                <span className="text-md font-bold">
                                                    編集
                                                </span>
                                            }
                                            placement="bottom"
                                            style="dark"
                                            arrow={false}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="p-1 rounded text-gray-500 hover:text-gray-400 transition-colors"
                                            >
                                                <HiOutlinePencil className="h-5 w-5" />
                                            </button>
                                        </Tooltip>
                                    </td>
                                    <td className="text-right text-sm font-medium">
                                        <Tooltip
                                            content={
                                                <span className="text-md font-bold">
                                                    削除
                                                </span>
                                            }
                                            placement="bottom"
                                            style="dark"
                                            arrow={false}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                className="p-1 rounded text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <HiTrash className="h-5 w-5" />
                                            </button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
