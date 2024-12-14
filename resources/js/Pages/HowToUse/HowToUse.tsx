import { GuideSlider } from "@/Components/Slider/GuideSlider";
import { slides } from "@/constants/guide";
import AppLayout from "@/Layouts/AppLayout";
import { IsUsingRoleType, LanguageType, ThreadType } from "@/types/types";
import { useState } from "react";

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
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const nextSlide = (): void => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = (): void => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <AppLayout
            title="トップページ"
            threads={threads}
            languages={languages}
            roles={isUsingMyRoles}
        >
            <div className="container mx-auto px-1 sm:p-2 md:p-4 lg:px-6 ">
                <div className="flex items-center justify-center mb-4">
                    <h1 className="text-white text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center">
                        使い方ガイド
                    </h1>
                </div>
                <GuideSlider slides={slides} />
            </div>
        </AppLayout>
    );
}
