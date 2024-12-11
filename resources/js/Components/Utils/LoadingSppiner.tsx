const LoadingSppiner = () => {
    return (
        <div
            className="flex flex-col items-center justify-center gap-3"
            aria-label="読み込み中"
        >
            {/* メインのローディングアニメーション */}
            <div className="relative h-40 w-40">
                {/* バックグラウンドサークル */}
                <div className="absolute inset-0 rounded-full border-[3px] border-slate-700/20" />

                {/* スピニングインジケーター */}
                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-white animate-spin" />

                {/* 中央のドット */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </div>
            </div>

            {/* テキスト */}
            <span className="text-white/80 text-2xl font-medium tracking-wider">
                Processing...
            </span>
        </div>
    );
};

export default LoadingSppiner;
