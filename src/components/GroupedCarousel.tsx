import React, { useEffect, useMemo, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';

type Slide = {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string;
  name?: string;
  role?: string;
};

type CarouselProps = {
  slides: Slide[];
  loop?: boolean;
  autoplay?: boolean;
  interval?: number;
  className?: string;
  cardsPerView?: number;
};

export const GroupedCarousel: React.FC<CarouselProps> = ({
  slides,
  loop = true,
  autoplay = true,
  interval = 4000,
  className = '',
  cardsPerView = 3
}) => {
  // For testimonials (3 per view), we need to group slides into sets of 3
  const groupedSlides = useMemo(() => {
    if (cardsPerView === 1) return slides.map(slide => [slide]);
    const groups = [];
    for (let i = 0; i < slides.length; i += cardsPerView) {
      groups.push(slides.slice(i, i + cardsPerView));
    }
    return groups;
  }, [slides, cardsPerView]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align: 'start',
  });

  const [selected, setSelected] = useState(0);
  const autoplayRef = useRef<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      try {
        emblaApi.off('select', onSelect as any);
      } catch {
        // Ignore listener cleanup failures during fast unmount/remount.
      }
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !autoplay) return;

    const play = () => {
      try {
        emblaApi.scrollNext();
      } catch {
        // Ignore autoplay edge-case failures when carousel is not ready.
      }
    };

    autoplayRef.current = window.setInterval(play, interval);

    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [emblaApi, autoplay, interval]);

  const goTo = (index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden" ref={emblaRef as any}>
        <div className="flex">
          {groupedSlides.map((group, groupIndex) => (
            <div key={groupIndex} className="min-w-full flex-shrink-0 px-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {group.map((slide, i) => (
                  <div key={slide.id ?? i} className="bg-card rounded-xl shadow-lg relative group hover:-translate-y-2 transition-all duration-300">
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="p-8"
                    >
                      {/* Quote Icon Background */}
                      <div className="absolute top-4 right-4 text-primary/10">
                        <svg className="w-12 h-12 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>

                      <div className="relative">
                        {slide.image && (
                          <div className="flex items-center gap-4 mb-6">
                            <div className="relative">
                              <img
                                src={slide.image}
                                alt={slide.title || slide.name || 'slide'}
                                className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/10"
                              />
                              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <div>
                              {slide.name && <p className="font-semibold text-lg">{slide.name}</p>}
                              {slide.role && <p className="text-sm text-muted-foreground">{slide.role}</p>}
                            </div>
                          </div>
                        )}

                        <div>
                          {slide.description && (
                            <p className="text-muted-foreground leading-relaxed">
                              {slide.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {groupedSlides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide group ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${selected === i ? 'bg-primary' : 'bg-muted-foreground/40'}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
};