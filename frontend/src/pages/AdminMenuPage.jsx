import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { ADMIN_EMPTY_DRAFT } from "../data/constants";
import AdminCategoryManager from "../components/admin/AdminCategoryManager";
import AdminHeader from "../components/admin/AdminHeader";
import AdminItemForm from "../components/admin/AdminItemForm";
import AdminItemList from "../components/admin/AdminItemList";
import AdminLogin from "../components/admin/AdminLogin";
import AdminModal from "../components/admin/AdminModal";
import { getAdminTranslations } from "../i18n/adminTranslations";
import {
  catKey,
  computeNextOrderFillGaps,
  getLangText,
  makeCategoriesFromItems,
  normalizeCategory,
  normalizeTextObj,
  sortMenuItems,
  toNum,
} from "../utils/categoryUtils";
import { getDirection, getStoredLanguage, storeLanguage } from "../utils/languageUtils";

export default function AdminMenuPage() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(getStoredLanguage);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [showOnlyUnavailable, setShowOnlyUnavailable] = useState(false);
  const [manageCatsOpen, setManageCatsOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [addedCategories, setAddedCategories] = useState([]);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ en: "", ar: "" });
  const [catEditEn, setCatEditEn] = useState("");
  const [catEditAr, setCatEditAr] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "add" });
  const [draft, setDraft] = useState(ADMIN_EMPTY_DRAFT);
  const t = getAdminTranslations(language);
  const direction = getDirection(language);

  useEffect(() => {
    storeLanguage(language);
  }, [language]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setErr("");
      const snap = await getDocs(collection(db, "menuItems"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
    } catch (e) {
      console.error(e);
      setErr(t.couldNotLoad);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [t.couldNotLoad]);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user, load]);

  const categories = useMemo(() => {
    const map = new Map();
    [...makeCategoriesFromItems(items), ...addedCategories].forEach((category) => {
      const key = catKey(category.en || category.ar);
      if (!key || map.has(key)) return;
      map.set(key, category);
    });
    return Array.from(map.values());
  }, [items, addedCategories]);

  const stats = useMemo(
    () => ({
      total: items.length,
      available: items.filter((item) => item.available !== false).length,
      unavailable: items.filter((item) => item.available === false).length,
      categories: categories.length,
    }),
    [items, categories.length],
  );

  const filtered = useMemo(
    () =>
      sortMenuItems(
        items
          .filter((item) => {
            if (showOnlyUnavailable) return item.available === false;
            return showUnavailable ? true : item.available !== false;
          })
          .filter((item) => {
            const catEn = normalizeCategory(item.category).en;
            if (catFilter === "All") return true;
            return catEn === catFilter;
          })
          .filter((item) => {
            const query = searchTerm.trim().toLowerCase();
            if (!query) return true;

            const category = normalizeCategory(item.category);
            const values = [
              getLangText(item.name, "en"),
              getLangText(item.name, "ar"),
              category.en,
              category.ar,
              String(item.price ?? ""),
            ];

            return values.some((value) => String(value || "").toLowerCase().includes(query));
          }),
      ),
    [items, catFilter, searchTerm, showUnavailable, showOnlyUnavailable],
  );

  function openAdd() {
    const defaultCat = categories[0]?.en || "";
    const next = computeNextOrderFillGaps(items);

    setDraft({
      ...ADMIN_EMPTY_DRAFT,
      category: {
        en: defaultCat,
        ar: categories.find((category) => category.en === defaultCat)?.ar || "",
      },
      price: "",
      order: next,
      available: true,
    });

    setModal({ open: true, mode: "add" });
  }

  function openEdit(item) {
    const cat = normalizeCategory(item.category);
    setDraft({
      id: item.id,
      name: normalizeTextObj(item.name),
      category: cat,
      price: toNum(item.price, 0),
      order: toNum(item.order, 1),
      available: item.available !== false,
    });
    setModal({ open: true, mode: "edit" });
  }

  function openDelete(item) {
    setDraft({ id: item.id, name: normalizeTextObj(item.name) });
    setModal({ open: true, mode: "delete" });
  }

  function closeModal() {
    setModal({ open: false, mode: "add" });
    setDraft(ADMIN_EMPTY_DRAFT);
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
  }

  async function renameCategory(oldEn, newObj) {
    if (!oldEn || !newObj) return;
    try {
      setLoading(true);
      const keyOld = catKey(oldEn);
      const updates = items
        .filter((item) => catKey(normalizeCategory(item.category).en) === keyOld)
        .map((item) =>
          updateDoc(doc(db, "menuItems", item.id), {
            category: { en: newObj.en, ar: newObj.ar || "" },
            updatedAt: serverTimestamp(),
          }),
        );

      for (const p of updates) await p;
      await load();
    } catch (e) {
      console.error(e);
      alert(t.renameCategoryFailed);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategoryByName(enName) {
    if (!enName) return;
    if (
      !confirm(
        t.deleteCategoryConfirm(enName),
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const keyOld = catKey(enName);
      const updates = items
        .filter((item) => catKey(normalizeCategory(item.category).en) === keyOld)
        .map((item) =>
          updateDoc(doc(db, "menuItems", item.id), {
            category: { en: "", ar: "" },
            updatedAt: serverTimestamp(),
          }),
        );

      for (const p of updates) await p;
      await load();
    } catch (e) {
      console.error(e);
      alert(t.deleteCategoryFailed);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    const payload = {
      name: {
        en: (draft.name.en || "").trim(),
        ar: (draft.name.ar || "").trim(),
      },
      category: {
        en: (draft.category?.en || "").trim(),
        ar: (draft.category?.ar || "").trim(),
      },
      price: toNum(draft.price, 0),
      order: toNum(draft.order, 1),
      available: !!draft.available,
      updatedAt: serverTimestamp(),
    };

    if (!payload.name.en) {
      alert(t.nameEnRequired);
      return;
    }
    if (!payload.category.en) {
      alert(t.categoryEnRequired);
      return;
    }

    try {
      if (modal.mode === "add") {
        await addDoc(collection(db, "menuItems"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      } else if (modal.mode === "edit" && draft.id) {
        await updateDoc(doc(db, "menuItems", draft.id), payload);
      }
      await load();
      closeModal();
    } catch (e) {
      console.error(e);
      alert(t.saveFailed);
    }
  }

  async function remove() {
    const id = draft?.id;
    if (!id) {
      alert(t.noItemSelected);
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, "menuItems", String(id)));
      await load();
      closeModal();
    } catch (e) {
      console.error(e);
      alert(`${t.deleteFailed} ${e?.message || ""}`);
    } finally {
      setLoading(false);
    }
  }

  async function toggleAvailability(item) {
    if (!item?.id) return;
    const nextAvailable = item.available === false;

    try {
      await updateDoc(doc(db, "menuItems", item.id), {
        available: nextAvailable,
        updatedAt: serverTimestamp(),
      });
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id ? { ...currentItem, available: nextAvailable } : currentItem,
        ),
      );
    } catch (e) {
      console.error(e);
      alert(t.updateAvailabilityFailed);
    }
  }

  function closeCategoryManager() {
    setManageCatsOpen(false);
    setEditingCat(null);
  }

  function closeAddCategory() {
    setAddCategoryOpen(false);
    setNewCategory({ en: "", ar: "" });
  }

  function saveAddedCategory() {
    const en = newCategory.en.trim();
    const ar = newCategory.ar.trim();
    if (!en) {
      alert(t.categoryEnRequired);
      return;
    }

    setAddedCategories((current) => {
      if (current.some((category) => catKey(category.en) === catKey(en))) return current;
      if (makeCategoriesFromItems(items).some((category) => catKey(category.en) === catKey(en))) return current;
      return [...current, { key: catKey(en), en, ar }];
    });
    closeAddCategory();
  }

  return (
    <AdminLogin
      onUserChange={setUser}
      t={t}
      language={language}
      onLanguageChange={setLanguage}
    >
      {({ goToMenu, logout, authError }) => (
        <div
          className="min-h-screen bg-cream p-2.5 text-charcoal [background:radial-gradient(circle_at_top_left,rgba(246,170,45,0.18),transparent_22rem),linear-gradient(180deg,#fff7e8,#fffdf8_34rem,#fffaf0)] sm:p-3.5"
          dir={direction}
          lang={language}
        >
          {authError ? (
            <div className="mx-auto mb-3 w-full max-w-[1180px] rounded-2xl border border-red-700/20 bg-red-50 p-4 text-center font-extrabold text-red-700">
              {authError}
            </div>
          ) : null}
          <AdminHeader
            onAdd={openAdd}
            onAddCategory={() => setAddCategoryOpen(true)}
            onRefresh={load}
            onManageCategories={() => setManageCatsOpen(true)}
            onGoToMenu={goToMenu}
            onLogout={logout}
            loading={loading}
            stats={stats}
            t={t}
            language={language}
            onLanguageChange={setLanguage}
          />

          <div className="mx-auto mb-3 grid w-full max-w-[1180px] gap-2.5 rounded-[18px] border border-primary/15 bg-white/90 p-3 shadow-card md:grid-cols-[minmax(220px,1fr)_minmax(240px,1.2fr)_auto_auto] md:items-end">
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-muted">{t.category}</span>
              <select
                className="min-h-10 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-charcoal shadow-sm outline-none focus:border-orange focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
              >
                <option value="All">{t.allCategories}</option>
                {categories.map((category) => (
                  <option key={category.en} value={category.en}>
                    {language === "ar" && category.ar ? category.ar : category.en}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-xs font-black text-muted">{t.search}</span>
              <input
                className="min-h-10 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-charcoal shadow-sm outline-none focus:border-orange focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
              />
            </label>

            <label className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary/15 bg-white px-3 py-2 text-[13px] font-black text-primary">
              <input
                className="h-4 w-4 accent-primary"
                type="checkbox"
                checked={showUnavailable}
                onChange={(e) => setShowUnavailable(e.target.checked)}
              />
              {t.showUnavailable}
            </label>
            <label className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary/15 bg-white px-3 py-2 text-[13px] font-black text-primary">
              <input
                className="h-4 w-4 accent-primary"
                type="checkbox"
                checked={showOnlyUnavailable}
                onChange={(e) => setShowOnlyUnavailable(e.target.checked)}
              />
              {t.showOnlyUnavailable}
            </label>
          </div>

          <AdminCategoryManager
            open={manageCatsOpen}
            categories={categories}
            editingCat={editingCat}
            catEditEn={catEditEn}
            catEditAr={catEditAr}
            onClose={closeCategoryManager}
            onStartEdit={(category) => {
              setEditingCat(category);
              setCatEditEn(category.en);
              setCatEditAr(category.ar || "");
            }}
            onCancelEdit={() => setEditingCat(null)}
            onChangeEn={setCatEditEn}
            onChangeAr={setCatEditAr}
            onRename={async () => {
              await renameCategory(editingCat.en, { en: catEditEn, ar: catEditAr });
              setEditingCat(null);
            }}
            onDelete={deleteCategoryByName}
            t={t}
          />

          <AdminModal open={addCategoryOpen} title={t.addCategoryTitle} onClose={closeAddCategory} closeLabel={t.close}>
            <div className="grid gap-2.5">
              <label className="grid gap-1">
                <span className="text-[11px] font-black text-muted">{t.categoryEn}</span>
                <input
                  className="min-h-9 w-full rounded-xl border border-primary/15 bg-white px-2.5 py-1.5 text-[13px] text-charcoal shadow-sm outline-none focus:border-orange focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange"
                  value={newCategory.en}
                  onChange={(e) => setNewCategory((current) => ({ ...current, en: e.target.value }))}
                  placeholder={t.categoryExample}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-[11px] font-black text-muted">{t.categoryAr}</span>
                <input
                  className="min-h-9 w-full rounded-xl border border-primary/15 bg-white px-2.5 py-1.5 text-[13px] text-charcoal shadow-sm outline-none focus:border-orange focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange"
                  value={newCategory.ar}
                  onChange={(e) => setNewCategory((current) => ({ ...current, ar: e.target.value }))}
                  placeholder={t.categoryArabicName}
                  dir="rtl"
                />
              </label>
              <p className="m-0 rounded-2xl border border-primary/15 bg-cream-soft p-3 text-xs font-extrabold text-muted">
                {t.categoryHelp}
              </p>
            </div>
            <div className="sticky bottom-[-10px] z-10 -mx-2.5 -mb-2.5 mt-2.5 flex flex-wrap justify-end gap-2 border-t border-primary/10 bg-gradient-to-b from-white/90 to-white px-2.5 py-2.5 sm:-mx-3 sm:-mb-3 sm:px-3">
              <button className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-black text-primary transition duration-150 hover:-translate-y-0.5 hover:border-orange/40 hover:bg-cream-soft hover:text-orange active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange" type="button" onClick={closeAddCategory}>
                {t.cancel}
              </button>
              <button className="inline-flex min-h-[38px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal px-4 py-2 text-sm font-black text-white shadow-soft transition duration-150 hover:-translate-y-0.5 hover:from-teal hover:to-leaf hover:shadow-card active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange" type="button" onClick={saveAddedCategory}>
                {t.saveCategory}
              </button>
            </div>
          </AdminModal>

          <AdminItemList
            items={filtered}
            loading={loading}
            error={err}
            onEdit={openEdit}
            onDelete={openDelete}
            onToggleAvailable={toggleAvailability}
            t={t}
          />

          <AdminItemForm
            open={modal.open}
            mode={modal.mode}
            draft={draft}
            categories={categories}
            onClose={closeModal}
            onSave={save}
            setDraft={setDraft}
            setField={setField}
            t={t}
          />

          <AdminModal open={modal.open && modal.mode === "delete"} title={t.deleteItemTitle} onClose={closeModal} closeLabel={t.close}>
            <p className="m-0 rounded-2xl border border-red-700/20 bg-red-50 p-3 text-red-700">
              {t.deleteItemCopy} <b>{getLangText(draft.name, language) || getLangText(draft.name, "en") || t.unknownItem}</b>
            </p>
            <div className="sticky bottom-[-10px] z-10 -mx-2.5 -mb-2.5 mt-2.5 flex flex-wrap justify-end gap-2 border-t border-primary/10 bg-gradient-to-b from-white/90 to-white px-2.5 py-2.5 sm:-mx-3 sm:-mb-3 sm:px-3">
              <button className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-black text-primary transition duration-150 hover:-translate-y-0.5 hover:border-orange/40 hover:bg-cream-soft hover:text-orange active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange" type="button" onClick={closeModal}>
                {t.cancel}
              </button>
              <button className="inline-flex min-h-[38px] items-center justify-center rounded-full bg-gradient-to-br from-red-700 to-red-900 px-4 py-2 text-sm font-black text-white transition duration-150 hover:-translate-y-0.5 hover:from-red-800 hover:to-red-950 active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={remove} disabled={loading}>
                {loading ? t.deleting : t.delete}
              </button>
            </div>
          </AdminModal>
        </div>
      )}
    </AdminLogin>
  );
}
