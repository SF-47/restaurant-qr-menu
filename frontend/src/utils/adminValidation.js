// Kept dependency-free so it can be unit tested with `node --test`.
// Error/warning values are translation keys (see i18n/adminTranslations.js).

const ARABIC_LETTERS = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const LOW_PRICE = 1000; // Prices are full LBP amounts, e.g. 450,000.

function text(value, lang) {
  if (typeof value === "string") return lang === "en" ? value.trim() : "";
  return String(value?.[lang] || "").trim();
}

function nameErrors(nameEn, nameAr) {
  const errors = {};

  if (!nameEn) errors.nameEn = "nameEnRequired";
  else if (ARABIC_LETTERS.test(nameEn)) errors.nameEn = "nameEnHasArabic";

  if (!nameAr) errors.nameAr = "nameArRequired";
  else if (!ARABIC_LETTERS.test(nameAr)) errors.nameAr = "nameArNotArabic";

  return errors;
}

/** Validates the add/edit form. Errors block saving; warnings ask for confirmation. */
export function validateItemDraft(draft) {
  const errors = nameErrors(text(draft?.name, "en"), text(draft?.name, "ar"));
  const warnings = {};

  if (!text(draft?.category, "en")) errors.category = "categoryEnRequired";

  const price = Number(draft?.price);
  if (!Number.isFinite(price) || price <= 0) errors.price = "priceRequired";
  else if (price < LOW_PRICE) warnings.price = "priceLooksLow";

  return { errors, warnings };
}

/** Field names with a problem on a stored item, used to flag rows in the list. */
export function findItemProblems(item) {
  const { errors, warnings } = validateItemDraft(item);
  return [...Object.keys(errors), ...Object.keys(warnings)];
}

/** True when a customer-visible item has a problem. Hidden items are not flagged. */
export function needsFixing(item) {
  return item?.available !== false && findItemProblems(item).length > 0;
}
