import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { FaWhatsapp } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  { src: '/hero-bg-4.png', link: 'https://docs.google.com/forms/d/e/1FAIpQLSdXT8Mx2S5-wBwOrevQ_09OYcvV0oYFFHznNrYg_5RQQ9OBrw/viewform?usp=publish-editor' },
  { src: '/hero-bg-3.png' },
  { src: '/hero-bg-1.jpeg' },
  { src: '/hero-bg-2.jpeg' }
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Images */}
        <div className="absolute inset-0 -z-10">
          {HERO_IMAGES.map((image, index) => {
            const content = (
              <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{
                  backgroundImage: `url('${image.src}')`,
                }}
              />
            );

            return (
              <div key={index}>
                {image.link ? (
                  <a href={image.link} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* intentionally leave the hero image area empty of text; content appears below */}
        <div className="relative z-10" />
      </section>

      {/* New content section placed after the hero image
          - Left: main heading
          - Right: paragraph + buttons
          - Uses bg-muted and responsive flex layout */}
      <section className="py-8 bg-background -z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div className="w-full md:w-1/2" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Become Industry-Ready in SAP, Data
                <br />
                <span className="text-accent">& Full-Stack in 8–16 Weeks</span>
              </h1>
            </motion.div>

            <motion.div className="w-full md:w-1/2 p-6 rounded-lg" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="bg-background p-6 rounded-lg">
                <p className="text-lg text-muted-foreground mb-6">
                  Live mentorship • Real client projects • Placement support.
                  Transform your career with industry-aligned tech education.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() =>
                      window.open(
                        'https://forms.gle/nLXYmZAERof9g77V7',
                        '_blank'
                      )
                    }
                  >
                    Apply Now
                  </Button>

                  <Button variant="outline-primary" size="lg" className=" hover:bg-white hover:text-accent">
                    Download Brochure
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          {/* WhatsApp quick chat button */}
          <a
            aria-label="Chat on WhatsApp"
            href={`https://wa.me/916309782855?text=${encodeURIComponent("Hi, I'm interested in courses at NxGen Tech Academy")}`}
            target="_blank"
            rel="noreferrer noopener"
            className="fixed right-6 bottom-28 z-10 bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:h-16 hover:w-16 hover:shadow-2xl"
          >
            <FaWhatsapp className="w-8 h-8" />
          </a>
        </div>
      </section>
    </>
  );
};

