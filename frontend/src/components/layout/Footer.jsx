import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BRAND_NAME, INSTAGRAM_URL, MAPS_URL } from "../../data/constants";
import { getWhatsAppUrl } from "../../utils/whatsappUtils";

export default function Footer({ t }) {
  return (
    <footer className="mx-auto mb-0 mt-2.5 grid w-[min(1120px,calc(100%_-_20px))] gap-2.5 rounded-[18px] border border-primary/15 bg-white/80 p-3.5 text-start shadow-card md:grid-cols-[1fr_auto_auto] md:items-center">
      <div>
        <strong className="text-lg font-black text-primary">{t.brandName || BRAND_NAME}</strong>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <a className="inline-flex items-center gap-1 text-[13px] font-extrabold text-primary no-underline hover:text-orange" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          <FaInstagram className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
          {t.instagram}
        </a>
        <a className="inline-flex items-center gap-1 text-[13px] font-extrabold text-primary no-underline hover:text-orange" href={MAPS_URL} target="_blank" rel="noreferrer">
          <FaMapMarkerAlt className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
          {t.maps}
        </a>
        <a className="inline-flex items-center gap-1 text-[13px] font-extrabold text-primary no-underline hover:text-orange" href={getWhatsAppUrl(t.generalWhatsAppMessage)} target="_blank" rel="noreferrer">
          <FaWhatsapp className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
          {t.whatsapp}
        </a>
      </div>
      <p className="m-0 text-xs text-muted">&copy; 2026 Shawarma Story.</p>
    </footer>
  );
}
