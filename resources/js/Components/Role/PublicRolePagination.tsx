import { Link } from "@inertiajs/react";

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    links: LinkItem[];
    searchStr: string;
}

const PaginationLink = ({
    children,
    href,
    visible = true,
}: {
    children: React.ReactNode;
    href: string;
    visible?: boolean;
}) => {
    if (!visible) return null;

    return (
        <Link
            href={href}
            className="min-h-[38px] min-w-[38px] flex justify-center items-center bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 py-2 px-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
            {children}
        </Link>
    );
};

const PaginationNumber = ({
    href,
    active,
    children,
    visible = true,
}: {
    href: string;
    active: boolean;
    children: React.ReactNode;
    visible?: boolean;
}) => {
    if (!visible) return null;

    return (
        <Link
            href={href}
            className={`min-h-[38px] min-w-[38px] flex justify-center items-center py-2 px-3 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
                active
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 focus:ring-blue-500"
            }`}
        >
            {children}
        </Link>
    );
};

const ChevronLeft = () => (
    <svg
        className="shrink-0 size-3.5"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const ChevronRight = () => (
    <svg
        className="shrink-0 size-3.5"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export default function PublicRolePagination({
    currentPage,
    lastPage,
    links,
    searchStr,
}: PaginationProps) {
    return (
        <nav
            className="flex items-center gap-x-2 mt-2 mb-2 mx-auto"
            aria-label="Pagination"
        >
            <div className="flex items-center gap-x-2">
                {links.map((link, index) => (
                    <div key={index}>
                        {index === 0 ? (
                            <PaginationLink
                                href={route("roles.public", {
                                    page: currentPage - 1,
                                    search_str: searchStr,
                                })}
                                visible={!!link.url}
                            >
                                <ChevronLeft />
                                <span className="ml-1">前へ</span>
                            </PaginationLink>
                        ) : index === lastPage + 1 ? (
                            <PaginationLink
                                href={route("roles.public", {
                                    page: currentPage + 1,
                                    search_str: searchStr,
                                })}
                                visible={!!link.url}
                            >
                                <span className="mr-1">次へ</span>
                                <ChevronRight />
                            </PaginationLink>
                        ) : (
                            <PaginationNumber
                                href={route("roles.public", {
                                    page: link.label,
                                    search_str: searchStr,
                                })}
                                active={link.active}
                                visible={!!link.url}
                            >
                                <span>{link.label}</span>
                            </PaginationNumber>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );
}
