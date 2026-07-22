import { useEffect, useState } from "react";
import { ASSETS, BRAND_NAME } from "../../data/constants";
import restaurantConfig from "../../config/restaurantConfig";

export default function PromoSlider({
  altText = restaurantConfig.marketing.featuredAlt.en,
}) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (ASSETS.sliderImages.length <= 1) return undefined;

    const id = setInterval(() => {
      setSlide((s) => (s + 1) % ASSETS.sliderImages.length);
    }, 2600);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden rounded-[18px] border border-primary/15 bg-cream-soft shadow-card" aria-label={`${BRAND_NAME} food photos`}>
      <div className="h-52 overflow-hidden sm:h-32 md:h-40">
        <img
          className="block h-full w-full object-cover"
          src={ASSETS.sliderImages[slide]}
          alt={altText}
        />
      </div>
    </div>
  );
}
