import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { ASSETS, BRAND_NAME, INSTAGRAM_URL, MAPS_URL } from "../../data/constants";
import { getWhatsAppUrl } from "../../utils/whatsappUtils";
import CartButton from "../cart/CartButton";

export default function Header({
  language,
  onLanguageChange,
  t,
  cartCount = 0,
  onOpenCart,
}) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-primary/10 bg-cream/95 px-3 py-2 backdrop-blur md:mx-auto md:w-[min(1120px,calc(100%_-_28px))] md:rounded-b-[18px] md:border-x md:px-4"
      id="home"
    >
      <div className="mx-auto grid w-full max-w-[1120px] gap-2">
        <div className="flex min-w-0 items-center justify-between gap-2">
          <a
            className="flex min-w-0 items-center gap-2 font-black text-primary no-underline"
            href="#home"
            aria-label={`${BRAND_NAME} home`}
          >
            <img
              src={ASSETS.logo}
              alt={`${BRAND_NAME} logo`}
              className="h-9 w-9 flex-none rounded-full object-cover shadow-soft sm:h-10 sm:w-10"
            />
            <span className="min-w-0 truncate whitespace-nowrap text-[18px] leading-none sm:text-xl">
              {t.brandName}
            </span>
          </a>

          <CartButton
            count={cartCount}
            onClick={onOpenCart}
            t={t}
            variant="icon"
          />
        </div>

        <div className="flex min-w-0 items-center gap-1.5">
          <div
            className="inline-flex flex-none overflow-hidden rounded-full border border-primary/15 bg-white shadow-sm"
            aria-label="Language"
          >
            <button
              className={`min-h-8 min-w-9 px-2 text-[11px] font-black text-primary transition ${
                language === "en" ? "bg-primary/10 text-orange" : ""
              }`}
              type="button"
              onClick={() => onLanguageChange("en")}
              aria-pressed={language === "en"}
            >
              EN
            </button>
            <button
              className={`min-h-8 min-w-[50px] px-2 text-[11px] font-black text-primary transition ${
                language === "ar" ? "bg-primary/10 text-orange" : ""
              }`}
              type="button"
              onClick={() => onLanguageChange("ar")}
              aria-pressed={language === "ar"}
            >
              عربي
            </button>
          </div>

          <div className="ms-auto flex flex-none items-center justify-end gap-1.5">
            <a
              className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-pink-200 bg-white text-pink-700 no-underline shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange sm:h-9 sm:w-9"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={t.instagram}
            >
              <FaInstagram className="h-4 w-4 flex-none sm:h-5 sm:w-5" aria-hidden="true" />
            </a>
            <a
              className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal text-white no-underline shadow-soft focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange sm:h-9 sm:w-9"
              href={getWhatsAppUrl(t.generalWhatsAppMessage)}
              target="_blank"
              rel="noreferrer"
              aria-label={t.whatsapp}
            >
              <FaWhatsapp className="h-4 w-4 flex-none sm:h-5 sm:w-5" aria-hidden="true" />
            </a>
            <a
              className="inline-flex min-h-8 flex-none items-center justify-center gap-1 rounded-full border border-primary/15 bg-white px-2.5 py-1 text-[11px] font-black text-primary no-underline shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange sm:min-h-9 sm:px-3 sm:text-xs"
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={t.location}
            >
              <IoLocationSharp className="h-4 w-4 flex-none" aria-hidden="true" />
              <span>{t.location}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
