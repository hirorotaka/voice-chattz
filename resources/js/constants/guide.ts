import { SlideType } from "@/types/types";
import { AWS_CLOUDFRONT_URL } from "./utils";

export const slides: SlideType[] = [
    {
        title: "Step 1: スレッドを作成",
        description:
            "サイドバーの「+新規スレッド作成」をクリック。\n学習したい言語とAIの役割を選んで会話を始めましょう。",
        image: {
            webp: `${AWS_CLOUDFRONT_URL}/step1.webp`,
            fallback: "/step1.png",
        },
    },
    {
        title: "Step 2: 会話を始める",
        description:
            "画面下部のマイクボタンをクリックして録音開始。\n赤色に変わったら、話しかけてみましょう。",
        image: {
            webp: `${AWS_CLOUDFRONT_URL}/step2.webp`,
            fallback: "/step2.png",
        },
    },
    {
        title: "Step 3: 会話を送信",
        description:
            "話し終わったら、もう一度マイクボタンをクリック。\nあなたの声が、AIに送信されます。",
        image: {
            webp: `${AWS_CLOUDFRONT_URL}/step3.webp`,
            fallback: "/step3.png",
        },
    },
    {
        title: "Step 4: AIと対話",
        description:
            "AIが音声で応答します。\n右下のスライダーで音声の速度を調整できます。\n必要な場合は、日本語訳も表示できます。",
        image: {
            webp: `${AWS_CLOUDFRONT_URL}/step4.webp`,
            fallback: "/step4.png",
        },
    },
    {
        title: "カスタム機能1: オリジナルAIを作る",
        description:
            "右上のユーザー名 → 「役割一覧（自分）」をクリック。\n自分だけのAIキャラクターを作成できます。\n作ったAIは「公開」をオンにすると、他のユーザーにもシェアできます。",
        image: {
            webp: `${AWS_CLOUDFRONT_URL}/step5.webp`,
            fallback: "/step5.png",
        },
    },
    {
        title: "カスタム機能2: 公開されたAIを使う",
        description:
            "右上のユーザー名 → 「役割一覧（公開中）」をクリック。\n「公開中のものを使用する」をオンにすると、\n他のユーザーが作成したAIキャラクターを使えます。\n役割はスレッドを作成するときに選べるようになります。",
        image: {
            webp: `${AWS_CLOUDFRONT_URL}/step6.webp`,
            fallback: "/step6.png",
        },
    },
    {
        title: "注意点: ブラウザからのマイクのアクセス許可(chrome,edge)",
        description:
            "ブラウザからマイクのアクセス許可のポップアップが出る方は、許可をクリックしてください。\n拒否を押してしまった方は、URL欄左端にあるアイコンをクリックしてマイクの許可をしてください。",
        image: {
            webp: `${AWS_CLOUDFRONT_URL}/step7.webp`,
            fallback: "/step7.png",
        },
    },
];
