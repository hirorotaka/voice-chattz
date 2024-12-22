// Components/Slider/GuideSlider.tsx
import { useState } from "react";
import { SlideType } from "@/types/types";

interface GuideSliderProps {
    slides: SlideType[];
}

export const GuideSlider = ({ slides }: GuideSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(true);

    const currentSlide = slides[currentIndex];
    const isFirstSlide = currentIndex === 0;
    const isLastSlide = currentIndex === slides.length - 1;

    const handleNext = () => {
        setImageLoaded(false);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setImageLoaded(false);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="max-w-4xl h-[430px] sm:h-[550px] md:h-[730px]">
            <div className="bg-blue-900 rounded-lg shadow-lg p-2 h-full">
                <div className="flex flex-col gap-3 h-full">
                    {/* Image Display */}
                    <div className="relative rounded-lg overflow-hidden flex-1">
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-start bg-blue-900/50">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white ml-4" />
                            </div>
                        )}
                        <picture className="h-full block">
                            <source
                                srcSet={currentSlide.image.webp}
                                type="image/webp"
                            />
                            <img
                                src={currentSlide.image.fallback}
                                alt={currentSlide.title}
                                className={`h-full object-contain transition-opacity duration-300 ${
                                    imageLoaded ? "opacity-100" : "opacity-0"
                                }`}
                                onLoad={() => setImageLoaded(true)}
                            />
                        </picture>
                    </div>

                    {/* Content */}
                    <div className="text-white w-full overflow-y-auto px-4">
                        <div className="flex flex-col items-start">
                            <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4">
                                {currentSlide.title}
                            </h2>
                            <p className="sm:mt-3 text-xs sm:text-sm md:text-sm lg:text-base whitespace-pre-line text-slate-300">
                                {currentSlide.description}
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mt-auto">
                        <button
                            onClick={handlePrev}
                            disabled={isFirstSlide}
                            className="px-4 py-2 bg-indigo-950 text-white rounded-lg hover:bg-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            <span className="mr-2">←</span>前へ
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isLastSlide}
                            className="px-4 py-2 bg-indigo-950 text-white rounded-lg hover:bg-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            次へ<span className="ml-2">→</span>
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 py-4">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full ${
                                    currentIndex === index
                                        ? "bg-white"
                                        : "bg-blue-800"
                                }`}
                                aria-label={`スライド ${index + 1}へ移動`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // return (
    //     <div className="max-w-4xl h-[400px] sm:h-[520px] md:h-[630px]">
    //         <div className="bg-blue-900 rounded-lg shadow-lg p-2 h-full">
    //             <div className="flex flex-col gap-3 h-full">
    //                 {/* Image Display */}
    //                 <div className="relative rounded-lg overflow-hidden w-full flex-1">
    //                     {!imageLoaded && (
    //                         <div className="absolute inset-0 flex items-center justify-center bg-blue-900/50">
    //                             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
    //                         </div>
    //                     )}
    //                     <picture className="h-full block">
    //                         <source
    //                             srcSet={currentSlide.image.webp}
    //                             type="image/webp"
    //                         />
    //                         <img
    //                             src={currentSlide.image.fallback}
    //                             alt={currentSlide.title}
    //                             className={`w-full h-full object-contain transition-opacity duration-300 ${
    //                                 imageLoaded ? "opacity-100" : "opacity-0"
    //                             }`}
    //                             onLoad={() => setImageLoaded(true)}
    //                         />
    //                     </picture>
    //                 </div>
    //                 {/* Content */}
    //                 <div className="text-white w-full overflow-y-auto">
    //                     <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4">
    //                         {currentSlide.title}
    //                     </h2>
    //                     <p className="sm:mt-3 text-xs sm:text-sm md:text-sm lg:text-base whitespace-pre-line text-slate-300">
    //                         {currentSlide.description}
    //                     </p>
    //                 </div>

    //                 {/* Navigation */}
    //                 <div className="flex justify-center gap-4 mt-auto">
    //                     <button
    //                         onClick={handlePrev}
    //                         disabled={isFirstSlide}
    //                         className="px-4 py-2 bg-indigo-950 text-white rounded-lg hover:bg-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
    //                     >
    //                         <span className="mr-2">←</span>前へ
    //                     </button>
    //                     <button
    //                         onClick={handleNext}
    //                         disabled={isLastSlide}
    //                         className="px-4 py-2 bg-indigo-950 text-white rounded-lg hover:bg-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
    //                     >
    //                         次へ<span className="ml-2">→</span>
    //                     </button>
    //                 </div>

    //                 {/* Dots */}
    //                 <div className="flex justify-center gap-2 py-4">
    //                     {slides.map((_, index) => (
    //                         <button
    //                             key={index}
    //                             onClick={() => setCurrentIndex(index)}
    //                             className={`w-3 h-3 rounded-full ${
    //                                 currentIndex === index
    //                                     ? "bg-white"
    //                                     : "bg-blue-800"
    //                             }`}
    //                             aria-label={`スライド ${index + 1}へ移動`}
    //                         />
    //                     ))}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};
