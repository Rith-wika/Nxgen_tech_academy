import { useState } from "react";

interface LiteYouTubeProps {
  youtubeId: string;
  title: string;
  className?: string;
}

/**
 * Renders a YouTube thumbnail + play button instead of the actual iframe.
 * The real embed (and all of YouTube's player JS) only loads after the user
 * clicks - avoids shipping ~1MB+ of iframe/player weight per video on initial
 * page load for videos most visitors never press play on.
 */
export const LiteYouTube = ({ youtubeId, title, className = "" }: LiteYouTubeProps) => {
  const [activated, setActivated] = useState(false);

  if (activated) {
    return (
      <iframe
        className={`absolute inset-0 w-full h-full ${className}`}
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
        title={title || "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={title ? `Play video: ${title}` : "Play video"}
      className={`absolute inset-0 w-full h-full group/play cursor-pointer ${className}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt={title || "Video thumbnail"}
        loading="lazy"
        decoding="async"
        width={480}
        height={360}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/play:bg-black/30 transition-colors">
        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-lg group-hover/play:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600 translate-x-0.5" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
};
