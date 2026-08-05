import { getItemCategoryKey, getItemCategoryLabel } from "../../utils/categoryUtils";
import {
  formatPrice,
  getItemDescription,
  getItemName,
  getPrice,
  getSecondaryItemName,
} from "../../utils/menuUtils";

export default function MenuCard({
  item,
  featured = false,
  language = "en",
  t,
  onAddToCart,
}) {
  const name = getItemName(item, language);
  const secondaryName = getSecondaryItemName(item, language);
  const description = getItemDescription(item, language);
  const categoryLabel = getItemCategoryLabel(item, language);
  const isOffer = getItemCategoryKey(item) === "offers";
  const price = getPrice(item);

  return (
    <article
      className={`relative grid gap-2 overflow-hidden rounded-2xl p-3 text-start shadow-soft before:absolute before:inset-y-0 before:left-0 before:w-1 sm:p-3.5 rtl:before:left-auto rtl:before:right-0 ${
        isOffer
          ? "border border-orange/25 bg-gradient-to-b from-gold/20 to-white before:bg-gradient-to-b before:from-orange before:to-gold ring-1 ring-gold/20"
          : "border border-primary/10 bg-white before:bg-gradient-to-b before:from-gold before:to-orange"
      } ${
        featured && !isOffer ? "bg-gradient-to-b from-white to-cream-soft" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`max-w-[58%] break-words rounded-full px-2 py-0.5 text-[10px] font-black sm:text-[11px] ${
            isOffer ? "bg-orange/15 text-orange" : "bg-teal/10 text-primary"
          }`}
        >
          {isOffer ? "★ " : ""}{categoryLabel || t.menu}
        </span>
        {price > 0 ? (
          <span className="whitespace-nowrap text-base font-black leading-none text-orange">
            {formatPrice(price)}
          </span>
        ) : null}
      </div>

      <div className="grid gap-0.5">
        <h3 className="m-0 break-words text-[17px] font-black leading-tight text-charcoal sm:text-lg">
          {name}
        </h3>
        {secondaryName ? (
          <p
            className={`m-0 hidden break-words text-xs font-semibold leading-snug text-muted sm:block ${
              language === "ar" ? "text-left [direction:ltr]" : "text-right [direction:rtl]"
            }`}
          >
            {secondaryName}
          </p>
        ) : null}
      </div>

      {description ? (
        <p className="m-0 text-xs leading-snug text-muted sm:text-[13px]">{description}</p>
      ) : null}

      <button
        className="inline-flex min-h-9 w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal px-3 py-1.5 text-[13px] font-black text-white shadow-soft"
        aria-label={`${t.orderThisItem}: ${name}`}
        type="button"
        onClick={() => onAddToCart(item)}
      >
        {t.addToCart}
      </button>
    </article>
  );
}
