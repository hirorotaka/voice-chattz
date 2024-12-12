// Pages/GuestHowToUse.tsx
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import { GuideSlider } from "@/Components/Slider/GuideSlider";
import { slides } from "@/constants/guide";

export default function GuestHowToUse() {
    return (
        <GuestAppLayout title="使い方ガイド">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 py-2 sm:py-6 md:py-8">
                <div className="flex items-center justify-center mb-8">
                    <h1 className="text-white text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center">
                        使い方ガイド
                    </h1>
                </div>
                <GuideSlider slides={slides} />
            </div>
        </GuestAppLayout>
    );
}
