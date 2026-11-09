// Sample data for the public admin demo (/admin-demo). Not the live menu.
// One visible item is deliberately broken so the "Needs fixing" check is visible.

const item = (id, en, ar, catEn, catAr, price, order, extra = {}) => ({
  id,
  name: { en, ar },
  category: { en: catEn, ar: catAr },
  description: { en: "", ar: "" },
  price,
  order,
  available: true,
  ...extra,
});

export const DEMO_MENU = [
  item("d1", "Family Shawarma Box", "بوكس شاورما عائلي", "Offers", "عروض", 1700000, 1, {
    description: { en: "2 chicken, 2 beef wraps and large fries", ar: "2 دجاج، 2 لحم وبطاطا كبيرة" },
  }),
  item("d2", "Medium Fries Box", "علبة بطاطا وسط", "Offers", "عروض", 300000, 2),
  item("d3", "Chicken Shawarma", "شاورما دجاج", "Shawarma", "شاورما", 350000, 1, {
    description: { en: "Garlic sauce, pickles, fries", ar: "ثوم، مخلل، بطاطا" },
  }),
  item("d4", "Beef Shawarma", "شاورما لحمة", "Shawarma", "شاورما", 400000, 2),
  item("d5", "Turkish Beef Shawarma", "شاورما لحمة تركي", "Shawarma", "شاورما", 550000, 3),
  item("d6", "Chicken Shawarma Meal", "وجبة شاورما دجاج", "Meals", "وجبات", 500000, 1),
  item("d7", "Beef Shawarma Meal", "وجبة شاورما لحمة", "Meals", "وجبات", 600000, 2),
  // Deliberate mistake: Arabic typed into the English field.
  item("d8", "وجبة كريسبي", "", "Meals", "وجبات", 650000, 3),
  item("d9", "Classic Burger", "برغر كلاسيك", "Burgers", "برغر", 450000, 1),
  item("d10", "Zinger Sandwich", "سندويش زنجر", "Zinger", "زنجر", 420000, 1),
  item("d11", "Hummus", "حمص", "Appetizers", "مقبلات", 200000, 1),
  item("d12", "Fattoush", "فتوش", "Appetizers", "مقبلات", 300000, 2, { available: false }),
  item("d13", "Pepsi", "بيبسي", "Drinks", "مشروبات", 80000, 1),
  item("d14", "Ayran", "عيران", "Drinks", "مشروبات", 100000, 2),
];
