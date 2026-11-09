import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import AdminModal from "./AdminModal";
import { btn, field } from "./adminUi";
import { catKey } from "../../utils/categoryUtils";

export default function AdminCategoryManager({
  open,
  categories,
  counts,
  editingCat,
  catEditEn,
  catEditAr,
  busy,
  onClose,
  onStartEdit,
  onCancelEdit,
  onChangeEn,
  onChangeAr,
  onRename,
  onDelete,
  t,
}) {
  if (editingCat) {
    return (
      <AdminModal
        open={open}
        title={t.manageCategoriesTitle}
        onClose={onCancelEdit}
        onSubmit={onRename}
        closeLabel={t.close}
        footer={
          <>
            <button className={btn.secondary} type="button" onClick={onCancelEdit}>
              {t.cancel}
            </button>
            <button className={btn.primary} type="submit" disabled={busy || !catEditEn.trim()}>
              {busy ? t.saving : t.save}
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className={field.wrap}>
            <label htmlFor="cat-edit-en" className={field.label}>{t.editCategoryEn}</label>
            <input id="cat-edit-en" className={field.input} dir="ltr" value={catEditEn} onChange={(e) => onChangeEn(e.target.value)} />
          </div>
          <div className={field.wrap}>
            <label htmlFor="cat-edit-ar" className={field.label}>{t.editCategoryAr}</label>
            <input id="cat-edit-ar" className={field.input} dir="rtl" value={catEditAr} onChange={(e) => onChangeAr(e.target.value)} />
          </div>
        </div>
      </AdminModal>
    );
  }

  return (
    <AdminModal
      open={open}
      title={`${t.manageCategoriesTitle} (${categories.length})`}
      onClose={onClose}
      closeLabel={t.close}
    >
      <ul className="m-0 list-none divide-y divide-primary/10 p-0">
        {categories.map((category) => (
          <li key={category.en} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="m-0 font-bold text-charcoal">
                {category.en}
                <span className="ms-2 text-xs font-normal tabular-nums text-muted">
                  {counts.get(catKey(category.en)) || 0}
                </span>
              </p>
              {category.ar ? (
                <p className="m-0 text-sm text-muted" dir="rtl" style={{ textAlign: "start" }}>
                  {category.ar}
                </p>
              ) : null}
            </div>
            <div className="flex flex-none gap-1">
              <button className={btn.quiet} type="button" onClick={() => onStartEdit(category)} disabled={busy}>
                <IoCreateOutline className="h-4 w-4" aria-hidden="true" />
                {t.edit}
              </button>
              <button className={btn.quietDanger} type="button" onClick={() => onDelete(category.en)} disabled={busy}>
                <IoTrashOutline className="h-4 w-4" aria-hidden="true" />
                {t.delete}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </AdminModal>
  );
}
