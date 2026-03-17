import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import React from "react";

interface PageHeroProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const PageHero = ({
  title,
  description,
  children
}: PageHeroProps) => {
  const { ref: heroRef, isVisible: isHeroVisible } = useScrollAnimation(0);

  return (
    <div className="bg-[#000080] py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-10 top-10 w-32 h-32 rounded-full border-8 border-white"></div>
        <div className="absolute left-[-50px] bottom-[-50px] w-64 h-64 bg-white rounded-full blur-3xl opacity-20"></div>
      </div>

      <div
        ref={heroRef}
        className={`container mx-auto px-4 relative z-10 transition-all duration-700 text-center flex flex-col items-center ${isHeroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl mb-6 mx-auto">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};