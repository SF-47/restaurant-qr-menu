import restaurantConfig from "../config/restaurantConfig";

export const translations = {
  en: {
    whatsapp: "WhatsApp",
    location: "Location",
    menu: "Menu",
    all: "All",
    orderFresh: "Fresh Order",
    menuHint: "Pick a category and add items to your cart.",
    orderThisItem: "Order this item",
    addToCart: "Add to Cart",
    added: "Added",
    cart: "Cart",
    yourOrder: "Your Order",
    quantity: "Quantity",
    remove: "Remove",
    clearCart: "Clear Cart",
    orderOnWhatsApp: "Order on WhatsApp",
    total: "Total",
    customerNote: "Customer note",
    notePlaceholder: "Add a note, for example no pickles",
    cartEmpty: "Your cart is empty",
    continueBrowsing: "Continue browsing",
    openInMaps: "Open in Maps",
    instagram: "Instagram",
    openingHours: "Opening Hours",
    readyToOrder: "Ready to order?",
    contactHint: "Contact us on WhatsApp or visit our location.",
    noItems: "No items available in this category.",
    loadingMenu: "Loading menu...",
    loadFailed: "Failed to load menu. Please try again.",
    freshDaily: "Fresh Daily",
    maps: "Maps",
    noteLabel: "Note:",
  },
  ar: {
    whatsapp: "واتساب",
    location: "الموقع",
    menu: "القائمة",
    all: "الكل",
    orderFresh: "طلب طازج",
    menuHint: "اختر التصنيف وأضف الأصناف إلى السلة.",
    orderThisItem: "اطلب هذا الصنف",
    addToCart: "أضف إلى السلة",
    added: "تمت الإضافة",
    cart: "السلة",
    yourOrder: "طلبك",
    quantity: "الكمية",
    remove: "إزالة",
    clearCart: "تفريغ السلة",
    orderOnWhatsApp: "اطلب عبر واتساب",
    total: "المجموع",
    customerNote: "ملاحظة للطلب",
    notePlaceholder: "أضف ملاحظة مثل بدون مخلل",
    cartEmpty: "السلة فارغة",
    continueBrowsing: "تابع التصفح",
    openInMaps: "افتح الخريطة",
    instagram: "إنستغرام",
    openingHours: "أوقات العمل",
    days: "الإثنين - الأحد",
    hours: "10:00 صباحًا - 11:00 مساءً",
    readyToOrder: "جاهز للطلب؟",
    contactHint: "تواصل معنا عبر واتساب أو زر موقعنا.",
    noItems: "لا توجد أصناف متاحة في هذا التصنيف.",
    loadingMenu: "جارٍ تحميل القائمة...",
    loadFailed: "تعذر تحميل القائمة. حاول مرة أخرى.",
    freshDaily: "طازج يوميًا",
    maps: "الخريطة",
    noteLabel: "ملاحظة:",
  },
};

export function getTranslations(language) {
  const selected = translations[language] || translations.en;
  const lang = translations[language] ? language : "en";
  const restaurantName = restaurantConfig.name[lang] || restaurantConfig.name.en;

  return {
    ...selected,
    brandName: restaurantName,
    tagline: restaurantConfig.tagline[lang] || restaurantConfig.tagline.en,
    days: restaurantConfig.opening.days[lang] || restaurantConfig.opening.days.en,
    hours: restaurantConfig.opening.hours[lang] || restaurantConfig.opening.hours.en,
    promoText:
      restaurantConfig.marketing.promoText[lang] ||
      restaurantConfig.marketing.promoText.en,
    featuredAlt:
      restaurantConfig.marketing.featuredAlt[lang] ||
      restaurantConfig.marketing.featuredAlt.en,
    generalWhatsAppMessage:
      lang === "ar"
        ? `مرحبًا، أريد الطلب من ${restaurantName}.`
        : `Hello, I want to order from ${restaurantName}.`,
    cartWhatsAppIntro:
      lang === "ar"
        ? `مرحبًا ${restaurantName}، أريد طلب:`
        : `Hello ${restaurantName}, I want to order:`,
  };
}
