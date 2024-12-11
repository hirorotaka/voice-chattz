import { LoginButton } from "@/Components/Utils/LoginButton";
import { RegisterButton } from "@/Components/Utils/RegisterButton";
import { slides } from "@/constants/guide";
import GuestAppLayout from "@/Layouts/GuestAppLayout";
import { useState } from "react";

export default function GuestHowToUse() {
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    const nextSlide = (): void => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = (): void => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <GuestAppLayout title="使い方ガイド">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 py-2 sm:py-6 md:py-8">
                <div className="flex items-center justify-center">
                    <h1 className="text-white text-lg sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-8 md:mb-12 text-center mr-4">
                        使い方ガイド
                    </h1>

                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-900 rounded-full px-2 py-1 sm:px-4 sm:py-2">
                            <span className="text-white">
                                {currentSlide + 1} / {slides.length}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-full mx-auto">
                    <div className="bg-blue-900 rounded-lg shadow-lg">
                        {/* Fixed height container */}
                        <div className="p-6 md:p-8 h-96 sm:h-[520px] md:h-[600px]">
                            <div className="flex flex-col gap-6 h-full">
                                {/* Image section with fixed height */}
                                <div className="relative rounded-lg overflow-hidden w-full h-2/3 max-w-4xl mx-auto">
                                    <img
                                        src={slides[currentSlide].image}
                                        alt={slides[currentSlide].title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Text content with fixed height and scroll if needed */}
                                <div className="text-white max-w-4xl mx-auto w-full h-1/3 overflow-y-auto">
                                    <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4">
                                        {slides[currentSlide].title}
                                    </h2>
                                    <p className="sm:text-xs md:text-sm lg:text-base whitespace-pre-line">
                                        {slides[currentSlide].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={prevSlide}
                            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={currentSlide === 0}
                        >
                            <span className="mr-2">←</span>
                            前へ
                        </button>
                        <button
                            onClick={nextSlide}
                            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={currentSlide === slides.length - 1}
                        >
                            次へ
                            <span className="ml-2">→</span>
                        </button>
                    </div>

                    <div className="flex justify-center gap-2 mt-6">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full ${
                                    currentSlide === index
                                        ? "bg-white"
                                        : "bg-blue-800"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-4">
                <RegisterButton />
                <LoginButton />
            </div>
        </GuestAppLayout>
    );
}
