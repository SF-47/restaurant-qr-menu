import { useId } from "react";
import AdminModal from "./AdminModal";
import { btn, field } from "./adminUi";
import { catKey } from "../../utils/categoryUtils";

function formatPriceInput(value) {
  if (value === "" || value == null) return "";
  const digits = String(value).replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("en-US") : "";
}

function parseDigits(value) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : "";
}

function Field({ label, hint, error, children, className = "" }) {
  const id = useId();
  return (
    <div className={`${field.wrap} ${className}`}>
      <label htmlFor={id} className={field.label}>
        {label}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error || hint ? `${id}-note` : undefined,
      })}
      {error ? (
        <p id={`${id}-note`} className={`m-0 ${field.error}`}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-note`} className={`m-0 ${field.hint}`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function AdminItemForm({
  open,
  mode,
  draft,
  categories,
  errors = {},
  saving,
  onClose,
  onSave,
  setField,
  t,
}) {
  const err = (key) => (errors[key] ? t[errors[key]] : "");
  const selectedKey = catKey(draft.category?.en);
  const knownCategory = categories.some((c) => catKey(c.en) === selectedKey);

  return (
    <AdminModal
      open={open && (mode === "add" || mode === "edit")}
      title={mode === "add" ? t.addItemTitle : t.editItemTitle}
      onClose={onClose}
      onSubmit={onSave}
      closeLabel={t.close}
      size="lg"
      footer={
        <>
          <button className={btn.secondary} type="button" onClick={onClose}>
            {t.cancel}
          </button>
          <button className={btn.primary} type="submit" disabled={saving}>
            {saving ? t.saving : t.save}
          </button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t.nameEn} error={err("nameEn")}>
          {(props) => (
            <input
              {...props}
              className={field.input}
              dir="ltr"
              lang="en"
              value={draft.name.en}
              onChange={(e) => setField("name.en", e.target.value)}
            />
          )}
        </Field>

        <Field label={t.nameAr} error={err("nameAr")}>
          {(props) => (
            <input
              {...props}
              className={field.input}
              dir="rtl"
              lang="ar"
              value={draft.name.ar}
              onChange={(e) => setField("name.ar", e.target.value)}
            />
          )}
        </Field>

        <Field label={t.category} error={err("category")}>
          {(props) => (
            <select
              {...props}
              className={field.input}
              value={selectedKey}
              onChange={(e) => {
                const picked = categories.find((c) => catKey(c.en) === e.target.value);
                setField("category", { en: picked?.en || "", ar: picked?.ar || "" });
              }}
            >
              <option value="">{t.pickCategory}</option>
              {!knownCategory && selectedKey ? (
                <option value={selectedKey}>{draft.category.en}</option>
              ) : null}
              {categories.map((c) => (
                <option key={catKey(c.en)} value={catKey(c.en)}>
                  {c.ar ? `${c.en} / ${c.ar}` : c.en}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label={`${t.price} (LBP)`} error={err("price")}>
          {(props) => (
            <input
              {...props}
              className={`${field.input} tabular-nums`}
              type="text"
              inputMode="numeric"
              dir="ltr"
              placeholder="450,000"
              value={formatPriceInput(draft.price)}
              onChange={(e) => setField("price", parseDigits(e.target.value))}
            />
          )}
        </Field>

        <Field label={`${t.descriptionEn} (${t.optional})`}>
          {(props) => (
            <textarea
              {...props}
              className={field.textarea}
              rows={2}
              dir="ltr"
              lang="en"
              value={draft.description?.en || ""}
              onChange={(e) => setField("description.en", e.target.value)}
            />
          )}
        </Field>

        <Field label={`${t.descriptionAr} (${t.optional})`}>
          {(props) => (
            <textarea
              {...props}
              className={field.textarea}
              rows={2}
              dir="rtl"
              lang="ar"
              value={draft.description?.ar || ""}
              onChange={(e) => setField("description.ar", e.target.value)}
            />
          )}
        </Field>

        <Field label={t.position} hint={t.positionHelp}>
          {(props) => (
            <input
              {...props}
              className={`${field.input} tabular-nums`}
              type="text"
              inputMode="numeric"
              dir="ltr"
              value={draft.order ?? ""}
              onChange={(e) => setField("order", parseDigits(e.target.value))}
            />
          )}
        </Field>

        <label className="inline-flex min-h-11 items-center gap-2.5 self-end text-sm font-bold text-charcoal">
          <input
            className={field.checkbox}
            type="checkbox"
            checked={!!draft.available}
            onChange={(e) => setField("available", e.target.checked)}
          />
          {t.available}
        </label>
      </div>
    </AdminModal>
  );
}
