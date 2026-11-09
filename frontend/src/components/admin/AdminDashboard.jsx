import { useCallback, useEffect, useMemo, useState } from "react";
import { ADMIN_EMPTY_DRAFT } from "../../data/constants";
import AdminCategoryManager from "./AdminCategoryManager";
import AdminHeader from "./AdminHeader";
import AdminItemForm from "./AdminItemForm";
import AdminItemList from "./AdminItemList";
import AdminModal from "./AdminModal";
import { btn, field } from "./adminUi";
import { getAdminTranslations } from "../../i18n/adminTranslations";
import { needsFixing, validateItemDraft } from "../../utils/adminValidation";
import {
  catKey,
  computeNextOrderFillGaps,
  getLangText,
  makeCategoriesFromItems,
  normalizeCategory,
  normalizeTextObj,
  sortMenuItems,
  toNum,
} from "../../utils/categoryUtils";
import { getDirection, storeLanguage } from "../../utils/languageUtils";

const ARABIC = /[\u0600-\u06FF]/;

// Older items store the description as a plain string; split it by script.
function descriptionToDraft(value) {
  if (!value) return { en: "", ar: "" };
  if (typeof value === "string") return ARABIC.test(value) ? { en: "", ar: value } : { en: value, ar: "" };
  return { en: value.en || "", ar: value.ar || "" };
}

/**
 * The admin screens. Data access goes through `repo` (Firestore for the real
 * panel, in-memory for the public demo), so this component never talks to
 * the database directly.
 */
export default function AdminDashboard({
  repo,
  language,
  onLanguageChange,
  onGoToMenu,
  onLogout,
  authError,
  banner,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [manageCatsOpen, setManageCatsOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [addedCategories, setAddedCategories] = useState([]);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ en: "", ar: "" });
  const [newCategoryError, setNewCategoryError] = useState("");
  const [catEditEn, setCatEditEn] = useState("");
  const [catEditAr, setCatEditAr] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "add" });
  const [draft, setDraft] = useState(ADMIN_EMPTY_DRAFT);
  const [formErrors, setFormErrors] = useState({});
  const t = getAdminTranslations(language);
  const direction = getDirection(language);

  useEffect(() => {
    storeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      setItems(await repo.list());
    } catch (e) {
      console.error(e);
      setErr("couldNotLoad");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const map = new Map();
    [...makeCategoriesFromItems(items), ...addedCategories].forEach((category) => {
      const key = catKey(category.en || category.ar);
      if (!key || map.has(key)) return;
      map.set(key, category);
    });
    return Array.from(map.values());
  }, [items, addedCategories]);

  const categoryCounts = useMemo(() => {
    const counts = new Map();
    items.forEach((item) => {
      const key = catKey(normalizeCategory(item.category).en);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [items]);

  const problemCount = useMemo(() => items.filter(needsFixing).length, [items]);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return sortMenuItems(
      items.filter((item) => {
        const available = item.available !== false;
        if (availabilityFilter === "available" && !available) return false;
        if (availabilityFilter === "unavailable" && available) return false;

        const category = normalizeCategory(item.category);
        if (catFilter !== "all" && catKey(category.en) !== catFilter) return false;
        if (onlyProblems && !needsFixing(item)) return false;
        if (!query) return true;

        return [
          getLangText(item.name, "en"),
          getLangText(item.name, "ar"),
          category.en,
          category.ar,
          String(item.price ?? ""),
        ].some((value) => String(value || "").toLowerCase().includes(query));
      }),
    );
  }, [items, catFilter, availabilityFilter, onlyProblems, searchTerm]);

  function openAdd() {
    const first = catFilter !== "all" ? categories.find((c) => catKey(c.en) === catFilter) : categories[0];
    setDraft({
      ...ADMIN_EMPTY_DRAFT,
      category: { en: first?.en || "", ar: first?.ar || "" },
      description: { en: "", ar: "" },
      price: "",
      order: computeNextOrderFillGaps(items),
    });
    setFormErrors({});
    setModal({ open: true, mode: "add" });
  }

  function openEdit(item) {
    setDraft({
      id: item.id,
      name: normalizeTextObj(item.name),
      category: normalizeCategory(item.category),
      description: descriptionToDraft(item.description),
      price: toNum(item.price, 0),
      order: toNum(item.order, 1),
      available: item.available !== false,
    });
    // Show stored problems (e.g. Arabic in the English field) straight away.
    setFormErrors(validateItemDraft({ ...item, name: normalizeTextObj(item.name) }).errors);
    setModal({ open: true, mode: "edit" });
  }

  function openDelete(item) {
    setDraft({ id: item.id, name: normalizeTextObj(item.name) });
    setModal({ open: true, mode: "delete" });
  }

  function closeModal() {
    if (busy) return;
    setModal({ open: false, mode: "add" });
    setDraft(ADMIN_EMPTY_DRAFT);
    setFormErrors({});
  }

  function setField(path, value) {
    setDraft((d) => {
      const copy = structuredClone(d);
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (cur[parts[i]] == null) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
    // Clear the error for the field being edited.
    const key = { "name.en": "nameEn", "name.ar": "nameAr", category: "category", price: "price" }[path];
    if (key) setFormErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function save() {
    if (busy) return;

    const { errors, warnings } = validateItemDraft(draft);
    const hasErrors = Object.values(errors).some(Boolean);
    setFormErrors(errors);
    if (hasErrors) return;
    if (warnings.price && !confirm(t.priceLooksLow(Number(draft.price).toLocaleString("en-US")))) return;

    const payload = {
      name: { en: draft.name.en.trim(), ar: draft.name.ar.trim() },
      category: { en: draft.category.en.trim(), ar: (draft.category.ar || "").trim() },
      description: {
        en: (draft.description?.en || "").trim(),
        ar: (draft.description?.ar || "").trim(),
      },
      price: toNum(draft.price, 0),
      order: toNum(draft.order, 1),
      available: !!draft.available,
    };

    setBusy(true);
    try {
      if (modal.mode === "add") {
        await repo.add(payload);
      } else if (modal.mode === "edit" && draft.id) {
        await repo.update(draft.id, payload);
      }
      setBusy(false);
      closeModal();
      await load();
    } catch (e) {
      console.error(e);
      alert(t.saveFailed);
      setBusy(false);
    }
  }

  async function remove() {
    if (busy || !draft?.id) return;
    setBusy(true);
    try {
      await repo.remove(draft.id);
      setItems((current) => current.filter((item) => item.id !== draft.id));
      setBusy(false);
      closeModal();
    } catch (e) {
      console.error(e);
      alert(`${t.deleteFailed} ${e?.message || ""}`);
      setBusy(false);
    }
  }

  async function toggleAvailability(item) {
    if (!item?.id) return;
    const nextAvailable = item.available === false;
    // Optimistic update; rolled back if Firestore rejects it.
    const setAvailable = (value) =>
      setItems((current) => current.map((c) => (c.id === item.id ? { ...c, available: value } : c)));

    setAvailable(nextAvailable);
    try {
      await repo.update(item.id, { available: nextAvailable });
    } catch (e) {
      console.error(e);
      setAvailable(!nextAvailable);
      alert(t.updateAvailabilityFailed);
    }
  }

  function itemsInCategory(enName) {
    const key = catKey(enName);
    return items.filter((item) => catKey(normalizeCategory(item.category).en) === key);
  }

  async function renameCategory() {
    const en = catEditEn.trim();
    if (!editingCat || !en || busy) return;
    setBusy(true);
    try {
      await repo.updateMany(itemsInCategory(editingCat.en).map((item) => item.id), {
        category: { en, ar: catEditAr.trim() },
      });
      setEditingCat(null);
      await load();
    } catch (e) {
      console.error(e);
      alert(t.renameCategoryFailed);
    } finally {
      setBusy(false);
    }
  }

  async function deleteCategoryByName(enName) {
    if (!enName || busy || !confirm(t.deleteCategoryConfirm(enName))) return;
    setBusy(true);
    try {
      await repo.updateMany(itemsInCategory(enName).map((item) => item.id), {
        category: { en: "", ar: "" },
      });
      setAddedCategories((current) => current.filter((c) => catKey(c.en) !== catKey(enName)));
      await load();
    } catch (e) {
      console.error(e);
      alert(t.deleteCategoryFailed);
    } finally {
      setBusy(false);
    }
  }

  function closeAddCategory() {
    setAddCategoryOpen(false);
    setNewCategory({ en: "", ar: "" });
    setNewCategoryError("");
  }

  function saveAddedCategory() {
    const en = newCategory.en.trim();
    const ar = newCategory.ar.trim();
    if (!en) {
      setNewCategoryError(t.categoryEnRequired);
      return;
    }
    if (!categories.some((c) => catKey(c.en) === catKey(en))) {
      setAddedCategories((current) => [...current, { key: catKey(en), en, ar }]);
    }
    closeAddCategory();
  }

  return (
    <div className="min-h-dvh pb-10 text-charcoal" dir={direction} lang={language}>
      <AdminHeader
        onAdd={openAdd}
        onAddCategory={() => setAddCategoryOpen(true)}
        onRefresh={load}
        onManageCategories={() => setManageCatsOpen(true)}
        onGoToMenu={onGoToMenu}
        onLogout={onLogout}
        loading={loading}
        t={t}
        language={language}
        onLanguageChange={onLanguageChange}
      />

      {banner}

      <main className="mx-auto grid max-w-6xl gap-4 px-4 pt-4">
        {authError ? (
          <p className="m-0 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">
            {authError}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className={field.wrap}>
            <label htmlFor="admin-search" className="sr-only">{t.search}</label>
            <input
              id="admin-search"
              className={field.input}
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
            />
          </div>
          <div className={field.wrap}>
            <label htmlFor="admin-category" className="sr-only">{t.category}</label>
            <select
              id="admin-category"
              className={field.input}
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="all">{t.allCategories}</option>
              {categories.map((category) => (
                <option key={catKey(category.en)} value={catKey(category.en)}>
                  {language === "ar" && category.ar ? category.ar : category.en}
                </option>
              ))}
            </select>
          </div>
          <div className={field.wrap}>
            <label htmlFor="admin-availability" className="sr-only">{t.available}</label>
            <select
              id="admin-availability"
              className={field.input}
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="all">{`${t.available} + ${t.unavailable}`}</option>
              <option value="available">{t.available}</option>
              <option value="unavailable">{t.unavailable}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
          <p className="m-0 tabular-nums text-muted" aria-live="polite">
            {t.showing(filtered.length, items.length)}
          </p>
          {problemCount > 0 || onlyProblems ? (
            <label className="inline-flex min-h-9 items-center gap-2 font-bold text-orange">
              <input
                className={field.checkbox}
                type="checkbox"
                checked={onlyProblems}
                onChange={(e) => setOnlyProblems(e.target.checked)}
              />
              {t.showOnlyProblems} ({problemCount})
            </label>
          ) : null}
        </div>

        <AdminItemList
          items={filtered}
          loading={loading}
          error={err ? t[err] : ""}
          language={language}
          onEdit={openEdit}
          onDelete={openDelete}
          onToggleAvailable={toggleAvailability}
          onRetry={load}
          t={t}
        />
      </main>

      <AdminCategoryManager
        open={manageCatsOpen}
        categories={categories}
        counts={categoryCounts}
        editingCat={editingCat}
        catEditEn={catEditEn}
        catEditAr={catEditAr}
        busy={busy}
        onClose={() => {
          setManageCatsOpen(false);
          setEditingCat(null);
        }}
        onStartEdit={(category) => {
          setEditingCat(category);
          setCatEditEn(category.en);
          setCatEditAr(category.ar || "");
        }}
        onCancelEdit={() => setEditingCat(null)}
        onChangeEn={setCatEditEn}
        onChangeAr={setCatEditAr}
        onRename={renameCategory}
        onDelete={deleteCategoryByName}
        t={t}
      />

      <AdminModal
        open={addCategoryOpen}
        title={t.addCategoryTitle}
        onClose={closeAddCategory}
        onSubmit={saveAddedCategory}
        closeLabel={t.close}
        footer={
          <>
            <button className={btn.secondary} type="button" onClick={closeAddCategory}>
              {t.cancel}
            </button>
            <button className={btn.primary} type="submit">
              {t.saveCategory}
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className={field.wrap}>
            <label htmlFor="new-cat-en" className={field.label}>{t.categoryEn}</label>
            <input
              id="new-cat-en"
              className={field.input}
              dir="ltr"
              value={newCategory.en}
              aria-invalid={newCategoryError ? true : undefined}
              onChange={(e) => {
                setNewCategory((current) => ({ ...current, en: e.target.value }));
                setNewCategoryError("");
              }}
              placeholder={t.categoryExample}
            />
            {newCategoryError ? <p className={`m-0 ${field.error}`}>{newCategoryError}</p> : null}
          </div>
          <div className={field.wrap}>
            <label htmlFor="new-cat-ar" className={field.label}>{t.categoryAr}</label>
            <input
              id="new-cat-ar"
              className={field.input}
              dir="rtl"
              value={newCategory.ar}
              onChange={(e) => setNewCategory((current) => ({ ...current, ar: e.target.value }))}
              placeholder={t.categoryArabicName}
            />
          </div>
          <p className={`m-0 ${field.hint}`}>{t.categoryHelp}</p>
        </div>
      </AdminModal>

      <AdminItemForm
        open={modal.open}
        mode={modal.mode}
        draft={draft}
        categories={categories}
        errors={formErrors}
        saving={busy}
        onClose={closeModal}
        onSave={save}
        setField={setField}
        t={t}
      />

      <AdminModal
        open={modal.open && modal.mode === "delete"}
        title={t.deleteItemTitle}
        onClose={closeModal}
        closeLabel={t.close}
        footer={
          <>
            <button className={btn.secondary} type="button" onClick={closeModal}>
              {t.cancel}
            </button>
            <button className={btn.danger} type="button" onClick={remove} disabled={busy}>
              {busy ? t.deleting : t.delete}
            </button>
          </>
        }
      >
        <p className="m-0 text-charcoal">
          {t.deleteItemCopy}{" "}
          <strong dir="auto">
            {getLangText(draft.name, language) || getLangText(draft.name, "en") || t.unknownItem}
          </strong>
        </p>
      </AdminModal>
    </div>
  );
}
