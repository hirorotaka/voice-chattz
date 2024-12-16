// components/Thread/FavoriteThread.tsx
import { memo } from "react";
import { BsFillPinAngleFill } from "react-icons/bs";
import { HiTrash, HiOutlinePencil } from "react-icons/hi2";
import { Tooltip } from "flowbite-react";
import { ThreadType } from "@/types/types";

interface FavoriteThreadProps {
    thread: ThreadType;
    isActive: boolean;
    onSelect: (threadId: number) => void;
    onEdit: (threadId: number, title: string) => void;
    onDelete: (threadId: number) => void;
}

export const FavoriteThread = memo(
    ({ thread, isActive, onSelect, onEdit, onDelete }: FavoriteThreadProps) => {
        return (
            <div
                key={thread.id}
                className={`relative flex items-center text-white rounded cursor-pointer transition-colors duration-200 ${
                    isActive
                        ? "bg-blue-800 font-bold transition-none"
                        : "hover:bg-blue-700"
                }`}
            >
                <button
                    onClick={() => onSelect(thread.id)}
                    className="flex-1 flex items-center p-2 pr-14"
                >
                    <BsFillPinAngleFill className="flex-shrink-0 h-5 w-5 mr-2 text-yellow-400" />
                    <p className="text-sm text-left">{thread.title}</p>
                </button>

                <div className="absolute right-0 w-12 flex justify-center">
                    {isActive && (
                        <>
                            <Tooltip
                                content={
                                    <span className="text-md font-bold">
                                        編集
                                    </span>
                                }
                                placement="bottom"
                                style="light"
                                arrow={false}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(thread.id, thread.title);
                                    }}
                                    className="p-1 rounded hover:bg-blue-400/50 text-blue-200 hover:text-blue-100 transition-colors"
                                >
                                    <HiOutlinePencil className="h-4 w-4" />
                                </button>
                            </Tooltip>
                            <Tooltip
                                content={
                                    <span className="text-sm font-bold text-red-500">
                                        削除
                                    </span>
                                }
                                placement="bottom"
                                style="light"
                                arrow={false}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(thread.id);
                                    }}
                                    className="p-1 mr-2 rounded hover:bg-blue-400/50 text-blue-200 hover:text-blue-100 transition-colors"
                                >
                                    <HiTrash className="h-4 w-4" />
                                </button>
                            </Tooltip>
                        </>
                    )}
                </div>
            </div>
        );
    }
);

FavoriteThread.displayName = "FavoriteThread";
