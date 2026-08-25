import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type Review = {
    name: string;
    text: string;
    rating: number;
};

type StudentReviewCarouselProps = {
    items: Review[];
    autoplay?: boolean;
    interval?: number;
};

export const StudentReviewCarousel: React.FC<StudentReviewCarouselProps> = ({
    items,
    autoplay = true,
    interval = 5000,
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 1 },
            '(min-width: 1024px)': { slidesToScroll: 1 },
        },
    });

    const autoplayRef = useRef<number | null>(null);

    const stopAutoplay = useCallback(() => {
        if (autoplayRef.current) {
            window.clearInterval(autoplayRef.current);
            autoplayRef.current = null;
        }
    }, []);

    const startAutoplay = useCallback(() => {
        if (!autoplay) return;
        stopAutoplay();
        autoplayRef.current = window.setInterval(() => {
            if (emblaApi) emblaApi.scrollNext();
        }, interval);
    }, [autoplay, emblaApi, interval, stopAutoplay]);

    useEffect(() => {
        if (!emblaApi) return;
        startAutoplay();
        emblaApi.on('select', startAutoplay);
        emblaApi.on('pointerDown', stopAutoplay);

        return () => stopAutoplay();
    }, [emblaApi, startAutoplay, stopAutoplay]);

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            setCanScrollPrev(emblaApi.canScrollPrev());
            setCanScrollNext(emblaApi.canScrollNext());
        };
        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi]);

    return (
        <div className="relative group">
            <div className="overflow-hidden p-2 -m-2" ref={emblaRef}>
                <div className="flex touch-pan-y ml-[calc(1rem*-1)] items-stretch">
                    {items.map((review, i) => (
                        <div
                            key={i}
                            className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4"
                        >
                            <div className="bg-white p-8 rounded-xl shadow-sm relative hover:shadow-md transition-all h-full flex flex-col">
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, starIdx) => (
                                        <Star
                                            key={starIdx}
                                            className={`w-4 h-4 ${starIdx < review.rating ? 'text-secondary fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed text-base flex-grow">"{review.text}"</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-primary shrink-0">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{review.name}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hidden md:flex rounded-full bg-white shadow-md border-gray-200 hover:bg-gray-100 hover:text-primary"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden md:flex rounded-full bg-white shadow-md border-gray-200 hover:bg-gray-100 hover:text-primary"
                onClick={scrollNext}
                disabled={!canScrollNext}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};
