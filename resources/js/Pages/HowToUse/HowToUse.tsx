import { GuideSlider } from "@/Components/Slider/GuideSlider";
import { slides } from "@/constants/guide";
import AppLayout from "@/Layouts/AppLayout";
import { IsUsingRoleType, LanguageType, ThreadType } from "@/types/types";

interface HowToUseProps {
    threads: ThreadType[];
    languages: LanguageType[];
    isUsingMyRoles: IsUsingRoleType[];
}

export default function HowToUse({
    threads,
    languages,
    isUsingMyRoles,
}: HowToUseProps) {
    return (
        <AppLayout
            title="トップページ"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="container mx-auto px-1 sm:p-2 md:p-4 lg:px-6 ">
                <h1 className="mb-4 text-white text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                    使い方ガイド
                </h1>
                <GuideSlider slides={slides} />
            </div>
        </AppLayout>
    );
}
