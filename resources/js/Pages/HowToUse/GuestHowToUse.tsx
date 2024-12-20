// Pages/GuestHowToUse.tsx
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import { GuideSlider } from "@/Components/Slider/GuideSlider";
import { slides } from "@/constants/guide";

export default function GuestHowToUse() {
    return (
        <GuestAppLayout title="使い方ガイド">
            <div className="container mx-auto px-1 sm:p-2 md:p-4 lg:px-6 ">
                <h1 className="mb-4 text-white text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                    使い方ガイド
                </h1>
                <GuideSlider slides={slides} />
            </div>
        </GuestAppLayout>
    );
}
