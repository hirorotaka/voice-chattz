import ApplicationLogo from "@/Components/ApplicationLogo";
import PrimaryButton from "@/Components/PrimaryButton";
import { Link, Head } from "@inertiajs/react";

// エラーステータスコードの型定義
type ErrorStatusCode = 403 | 404 | 500 | 503;

// エラーページのProps型定義
interface ErrorPageProps {
    status: ErrorStatusCode;
}

// タイトルとメッセージのマッピング型
type ErrorMessages = {
    [key in ErrorStatusCode]: string;
};

const titles: ErrorMessages = {
    503: "503 SERVICE UNAVAILABLE",
    500: "500 SERVER ERROR",
    404: "404 NOT FOUND",
    403: "403 FORBIDDEN",
};

const descriptions: ErrorMessages = {
    503: "申し訳ございませんが、現在メンテナンス中です。しばらくお待ちください。",
    500: "サーバーに異常が発生しました。",
    404: "お探しのページは見つかりませんでした。",
    403: "このページへのアクセスは禁止されています。",
};

const Error = ({ status }: ErrorPageProps) => {
    const title = titles[status];
    const description = descriptions[status];

    return (
        <>
            <Head title={description} />

            <div className="text-zinc-800 mt-36 mb-32 px-6">
                <h1 className="font-medium sm:text-7xl text-4xl text-center">
                    {title}
                </h1>
                <p className="text-center font-medium mt-3 sm:text-md text-xl">
                    {description}
                </p>
                <div className="flex mt-8 justify-center">
                    <Link href="/">
                        <PrimaryButton>トップに戻る</PrimaryButton>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Error;
