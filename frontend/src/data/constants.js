import restaurantConfig from "../config/restaurantConfig";

export const BRAND_NAME = restaurantConfig.name.en;
export const WHATSAPP_NUMBER = restaurantConfig.contact.whatsappNumber;
export const INSTAGRAM_URL = restaurantConfig.contact.instagramUrl;
export const MAPS_URL = restaurantConfig.contact.googleMapsUrl;

export const CATEGORY_ORDER = restaurantConfig.menu.categoryOrder;

export const END_CATEGORIES = restaurantConfig.menu.endCategories;

export const ASSETS = {
  logo: restaurantConfig.assets.logo,
  sliderImages: restaurantConfig.assets.promoImages,
};

export const OPENING_HOURS = {
  days: restaurantConfig.opening.days.en,
  hours: restaurantConfig.opening.hours.en,
};

export const ADMIN_EMPTY_DRAFT = {
  id: null,
  name: { en: "", ar: "" },
  category: { en: "", ar: "" },
  price: 0,
  order: 1,
  available: true,
};
