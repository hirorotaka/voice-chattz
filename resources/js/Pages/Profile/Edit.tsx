import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { IsUsingRoleType, LanguageType, ThreadType } from "@/types/types";
import AppLayout from "@/Layouts/AppLayout";

interface UserEtitProps {
    threads: ThreadType[];
    languages: LanguageType[];
    isUsingMyRoles: IsUsingRoleType[];
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Edit({
    mustVerifyEmail,
    status,
    threads,
    languages,
    isUsingMyRoles,
}: UserEtitProps) {
    return (
        <>
            <AppLayout
                title="プロフィール編集"
                threads={threads}
                languages={languages}
                roles={isUsingMyRoles}
            >
                <div className="px-4 py-12">
                    <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                        <div className="bg-white p-4 shadow rounded sm:rounded-lg sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
