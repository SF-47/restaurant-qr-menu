import AdminCategoryCombo from "./AdminCategoryCombo";
import AdminModal from "./AdminModal";

const fieldClass = "grid gap-1";
const labelClass = "text-[11px] font-black text-muted";
const inputClass =
  "min-h-9 w-full rounded-xl border border-primary/15 bg-white px-2.5 py-1.5 text-[13px] text-charcoal shadow-sm outline-none focus:border-orange focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";
const numberInputClass = `${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`;
const primaryButton =
  "inline-flex min-h-[38px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal px-4 py-2 text-sm font-black text-white shadow-soft transition duration-150 hover:-translate-y-0.5 hover:from-teal hover:to-leaf hover:shadow-card active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";
const ghostButton =
  "inline-flex min-h-[38px] items-center justify-center rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-black text-primary transition duration-150 hover:-translate-y-0.5 hover:border-orange/40 hover:bg-cream-soft hover:text-orange active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";

function formatPriceInput(value) {
  if (value === "" || value == null) return "";
  const digits = String(value).replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("en-US") : "";
}

function parsePriceInput(value) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : "";
}

export default function AdminItemForm({
  open,
  mode,
  draft,
  categories,
  onClose,
  onSave,
  setDraft,
  setField,
  t,
}) {
  return (
    <AdminModal
      open={open && (mode === "add" || mode === "edit")}
      title={mode === "add" ? t.addItemTitle : t.editItemTitle}
      onClose={onClose}
      closeLabel={t.close}
    >
      <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        <label className={fieldClass}>
          <span className={labelClass}>{t.nameEn}</span>
          <input
            className={inputClass}
            value={draft.name.en}
            onChange={(e) => setField("name.en", e.target.value)}
          />
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>{t.nameAr}</span>
          <input
            className={inputClass}
            value={draft.name.ar}
            onChange={(e) => setField("name.ar", e.target.value)}
            dir="rtl"
          />
        </label>

        <div className={fieldClass}>
          <label className={labelClass}>{t.category}</label>
          <AdminCategoryCombo
            categories={categories}
            value={draft.category || { en: "", ar: "" }}
            onTypeEn={(v) => setField("category.en", v)}
            onPickObj={(obj) => {
              setField("category.en", obj.en);
              setField("category.ar", obj.ar || "");
            }}
            t={t}
          />
        </div>

        <label className={fieldClass}>
          <span className={labelClass}>{t.categoryAr}</span>
          <input
            className={inputClass}
            value={draft.category?.ar || ""}
            onChange={(e) => setField("category.ar", e.target.value)}
            dir="rtl"
          />
        </label>

        <label className={fieldClass}>
          <span className={labelClass}>{t.price}</span>
          <input
            className={numberInputClass}
            type="text"
            inputMode="numeric"
            value={formatPriceInput(draft.price)}
            onChange={(e) =>
              setDraft((d) => ({
                ...d,
                price: parsePriceInput(e.target.value),
              }))
            }
          />
        </label>

        <div className="sm:col-span-2">
          <label className="inline-flex min-h-9 w-fit items-center gap-2 rounded-xl border border-primary/15 bg-white px-2.5 py-1.5 text-xs font-black text-primary">
            <input
              className="h-4 w-4 accent-primary"
              type="checkbox"
              checked={!!draft.available}
              onChange={(e) => setDraft((d) => ({ ...d, available: e.target.checked }))}
            />
            {t.available}
          </label>
        </div>
      </div>

      <div className="sticky bottom-[-10px] z-10 -mx-2.5 -mb-2.5 mt-2.5 flex flex-wrap justify-end gap-2 border-t border-primary/10 bg-gradient-to-b from-white/90 to-white px-2.5 py-2.5 sm:-mx-3 sm:-mb-3 sm:px-3">
        <button className={ghostButton} type="button" onClick={onClose}>
          {t.cancel}
        </button>
        <button className={primaryButton} type="button" onClick={onSave}>
          {t.save}
        </button>
      </div>
    </AdminModal>
  );
}
