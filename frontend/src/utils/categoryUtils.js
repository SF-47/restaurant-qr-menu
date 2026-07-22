import { CATEGORY_ORDER, END_CATEGORIES } from "../data/constants";

const CATEGORY_TRANSLATIONS = {
  appetizers: { en: "Appetizers", ar: "مقبلات" },
  burgers: { en: "Burgers", ar: "برغر" },
  chicken: { en: "Chicken", ar: "فروج" },
  crispy: { en: "Crispy", ar: "كريسبي" },
  doner: { en: "Doner", ar: "دونر" },
  drinks: { en: "Drinks", ar: "مشروبات" },
  meals: { en: "Meals", ar: "وجبات" },
  offers: { en: "Offers", ar: "عروض" },
  potato: { en: "Potato", ar: "بطاطا" },
  sandwiches: { en: "Sandwiches", ar: "سندويشات" },
  shawarma: { en: "Shawarma", ar: "شاورما" },
  "shawarma (kilo)": { en: "Shawarma (Kilo)", ar: "شاورما (كيلو)" },
  tawouk: { en: "Tawouk", ar: "طاووق" },
  zinger: { en: "Zinger", ar: "زنجر" },
};

export function catKey(v) {
  return (v || "").toString().trim().toLowerCase();
}

export const CATEGORY_INDEX = new Map(
  CATEGORY_ORDER.map((name, idx) => [catKey(name), idx]),
);

export function categoryRank(catEn) {
  const key = catKey(catEn);

  if (END_CATEGORIES.map(catKey).includes(key)) return 1_000_000;
  if (CATEGORY_INDEX.has(key)) return CATEGORY_INDEX.get(key);

  return 500_000;
}

export function getLangText(value, lang = "en") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value?.[lang] ?? "";
  return "";
}

export function getLocalizedText(value, language = "en") {
  const fallbackLanguage = language === "ar" ? "en" : "ar";
  return (
    getLangText(value, language) ||
    getLangText(value, fallbackLanguage) ||
    (typeof value === "string" ? value : "")
  );
}

export function toNum(v, fallback = 0) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v.replace(/,/g, "")) || fallback;
  return fallback;
}

export function getCategoryName(item) {
  return (
    item.categoryEn ||
    getLangText(item.category, "en") ||
    (typeof item.category === "string" ? item.category : "")
  );
}

export function getItemCategoryKey(item) {
  return catKey(getCategoryName(item) || item.categoryAr || getLangText(item.category, "ar"));
}

export function getCategoryLabel(category, language = "en") {
  if (!category) return "";
  const key = typeof category === "string" ? catKey(category) : catKey(category.en || category.label || category.ar);
  const fallback = CATEGORY_TRANSLATIONS[key];

  if (typeof category === "string") {
    return fallback?.[language] || category;
  }

  if (language === "ar") return category.ar || fallback?.ar || category.en || category.label || "";
  return category.en || fallback?.en || category.ar || category.label || "";
}

export function getItemCategoryLabel(item, language = "en") {
  const category = normalizeCategory(item.category);
  const en = item.categoryEn || category.en || (typeof item.category === "string" ? item.category : "");
  const ar = item.categoryAr || category.ar || "";
  return getCategoryLabel({ en, ar }, language);
}

export function normalizeCategory(cat) {
  const en = getLangText(cat, "en") || (typeof cat === "string" ? cat : "");
  const ar = getLangText(cat, "ar");
  return { en: en.trim(), ar: (ar || "").trim() };
}

export function normalizeTextObj(v) {
  if (!v) return { en: "", ar: "" };
  if (typeof v === "string") return { en: v, ar: "" };
  if (typeof v === "object") return { en: v.en || "", ar: v.ar || "" };
  return { en: "", ar: "" };
}

export function sortMenuItems(items) {
  return (items || []).slice().sort((a, b) => {
    const ra = categoryRank(getCategoryName(a));
    const rb = categoryRank(getCategoryName(b));
    if (ra !== rb) return ra - rb;

    const ao = toNum(a.order);
    const bo = toNum(b.order);
    if (ao !== bo) return ao - bo;

    return getLangText(a.name, "en").localeCompare(getLangText(b.name, "en"));
  });
}

export function makeCategoriesFromItems(items, includeAll = false) {
  const map = new Map();

  (items || []).forEach((item) => {
    const category = {
      en:
        item.categoryEn ||
        getLangText(item.category, "en") ||
        (typeof item.category === "string" ? item.category : ""),
      ar: item.categoryAr || getLangText(item.category, "ar") || "",
    };
    const key = catKey(category.en || category.ar);
    if (!key) return;

    if (!map.has(key)) {
      map.set(key, {
        key,
        en: (category.en || category.ar).trim(),
        ar: (category.ar || "").trim(),
      });
    }
  });

  const list = Array.from(map.values());
  list.sort((a, b) => {
    const ra = categoryRank(a.en);
    const rb = categoryRank(b.en);
    if (ra !== rb) return ra - rb;
    return a.en.localeCompare(b.en);
  });

  return includeAll ? [{ key: "all", en: "All", ar: "الكل" }, ...list] : list;
}

export function computeNextOrderFillGaps(items) {
  const used = new Set();

  for (const item of items || []) {
    const n = toNum(item.order, 0);
    if (Number.isInteger(n) && n > 0) used.add(n);
  }

  let candidate = 1;
  while (used.has(candidate)) candidate++;
  return candidate;
}
