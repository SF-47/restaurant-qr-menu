import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { BRAND_NAME, INSTAGRAM_URL, MAPS_URL } from "../../data/constants";
import { getWhatsAppUrl } from "../../utils/whatsappUtils";

const LINK =
  "inline-flex min-h-10 items-center gap-1.5 text-sm font-bold text-primary no-underline hover:text-orange";

export default function Footer({ t }) {
  const brandName = t.brandName || BRAND_NAME;

  return (
    <footer className="mx-auto mt-12 flex max-w-5xl flex-col gap-3 border-t border-primary/10 px-4 py-6 text-start md:flex-row md:items-center md:justify-between">
      <nav className="flex flex-wrap gap-x-5" aria-label={brandName}>
        <a className={LINK} href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
          <FaInstagram className="h-4 w-4 flex-none" aria-hidden="true" />
          {t.instagram}
        </a>
        <a className={LINK} href={MAPS_URL} target="_blank" rel="noreferrer">
          <IoLocationSharp className="h-4 w-4 flex-none" aria-hidden="true" />
          {t.maps}
        </a>
        <a className={LINK} href={getWhatsAppUrl(t.generalWhatsAppMessage)} target="_blank" rel="noreferrer">
          <FaWhatsapp className="h-4 w-4 flex-none" aria-hidden="true" />
          {t.whatsapp}
        </a>
      </nav>
      <p className="m-0 text-xs text-muted">
        &copy; {new Date().getFullYear()} {brandName}
      </p>
    </footer>
  );
}
