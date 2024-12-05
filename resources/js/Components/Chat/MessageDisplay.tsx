import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";

type ComponentPropsType = {
    children?: React.ReactNode;
    className?: string;
} & React.HTMLAttributes<HTMLElement>;

const MessageDisplay = ({ content }: { content: string }) => {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
                code: function Code({
                    className,
                    children,
                    ...props
                }: ComponentPropsType) {
                    return (
                        <code
                            className={`block p-4 my-4 bg-gray-300 rounded-lg overflow-x-auto ${
                                className || ""
                            }`}
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
            }}
        >
            {content}
        </Markdown>
    );
};

export default MessageDisplay;
