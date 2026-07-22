import logoImg from "../assets/logo.jpg";

import s1 from "../assets/images_for_slide/s1.jpeg";
import s2 from "../assets/images_for_slide/s2.jpeg";
// import s5 from "../assets/images_for_slide/s5.jpeg";
// import s8 from "../assets/images_for_slide/s8.jpeg";
import s9 from "../assets/images_for_slide/s9.jpg";
import s10 from "../assets/images_for_slide/s10.jpg";

export const BRAND_NAME = "Shawarma Story";
export const WHATSAPP_NUMBER = "78771076";
export const INSTAGRAM_URL = "https://instagram.com/shawarma.story1/";
export const MAPS_URL = "https://maps.app.goo.gl/Ju8rKTrz2VZzXj2P7?g_st=aw";

export const CATEGORY_ORDER = [
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
];

export const END_CATEGORIES = ["Appetizers", "Drinks"];

export const ASSETS = {
  logo: logoImg,
  sliderImages: [s2, s1, s9, s10],
};

export const OPENING_HOURS = {
  days: "Monday - Sunday",
  hours: "10:00 AM - 11:00 PM",
};

export const ADMIN_EMPTY_DRAFT = {
  id: null,
  name: { en: "", ar: "" },
  category: { en: "", ar: "" },
  price: 0,
  order: 1,
  available: true,
};
