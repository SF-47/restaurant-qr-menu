import { getCategoryName, getLangText, getLocalizedText } from "./categoryUtils";

export function getPrice(item) {
  if (typeof item.price === "number") return item.price;
  if (typeof item.price === "string") return Number(item.price) || 0;
  return 0;
}

export function formatPrice(price) {
  if (!price) return "";
  return `LBP ${price.toLocaleString("en-US")}`;
}

export function hasSuspiciousLowPrice(item) {
  const price = getPrice(item);
  return price > 0 && price < 1000;
}

export function getItemName(item, language = "en") {
  const localized =
    language === "ar"
      ? item.nameAr || item.arabicName || getLocalizedText(item.name, "ar")
      : item.nameEn || getLocalizedText(item.name, "en");

  const fallback =
    language === "ar"
      ? item.nameEn || getLocalizedText(item.name, "en")
      : item.nameAr || item.arabicName || getLocalizedText(item.name, "ar");

  return localized || fallback || "";
}

export function getSecondaryItemName(item, language = "en") {
  const primary = getItemName(item, language).trim();
  const secondary =
    language === "ar"
      ? item.nameEn || getLocalizedText(item.name, "en")
      : item.nameAr || item.arabicName || getLocalizedText(item.name, "ar");

  return secondary && secondary.trim() !== primary ? secondary : "";
}

export function getItemDescription(item, language = "en") {
  const localized =
    language === "ar"
      ? item.descriptionAr ||
        item.arabicDescription ||
        getLocalizedText(item.description, "ar")
      : item.descriptionEn || getLocalizedText(item.description, "en");

  const fallback =
    language === "ar"
      ? item.descriptionEn || getLocalizedText(item.description, "en")
      : item.descriptionAr ||
        item.arabicDescription ||
        getLocalizedText(item.description, "ar");

  return localized || fallback || "";
}

export function getItemDescriptionParts(item) {
  const descEn =
    item.descriptionEn ||
    getLangText(item.description, "en") ||
    (typeof item.description === "string" ? item.description : "");
  const descAr =
    item.descriptionAr || item.arabicDescription || getLangText(item.description, "ar");

  return { descEn, descAr };
}

export function getBestSellerItems(items) {
  const preferred = (items || []).filter((item) => {
    const name = getLangText(item.name, "en").toLowerCase();
    const cat = getCategoryName(item).toLowerCase();
    return cat.includes("offer") || name.includes("story") || name.includes("shawarma");
  });

  return (preferred.length ? preferred : items || []).slice(0, 3);
}
