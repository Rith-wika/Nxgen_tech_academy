import { useState, useEffect, RefObject } from "react";
import { useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

/**
 * Custom hook to create a synced sticky parallax effect for sidebars.
 * The sidebar will scroll at a rate that ensures it hits the bottom
 * of its container exactly when the container scrolls out of view.
 */
export const useStickyParallax = (
    containerRef: RefObject<HTMLElement>,
    sidebarRef: RefObject<HTMLElement>,
) => {
    const [dimensions, setDimensions] = useState({ containerHeight: 0, sidebarHeight: 0, isDesktop: true });

    useEffect(() => {
        const measure = () => {
            if (containerRef.current && sidebarRef.current) {
                setDimensions({
                    containerHeight: containerRef.current.offsetHeight,
                    sidebarHeight: sidebarRef.current.offsetHeight,
                    isDesktop: window.innerWidth >= 1024
                });
            }
        };

        // Initial measure
        measure();

        // Re-measure on resize or content changes
        const observer = new ResizeObserver(measure);
        if (containerRef.current) observer.observe(containerRef.current);
        if (sidebarRef.current) observer.observe(sidebarRef.current);

        window.addEventListener("resize", measure);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [containerRef, sidebarRef]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Calculate how much the sidebar needs to travel
    const travelDistance = Math.max(0, dimensions.containerHeight - dimensions.sidebarHeight);

    // Create a smooth transform, disable on mobile (since items are stacked, not side-by-side)
    const yRange = useTransform(scrollYProgress, [0, 1], [0, dimensions.isDesktop ? travelDistance : 0]);

    // Add tighter spring physics to reduce 'swinging' and make it feel more direct
    const smoothY = useSpring(yRange, {
        stiffness: 300,
        damping: 50,
        mass: 0.5,
        restDelta: 0.001
    });

    return smoothY;
};
