import React, { useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
//For checking git status
type Slide = {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string;
  name?: string;
  role?: string;
};

export const AnimatedCarousel: React.FC<{
  slides: Slide[];
  loop?: boolean;
  autoplay?: boolean;
  interval?: number;
  className?: string;
}> = ({ slides, loop = true, autoplay = true, interval = 4000, className = '' }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop });
  const [selected, setSelected] = useState(0);
  const autoplayRef = useRef<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    // attach listener
    emblaApi.on('select', onSelect);
    onSelect();
    // cleanup listener safely
    return () => {
      try {
        emblaApi.off('select', onSelect as any);
      } catch (e) {
        // ignore cleanup errors
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
        <div className="flex gap-6">
          {slides.map((slide, i) => (
            <div key={slide.id ?? i} className="min-w-full flex-shrink-0 px-2">
              <div className="p-6 bg-card rounded-xl shadow-lg">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6 }}
                >
                  {slide.image && (
                    <div className="rounded-md overflow-hidden mb-4 h-40 w-full">
                      <img src={slide.image} alt={slide.title || slide.name || 'slide'} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div>
                    {slide.title && <h3 className="text-xl font-semibold mb-2">{slide.title}</h3>}
                    {slide.name && <p className="text-lg font-medium mb-1">{slide.name}</p>}
                    {slide.role && <p className="text-sm text-muted-foreground mb-2">{slide.role}</p>}
                    {slide.description && <p className="text-muted-foreground">{slide.description}</p>}
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${selected === i ? 'bg-primary' : 'bg-muted-foreground/40'}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
};
