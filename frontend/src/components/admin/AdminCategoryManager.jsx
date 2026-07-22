import AdminModal from "./AdminModal";

const inputClass =
  "min-h-9 w-full rounded-xl border border-primary/15 bg-white px-2.5 py-1.5 text-[13px] text-charcoal shadow-sm outline-none focus:border-orange focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";
const primaryButton =
  "inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal px-4 py-2 text-sm font-black text-white shadow-soft focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";
const ghostButton =
  "inline-flex min-h-10 items-center justify-center rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-black text-primary focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";
const dangerButton =
  "inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-br from-red-700 to-red-900 px-4 py-2 text-sm font-black text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";

export default function AdminCategoryManager({
  open,
  categories,
  editingCat,
  catEditEn,
  catEditAr,
  onClose,
  onStartEdit,
  onCancelEdit,
  onChangeEn,
  onChangeAr,
  onRename,
  onDelete,
  t,
}) {
  return (
    <AdminModal
      open={open}
      title={`${t.manageCategoriesTitle} (${categories.length})`}
      onClose={onClose}
      closeLabel={t.close}
      headerRight={
        !editingCat && (
          <button className={ghostButton} onClick={onClose}>
            {t.cancel}
          </button>
        )
      }
    >
      <div className="grid gap-2.5">
        {editingCat ? (
          <div className="grid gap-2.5">
            <label className="grid gap-1">
              <span className="text-[11px] font-black text-muted">{t.editCategoryEn}</span>
              <input className={inputClass} value={catEditEn} onChange={(e) => onChangeEn(e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="text-[11px] font-black text-muted">{t.editCategoryAr}</span>
              <input
                className={inputClass}
                value={catEditAr}
                onChange={(e) => onChangeAr(e.target.value)}
                dir="rtl"
              />
            </label>

            <div className="sticky bottom-[-10px] z-10 -mx-2.5 -mb-2.5 mt-2 flex flex-wrap justify-end gap-2 border-t border-primary/10 bg-gradient-to-b from-white/90 to-white px-2.5 py-2.5 sm:-mx-3 sm:-mb-3 sm:px-3">
              <button className={ghostButton} onClick={onCancelEdit}>
                {t.cancel}
              </button>
              <button className={primaryButton} onClick={onRename}>
                {t.save}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            {categories.map((category) => (
              <div
                key={category.en}
                className="flex flex-col gap-2 rounded-2xl border border-primary/15 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-sm font-black text-primary">{category.en}</div>
                  {category.ar ? (
                    <div className="mt-0.5 text-right text-xs text-muted [direction:rtl]">
                      {category.ar}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:justify-end">
                  <button className={ghostButton} onClick={() => onStartEdit(category)}>
                    {t.edit}
                  </button>
                  <button className={dangerButton} onClick={() => onDelete(category.en)}>
                    {t.delete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminModal>
  );
}
