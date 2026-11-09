import { FaWhatsapp } from "react-icons/fa";
import { IoLocationSharp, IoTimeOutline } from "react-icons/io5";
import Button from "../common/Button";
import { MAPS_URL, OPENING_HOURS } from "../../data/constants";
import { getWhatsAppUrl } from "../../utils/whatsappUtils";

export default function LocationSection({ t }) {
  return (
    <section
      className="mx-auto mt-12 max-w-5xl px-4"
      id="location"
      aria-labelledby="location-title"
    >
      <div className="grid gap-5 rounded-2xl bg-primary p-6 text-start text-white md:grid-cols-[1fr_auto] md:items-center md:p-8">
        <div className="grid gap-3">
          <h2 id="location-title" className="m-0 text-2xl font-extrabold tracking-tight">
            {t.openingHours}
          </h2>
          <p className="m-0 flex items-start gap-2 text-base">
            <IoTimeOutline className="mt-0.5 h-5 w-5 flex-none text-gold" aria-hidden="true" />
            <span className="grid">
              <span>{t.days || OPENING_HOURS.days}</span>
              <strong className="font-bold tabular-nums">{t.hours || OPENING_HOURS.hours}</strong>
            </span>
          </p>
          <p className="m-0 text-sm text-white/75">{t.contactHint}</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            variant="inverse"
          >
            <IoLocationSharp className="h-4 w-4 flex-none" aria-hidden="true" />
            {t.openInMaps}
          </Button>
          <Button
            href={getWhatsAppUrl(t.generalWhatsAppMessage)}
            target="_blank"
            rel="noreferrer"
            variant="inverseOutline"
          >
            <FaWhatsapp className="h-4 w-4 flex-none" aria-hidden="true" />
            {t.whatsapp}
          </Button>
        </div>
      </div>
    </section>
  );
}
