import AppLayout from "@/Layouts/AppLayout";
import { LearningGrid } from "@/Components/LearningGrid";
import { LanguageType, RoleType, ThreadType } from "@/types/types";

interface TopProps {
    threads: ThreadType[];
    languages: LanguageType[];
    roles: RoleType[];
}

export default function Top({ threads, languages, roles }: TopProps) {
    return (
        <AppLayout
            title="Top"
            threads={threads}
            languages={languages}
            roles={roles}
        >
            <div className="h-full flex flex-col">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white">
                    英会話学習記録
                </h2>
                <div className="flex-1 overflow-x-auto">
                    <LearningGrid />
                </div>
            </div>
        </AppLayout>
    );
}
