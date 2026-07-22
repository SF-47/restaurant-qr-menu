import { getLangText, normalizeCategory, toNum } from "../../utils/categoryUtils";
import { formatPrice } from "../../utils/menuUtils";

const smallButton =
  "inline-flex min-h-[34px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal px-3 py-2 text-xs font-black text-white shadow-soft focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";
const dangerButton =
  "inline-flex min-h-[34px] items-center justify-center rounded-full bg-gradient-to-br from-red-700 to-red-900 px-3 py-2 text-xs font-black text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";
const pillClass =
  "inline-flex min-h-7 items-center rounded-full border border-primary/15 bg-teal/10 px-2.5 py-1 text-xs font-black text-primary";
const warningClass =
  "inline-flex min-h-7 items-center rounded-full border border-orange/25 bg-gold/15 px-2.5 py-1 text-xs font-black text-orange";

export default function AdminItemCard({
  item,
  onEdit,
  onDelete,
  onToggleAvailable,
  t,
}) {
  const cat = normalizeCategory(item.category);
  const nameEn = getLangText(item.name, "en");
  const nameAr = getLangText(item.name, "ar");
  const price = toNum(item.price, 0);
  const available = item.available !== false;

  return (
    <div className={`relative overflow-hidden rounded-[18px] border border-primary/15 bg-white/90 p-3 shadow-card before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-gradient-to-b before:from-gold before:to-orange ${available ? "" : "opacity-70"}`}>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0 ps-1">
          {nameEn ? (
            <div className="break-words text-base font-black leading-tight text-charcoal">{nameEn}</div>
          ) : (
            <div className="break-words text-base font-black leading-tight text-orange">
              {t.englishNameMissing}
            </div>
          )}
          {nameAr ? (
            <div className="mt-1 break-words text-right text-sm font-extrabold leading-snug text-primary [direction:rtl]">{nameAr}</div>
          ) : (
            <div className="mt-1 break-words text-sm font-extrabold leading-snug text-orange">
              {t.arabicNameMissing}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className={pillClass}>{cat.en || "-"}</span>
            {price ? <span className={`${pillClass} bg-gold/20 text-orange`}>{formatPrice(price)}</span> : <span className={pillClass}>{t.priceDash}</span>}
            <span className={`${pillClass} ${available ? "bg-leaf/10 text-primary" : "border-red-700/20 bg-red-50 text-red-700"}`}>
              {available ? t.available : t.unavailable}
            </span>
            {!nameEn ? <span className={warningClass}>{t.englishNameMissing}</span> : null}
            {!nameAr ? <span className={warningClass}>{t.arabicNameMissing}</span> : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <button
            className={`inline-flex min-h-[34px] items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-black transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange ${
              available
                ? "border-primary/15 bg-leaf/10 text-primary"
                : "border-red-700/20 bg-red-50 text-red-700"
            }`}
            type="button"
            onClick={() => onToggleAvailable(item)}
            aria-pressed={available}
            aria-label={available ? t.markUnavailable : t.markAvailable}
          >
            <span
              className={`relative h-5 w-10 flex-none rounded-full transition [direction:ltr] ${
                available ? "bg-primary" : "bg-red-700/35"
              }`}
              aria-hidden="true"
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                  available ? "left-[22px]" : "left-0.5"
                }`}
              />
            </span>
            <span>{available ? t.available : t.unavailable}</span>
          </button>
          <button className={smallButton} type="button" onClick={() => onEdit(item)}>
            {t.edit}
          </button>
          <button className={dangerButton} type="button" onClick={() => onDelete(item)}>
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
