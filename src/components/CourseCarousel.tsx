import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Course = {
    title: string;
    duration?: string;
    hours?: string;
    link: string;
    image?: string;
};

// All 'course' type images used with this component have a pre-generated
// WebP sibling (see gen-webp.cjs); swapping the extension lets modern
// browsers download the smaller WebP while older ones keep the <img> fallback.
const toWebp = (src: string) => src.replace(/\.(jpe?g|png)$/i, '.webp');

type CarouselProps = {
    items: Course[];
    loop?: boolean;
    autoplay?: boolean;
    interval?: number;
    className?: string;
    cardsPerView?: number;
    type?: 'course' | 'category';
};

export const CourseCarousel: React.FC<CarouselProps> = ({
    items,
    loop = true,
    autoplay = true,
    interval = 4000,
    className = '',
    cardsPerView = 4,
    type = 'course'
}) => {
    // Mobile responsive cardsPerView
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop,
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 1 } 
        }
    });

    // Auto-play logic
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
        emblaApi.on('select', startAutoplay); // Reset timer on interaction
        emblaApi.on('pointerDown', stopAutoplay);

        return () => stopAutoplay();
    }, [emblaApi, startAutoplay, stopAutoplay]);


    // Navigation
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
        <div className={`relative group ${className}`}>
            <div className="overflow-hidden p-2 -m-2" ref={emblaRef}>
                <div className="flex touch-pan-y ml-[calc(1rem*-1)]">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4"
                        >
                            {type === 'course' ? (
                                <Link to={item.link} className="block h-full group/card transition-transform duration-300">
                                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-[transform,box-shadow] duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                                        <div className="h-40 bg-gray-100 relative overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <picture>
                                                    <source type="image/webp" srcSet={toWebp(item.image)} />
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        width={400}
                                                        height={160}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                                    />
                                                </picture>
                                            ) : (
                                                <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                                                    <span className="text-gray-400 font-bold text-lg px-4 text-center">NxGen</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-gray-900 font-bold text-lg mb-3 leading-tight group-hover/card:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="mt-auto pt-4 border-t border-gray-50">
                                                <p className="text-gray-500 text-sm flex items-center gap-2">
                                                    {item.duration ? <Clock className="w-4 h-4 text-secondary" /> : <span className="w-2 h-2 rounded-full bg-secondary"></span>}
                                                    {item.duration || item.hours}
                                                </p>
                                                <div className="mt-3 text-primary font-bold text-sm flex items-center gap-1 group-hover/card:gap-2 transition-[gap]">
                                                    Read More <ArrowRight className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                // Category card style
                                <Link to={item.link} className="block h-full group/card">
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-[transform,box-shadow] duration-300 h-full flex flex-col">
                                        <div className="h-40 bg-gray-200 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    width={400}
                                                    height={160}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#000080] opacity-80"></div>
                                            )}
                                            <span className="relative text-white font-bold text-xl px-4 text-center drop-shadow-md">{item.title}</span>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                                {item.hours || item.duration}
                                            </p>
                                            <div className="text-primary font-bold flex items-center gap-2 group-hover/card:gap-4 transition-[gap]">
                                                Read More <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons - Visible on Desktop or when needed */}
            <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hidden md:flex rounded-full bg-white shadow-md border-gray-200 hover:bg-gray-100 hover:text-primary disabled:opacity-0"
                onClick={scrollPrev}
                disabled={!canScrollPrev && !loop}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 hidden md:flex rounded-full bg-white shadow-md border-gray-200 hover:bg-gray-100 hover:text-primary disabled:opacity-0"
                onClick={scrollNext}
                disabled={!canScrollNext && !loop}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

        </div>
    );
};
