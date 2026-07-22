import Button from "../common/Button";
import { MAPS_URL, OPENING_HOURS } from "../../data/constants";
import { getWhatsAppUrl } from "../../utils/whatsappUtils";

export default function LocationSection({ t }) {
  return (
    <section
      className="mx-auto my-2.5 w-[min(1120px,calc(100%_-_20px))] rounded-[18px] border border-primary/15 bg-white/80 p-3.5 shadow-card"
      id="location"
      aria-labelledby="location-title"
    >
      <div className="grid gap-2.5 text-start">
        <span className="w-fit rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-primary">
          {t.readyToOrder}
        </span>
        <h2 id="location-title" className="m-0 text-2xl font-black leading-tight text-primary">
          {t.openingHours}
        </h2>
        <p className="m-0 text-[13px] text-muted">{t.contactHint}</p>
        <div className="grid gap-0.5 rounded-2xl bg-gold/15 p-3 text-primary">
          <span className="text-[13px] font-extrabold text-muted">
            {t.days || OPENING_HOURS.days}
          </span>
          <strong className="text-lg font-black">{t.hours || OPENING_HOURS.hours}</strong>
        </div>
        <div className="grid gap-2 md:grid-cols-[repeat(2,minmax(0,180px))]">
          <Button href={MAPS_URL} target="_blank" rel="noreferrer">
            {t.openInMaps}
          </Button>
          <Button href={getWhatsAppUrl(t.generalWhatsAppMessage)} target="_blank" rel="noreferrer" variant="secondary">
            {t.whatsapp}
          </Button>
        </div>
      </div>
    </section>
  );
}
