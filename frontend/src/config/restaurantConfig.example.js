export const restaurantConfig = {
  name: {
    en: "Example Restaurant",
    ar: "مطعم مثال",
  },
  tagline: {
    en: "Fresh food, easy ordering.",
    ar: "طعام طازج وطلب سهل.",
  },
  contact: {
    whatsappNumber: "96170000000",
    instagramUrl: "https://instagram.com/example.restaurant",
    googleMapsUrl: "https://maps.app.goo.gl/example",
  },
  opening: {
    days: {
      en: "Monday - Sunday",
      ar: "الإثنين - الأحد",
    },
    hours: {
      en: "10:00 AM - 11:00 PM",
      ar: "10:00 صباحًا - 11:00 مساءً",
    },
  },
  currencyLabel: "LBP",
  defaultLanguage: "en",
  assets: {
    logo: "/logo.jpg",
    promoImages: ["/promo-1.jpg", "/promo-2.jpg", "/promo-3.jpg"],
  },
  marketing: {
    promoText: {
      en: "Fresh favorites prepared daily.",
      ar: "أطباق طازجة يوميًا.",
    },
    featuredAlt: {
      en: "Featured restaurant food photos",
      ar: "صور أطباق المطعم",
    },
    featuredKeywords: ["offer", "special", "popular"],
  },
  theme: {
    colorNames: ["primary", "accent", "background", "text"],
    notes: "Update frontend/tailwind.config.js if the client needs custom colors.",
  },
  menu: {
    categoryOrder: ["Offers", "Sandwiches", "Platters", "Sides", "Drinks"],
    endCategories: ["Sides", "Drinks"],
  },
  storageKeyPrefix: "example-restaurant",
};

export default restaurantConfig;
