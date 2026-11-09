import PromoSlider from "./PromoSlider";

export default function HeroSection({ t }) {
  return (
    <section className="mx-auto grid max-w-5xl gap-4 px-4 pt-4" aria-labelledby="hero-title">
      <PromoSlider altText={t.featuredAlt} />
      <div className="grid gap-1 text-start">
        <h1 id="hero-title" className="m-0 text-3xl font-extrabold tracking-tight text-charcoal md:text-4xl">
          {t.tagline}
        </h1>
        <p className="m-0 text-sm text-muted md:text-base">{t.promoText}</p>
      </div>
    </section>
  );
}
