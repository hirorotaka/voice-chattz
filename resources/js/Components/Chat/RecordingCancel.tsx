// components/RecordingCancel/RecordingCancel.tsx
import { memo } from "react";

interface RecordingCancelProps {
    isRecording: boolean;
    recordingTime: number;
    maxRecordingTime: number;
    formatTime: (seconds: number) => string;
    onCancel: () => void;
}

export const RecordingCancel = memo(
    ({
        isRecording,
        recordingTime,
        maxRecordingTime,
        formatTime,
        onCancel,
    }: RecordingCancelProps) => {
        if (!isRecording) return null;

        return (
            <div className="flex items-center gap-4 relative mr-4 z-40">
                {/* 録音時間表示 */}
                <div className="flex items-center gap-2">
                    <div className="animate-pulse">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-lg font-medium text-white min-w-[130px] text-right font-mono">
                        {`${formatTime(recordingTime)}/${formatTime(
                            maxRecordingTime
                        )}`}
                    </span>
                </div>
                {/* キャンセルボタン */}
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors duration-200"
                    aria-label="録音キャンセル"
                >
                    キャンセル
                </button>
            </div>
        );
    }
);

RecordingCancel.displayName = "RecordingCancel";
