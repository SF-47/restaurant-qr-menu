import restaurantConfig from "../config/restaurantConfig";

const STORAGE_KEY = `${restaurantConfig.storageKeyPrefix}-language`;
export const DEFAULT_LANGUAGE = restaurantConfig.defaultLanguage;
export const SUPPORTED_LANGUAGES = ["en", "ar"];

export function isSupportedLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language);
}

export function getStoredLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isSupportedLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    // Storage can be blocked (private mode, strict privacy settings).
    return DEFAULT_LANGUAGE;
  }
}

export function storeLanguage(language) {
  if (typeof window === "undefined" || !isSupportedLanguage(language)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Non-critical: language just won't be remembered.
  }
}

export function getDirection(language) {
  return language === "ar" ? "rtl" : "ltr";
}

export function getOppositeLanguage(language) {
  return language === "ar" ? "en" : "ar";
}
