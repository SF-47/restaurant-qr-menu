import { IoAdd } from "react-icons/io5";
import { getItemCategoryKey } from "../../utils/categoryUtils";
import {
  formatPrice,
  getItemDescription,
  getItemName,
  getPrice,
  getSecondaryItemName,
} from "../../utils/menuUtils";

export default function MenuCard({ item, language = "en", quantity = 0, t, onAddToCart }) {
  const name = getItemName(item, language);
  const secondaryName = getSecondaryItemName(item, language);
  const description = getItemDescription(item, language);
  const isOffer = getItemCategoryKey(item) === "offers";
  const price = getPrice(item);
  // Follow the page direction even when the text itself is in the other language.
  const align = language === "ar" ? "right" : "left";

  return (
    <article
      className={`flex items-center gap-4 rounded-2xl border bg-white p-4 text-start ${
        isOffer ? "border-orange/40" : "border-primary/10"
      }`}
    >
      <div className="grid min-w-0 flex-1 gap-1">
        <h3 className="m-0 break-words text-base font-bold leading-snug text-charcoal" dir="auto" style={{ textAlign: align }}>
          {name}
        </h3>
        {secondaryName ? (
          <p
            className="m-0 break-words text-xs text-muted"
            lang={language === "ar" ? "en" : "ar"}
            dir={language === "ar" ? "ltr" : "rtl"}
            style={{ textAlign: align }}
          >
            {secondaryName}
          </p>
        ) : null}
        {description ? (
          <p className="m-0 line-clamp-2 text-sm leading-snug text-muted">{description}</p>
        ) : null}
        {price > 0 ? (
          <p className="m-0 mt-1 text-sm font-bold tabular-nums text-orange">{formatPrice(price)}</p>
        ) : null}
      </div>

      <button
        className={`relative inline-flex h-11 w-11 flex-none items-center justify-center rounded-full transition-[transform,background-color] duration-150 active:scale-95 ${
          quantity > 0 ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/15"
        }`}
        aria-label={`${t.addToCart}: ${name}${quantity > 0 ? ` (${quantity} ${t.inCart})` : ""}`}
        type="button"
        onClick={() => onAddToCart(item)}
      >
        <IoAdd className="h-5 w-5" aria-hidden="true" />
        {quantity > 0 ? (
          <span
            className="absolute -end-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[11px] font-bold tabular-nums text-white"
            aria-hidden="true"
          >
            {quantity}
          </span>
        ) : null}
      </button>
    </article>
  );
}
