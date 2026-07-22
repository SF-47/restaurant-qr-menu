import logoImg from "../assets/logo.jpg";

import s1 from "../assets/images_for_slide/s1.jpeg";
import s2 from "../assets/images_for_slide/s2.jpeg";
import s9 from "../assets/images_for_slide/s9.jpg";
import s10 from "../assets/images_for_slide/s10.jpg";

export const restaurantConfig = {
  name: {
    en: "Shawarma Story",
  },
  tagline: {
    en: "Fresh shawarma, fast pickup.",
    ar: "شاورما طازجة وطلبات سريعة.",
  },
  contact: {
    whatsappNumber: "78771076",
    instagramUrl: "https://instagram.com/shawarma.story1/",
    googleMapsUrl: "https://maps.app.goo.gl/Ju8rKTrz2VZzXj2P7?g_st=aw",
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
    logo: logoImg,
    promoImages: [s2, s1, s9, s10],
  },
  marketing: {
    promoText: {
      en: "Authentic shawarma, crispy fries, garlic sauce.",
      ar: "شاورما أصلية، بطاطا مقرمشة، وثوم شهي.",
    },
    featuredAlt: {
      en: "Featured shawarma and Lebanese street food",
      ar: "صور شاورما ومأكولات لبنانية",
    },
    featuredKeywords: ["offer", "story", "shawarma"],
  },
  theme: {
    colorNames: ["primary", "teal", "gold", "orange", "cream", "charcoal"],
    notes:
      "Theme colors are defined in frontend/tailwind.config.js and used throughout the public menu and admin UI.",
  },
  menu: {
    categoryOrder: [
      "Offers",
      "Shawarma",
      "Meals",
      "Chicken",
      "Sandwiches",
      "Burgers",
      "Doner",
      "Zinger",
      "Potato",
      "Shawarma (Kilo)",
      "Appetizers",
      "Drinks",
    ],
    endCategories: ["Appetizers", "Drinks"],
  },
  storageKeyPrefix: "shawarma-story",
};

export default restaurantConfig;
