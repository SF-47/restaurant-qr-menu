import { IoCreateOutline, IoTrashOutline, IoWarningOutline } from "react-icons/io5";
import { btn, surface } from "./adminUi";
import { getLangText, normalizeCategory, toNum } from "../../utils/categoryUtils";
import { needsFixing } from "../../utils/adminValidation";
import { formatPrice } from "../../utils/menuUtils";

export default function AdminItemCard({ item, language, onEdit, onDelete, onToggleAvailable, t }) {
  const cat = normalizeCategory(item.category);
  const nameEn = getLangText(item.name, "en");
  const nameAr = getLangText(item.name, "ar");
  const price = toNum(item.price, 0);
  const available = item.available !== false;
  const flagged = needsFixing(item);

  return (
    <article className={`${surface} grid gap-3 p-4 ${available ? "" : "bg-white/60"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="grid min-w-0 gap-0.5">
          <h3
            className={`m-0 break-words text-base font-bold leading-snug ${nameEn ? "text-charcoal" : "text-muted"}`}
            dir="auto"
          >
            {nameEn || t.englishNameMissing}
          </h3>
          <p className="m-0 break-words text-sm text-muted" dir="auto">
            {nameAr || t.arabicNameMissing}
          </p>
        </div>
        <p className="m-0 flex-none text-sm font-bold tabular-nums text-orange">
          {price ? formatPrice(price) : "-"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-bold text-primary">
          {(language === "ar" && cat.ar) || cat.en || "-"}
        </span>
        {flagged ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-orange/15 px-2.5 py-1 font-bold text-orange">
            <IoWarningOutline className="h-3.5 w-3.5" aria-hidden="true" />
            {t.needsFixing}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-primary/10 pt-3">
        <button
          className="inline-flex min-h-9 items-center gap-2.5 rounded-full text-sm font-bold text-charcoal"
          type="button"
          role="switch"
          aria-checked={available}
          onClick={() => onToggleAvailable(item)}
        >
          <span
            className={`relative h-6 w-11 flex-none rounded-full transition-colors ${available ? "bg-primary" : "bg-muted/40"}`}
            aria-hidden="true"
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[inset-inline-start] duration-150 ${
                available ? "start-[22px]" : "start-0.5"
              }`}
            />
          </span>
          {available ? t.available : t.unavailable}
        </button>

        <div className="flex gap-1">
          <button className={btn.quiet} type="button" onClick={() => onEdit(item)}>
            <IoCreateOutline className="h-4 w-4" aria-hidden="true" />
            {t.edit}
          </button>
          <button className={btn.quietDanger} type="button" onClick={() => onDelete(item)}>
            <IoTrashOutline className="h-4 w-4" aria-hidden="true" />
            {t.delete}
          </button>
        </div>
      </div>
    </article>
  );
}
