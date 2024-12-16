// components/Overlay/Overlay.tsx
import { memo } from "react";
import LoadingSppiner from "../Utils/LoadingSppiner";

interface MessageOverlayProps {
    isRecording: boolean;
    isCreatingMessage: boolean;
    isSending: boolean;
}

export const MessageOverlay = memo(
    ({ isRecording, isCreatingMessage, isSending }: MessageOverlayProps) => (
        <>
            {/* 録音中またはSE再生中のオーバーレイ - マイクボタン以外を押せないようにする */}
            {isRecording && (
                <div className="fixed inset-0 bg-black/5 backdrop-blur-[0.7px] z-40" />
            )}
            {/* Ai応答中のオーバーレイ  */}
            {isCreatingMessage && (
                <div className="fixed inset-0 bg-black/5 backdrop-blur-[0.5px] z-50" />
            )}

            {/* ローディング中の表示とオーバーレイ */}
            {isSending && (
                <>
                    <div className="fixed inset-0 backdrop-blur-[0.7px] bg-black/5 z-50 transition-all duration-300 ease-in-out" />
                    <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ease-in-out">
                        <LoadingSppiner />
                    </div>
                </>
            )}
        </>
    )
);

MessageOverlay.displayName = "MessageOverlay";
