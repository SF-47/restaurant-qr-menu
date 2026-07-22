import restaurantConfig from "../../config/restaurantConfig";
import PromoSlider from "./PromoSlider";

export default function HeroSection({ t }) {
  return (
    <section
      className="mx-auto my-2.5 grid w-[min(1120px,calc(100%_-_20px))] grid-cols-1 gap-2"
      aria-label={`${restaurantConfig.name.en} featured photos`}
    >
      <PromoSlider altText={t.featuredAlt} />
    </section>
  );
}
