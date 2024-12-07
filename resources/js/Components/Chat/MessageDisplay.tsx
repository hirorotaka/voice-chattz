import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import type { Options } from "react-markdown";
import { Highlight, themes } from "prism-react-renderer";

type ComponentPropsType = {
    children?: React.ReactNode;
    className?: string;
    inline?: boolean;
} & React.HTMLAttributes<HTMLElement>;

const MessageDisplay = ({ content }: { content: string }) => {
    const components: Options["components"] = {
        code({ inline, className, children, ...props }: ComponentPropsType) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const escapedContent =
                typeof children === "string"
                    ? children.replace(/`/g, "\\`")
                    : children;

            if (inline) {
                return (
                    <code
                        className="px-1.5 py-0.5 bg-gray-200 rounded text-sm"
                        {...props}
                    >
                        {escapedContent}
                    </code>
                );
            }

            return (
                <Highlight
                    theme={themes.nightOwl}
                    code={String(children).replace(/\n$/, "")}
                    language={language || "text"}
                >
                    {({
                        className,
                        style,
                        tokens,
                        getLineProps,
                        getTokenProps,
                    }) => (
                        <pre
                            className={`p-4 my-4 rounded-lg overflow-x-auto ${className}`}
                            style={style}
                        >
                            {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                    <span className="inline-block w-8 text-gray-500 text-right mr-4">
                                        {i + 1}
                                    </span>
                                    {line.map((token, key) => (
                                        <span
                                            key={key}
                                            {...getTokenProps({ token })}
                                        />
                                    ))}
                                </div>
                            ))}
                        </pre>
                    )}
                </Highlight>
            );
        },
        // 見出し
        h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>
        ),
        // リスト
        ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>
        ),
        ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>
        ),
        li: ({ children }) => <li className="mb-1">{children}</li>,
        // 段落
        p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
        // 強調
        strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        // リンク
        a: ({ children, href }) => (
            <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        ),
        // 区切り線
        hr: () => <hr className="my-6 border-t border-gray-300" />,
        // 引用
        blockquote: ({ children }) => (
            <blockquote className="pl-4 border-l-4 border-gray-300 my-4 italic">
                {children}
            </blockquote>
        ),
        // テーブル
        table: ({ children }) => (
            <div className="overflow-x-auto my-4">
                <table className="min-w-full table-auto border-collapse">
                    {children}
                </table>
            </div>
        ),
        thead: ({ children }) => (
            <thead className="bg-gray-100">{children}</thead>
        ),
        th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2">{children}</td>
        ),
        tr: ({ children }) => <tr className="hover:bg-gray-50">{children}</tr>,
    };

    return (
        <Markdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
        </Markdown>
    );
};

export default MessageDisplay;
