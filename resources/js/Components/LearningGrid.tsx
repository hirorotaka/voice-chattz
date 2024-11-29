import React from "react";

export const LearningGrid = () => {
    const rows = 6;
    const cols = 12;

    return (
        <div className="w-full overflow-x-auto">
            <div
                className="grid gap-1 sm:gap-2 w-max mx-auto"
                style={{
                    gridTemplateColumns: `repeat(${cols}, minmax(32px, 1fr))`,
                    gridTemplateRows: `repeat(${rows}, minmax(32px, 1fr))`,
                }}
            >
                {Array.from({ length: rows * cols }).map((_, index) => (
                    <div
                        key={index}
                        className={`
                            w-8 h-8
                            sm:w-10 sm:h-10
                            md:w-12 md:h-12
                            lg:w-14 lg:h-14
                            xl:w-16 xl:h-16
                            border
                            ${
                                index === 106 || index === 107
                                    ? "bg-green-500"
                                    : "bg-gray-200"
                            }
                        `}
                    />
                ))}
            </div>
        </div>
    );
};
