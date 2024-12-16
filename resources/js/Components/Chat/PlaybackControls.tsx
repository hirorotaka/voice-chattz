import { memo } from "react";

interface PlaybackControlsProps {
    globalPlaybackRate: number;
    handlePlaybackRateChange: (e: any) => void;
    handlePlaybackRateReset: () => void;
}

export const PlaybackSpeedControls = memo(
    ({
        globalPlaybackRate,
        handlePlaybackRateChange,
        handlePlaybackRateReset,
    }: PlaybackControlsProps) => (
        <div className="flex items-center mr-auto pl-5">
            <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={globalPlaybackRate}
                onInput={handlePlaybackRateChange}
                aria-label="再生速度"
                className="sm:w-40 h-2 bg-gray-400 rounded-full appearance-none block"
            />
            <div className="ml-2 text-white text-lg w-8">
                {globalPlaybackRate}x
            </div>
            <div
                onClick={handlePlaybackRateReset}
                className="ml-2 text-white text-sm bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full cursor-pointer"
            >
                リセット
            </div>
        </div>
    )
);

PlaybackSpeedControls.displayName = "PlaybackControls";
