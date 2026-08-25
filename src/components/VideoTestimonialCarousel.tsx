import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiteYouTube } from "@/components/LiteYouTube";

type Video = {
    id: string;
    youtubeId: string;
    title: string;
};

type VideoTestimonialCarouselProps = {
    items: Video[];
    autoplay?: boolean;
    interval?: number;
};

export const VideoTestimonialCarousel: React.FC<VideoTestimonialCarouselProps> = ({
    items,
    autoplay = true,
    interval = 4000,
}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
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
                <div className="flex touch-pan-y ml-[calc(1rem*-1)]">
                    {items.map((video) => (
                        <div
                            key={video.id}
                            className="flex-[0_0_50%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 pl-4"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 border border-gray-100">
                                <div className="relative aspect-[9/16] bg-black">
                                    <LiteYouTube youtubeId={video.youtubeId} title={video.title} />
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
