export const LearningGrid = () => {
    const rows = 6;
    const cols = 12;

    return (
        <div className="h-full flex items-start">
            <div
                className="grid gap-1 sm:gap-2"
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
                            lg:w-10 lg:h-10
                            xl:w-16 xl:h-16
                            border
                            ${
                                index === 106 || index === 107
                                    ? "bg-blue-500"
                                    : "bg-gray-200"
                            }
                        `}
                    />
                ))}
            </div>
        </div>
    );
};
