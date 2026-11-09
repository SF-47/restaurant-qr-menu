import { useEffect, useState } from "react";
import { ASSETS } from "../../data/constants";

const INTERVAL_MS = 5000;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

// All images are stacked and cross-faded, so swapping slides never reloads
// an image or shifts layout. Auto-advance is off under reduced motion.
export default function PromoSlider({ altText }) {
  const images = ASSETS.sliderImages;
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (images.length <= 1 || prefersReducedMotion()) return undefined;

    const id = setInterval(() => {
      setSlide((s) => (s + 1) % images.length);
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-primary/10 md:aspect-[21/8]">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === slide ? altText : ""}
          aria-hidden={i === slide ? undefined : true}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : undefined}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            i === slide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
