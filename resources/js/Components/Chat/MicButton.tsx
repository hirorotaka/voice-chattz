// components/MicButton/MicButton.tsx
import { memo } from "react";
import { HiMicrophone } from "react-icons/hi2";
import { Tooltip } from "flowbite-react";

interface MicButtonProps {
    isRecording: boolean;
    isActiveAiSound: boolean;
    onStart: () => void;
    onStop: () => void;
}

export const MicButton = memo(
    ({ isRecording, isActiveAiSound, onStart, onStop }: MicButtonProps) => {
        if (isActiveAiSound) {
            return (
                <button className="p-2 sm:p-3 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none relative z-40 bg-gray-400">
                    <HiMicrophone className="h-6 w-6 sm:w-12 sm:h-12 text-gray-600" />
                </button>
            );
        }

        return (
            <Tooltip
                content={
                    <span className="text-md font-bold">
                        {isRecording ? "録音停止" : "録音開始"}
                    </span>
                }
                placement="top"
                style="light"
                arrow={false}
                theme={{
                    base: "absolute z-40 inline-block rounded-lg px-3 py-2 text-sm font-medium shadow-sm",
                }}
            >
                <button
                    className={`p-2 sm:p-3 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-40
                    ${
                        isRecording
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={isRecording ? onStop : onStart}
                    aria-label={isRecording ? "録音停止" : "録音開始"}
                >
                    <HiMicrophone
                        className={`h-6 w-6 sm:w-12 sm:h-12 ${
                            isRecording ? "text-white" : "text-gray-600"
                        }`}
                    />
                </button>
            </Tooltip>
        );
    }
);

MicButton.displayName = "MicButton";
