import { useState } from "react";

interface TruncatedTextProps {
    text: string;
    maxLength: number;
    className?: string;
}

const TruncatedText = ({ text, maxLength, className }: TruncatedTextProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    if (!text) return null;

    if (text.length <= maxLength) {
        return <span className={className}>{text}</span>;
    }

    return (
        <div className={className}>
            {isExpanded ? (
                <span>
                    {text}
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="ml-2 text-blue-500 font-medium hover:text-blue-700"
                    >
                        隠す
                    </button>
                </span>
            ) : (
                <span>
                    {text.slice(0, maxLength)}
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="ml-1 text-blue-500 font-medium hover:text-blue-700"
                    >
                        ...続きを表示
                    </button>
                </span>
            )}
        </div>
    );
};

export default TruncatedText;
