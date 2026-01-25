import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const categoryMap = {
  Shawarma: { en: "Shawarma", ar: "شاورما" },
  Doner: { en: "Doner", ar: "دونر" },
  Meals: { en: "Meals", ar: "وجبات" },
  "Shawarma (Kilo)": { en: "Shawarma (Kilo)", ar: "شاورما (كيلو)" },
  Burgers: { en: "Burgers", ar: "برغر" },
  Zinger: { en: "Zinger", ar: "زنجر" },
  Potato: { en: "Potato", ar: "بطاطا" },
  Tawouk: { en: "Tawouk", ar: "طاووق" },
  Crispy: { en: "Crispy", ar: "كريسبي" },
  Sandwiches: { en: "Sandwiches", ar: "سندويشات" },
  Chicken: { en: "Chicken", ar: "فروج" },
  "Grilled Chicken": { en: "Grilled Chicken", ar: "فروج مشوي" },
  Appetizers: { en: "Appetizers", ar: "مقبلات" },
  Drinks: { en: "Drinks", ar: "مشروبات" },
};

const menuItems = [
  { name: { en: "Chicken Sandwich", ar: "سندويش فروج" }, category: "Chicken", price: 150, description: "", imageUrl: "", available: true, order: 78 },
  { name: { en: "Chicken Sandwich with Rice", ar: "سندويش فروج مع رز" }, category: "Chicken", price: 250, description: "", imageUrl: "", available: true, order: 79 },
  { name: { en: "Chicken Sandwich with Salad", ar: "سندويش فروج مع سلطة" }, category: "Chicken", price: 350, description: "", imageUrl: "", available: true, order: 80 },
  { name: { en: "Special Chicken Sandwich", ar: "سندويش فروج سبيشل" }, category: "Chicken", price: 300, description: "", imageUrl: "", available: true, order: 81 },

  { name: { en: "Medium Chicken Shawarma", ar: "شاورما دجاج وسط" }, category: "Shawarma", price: 270, description: "", imageUrl: "", available: true, order: 82 },
  { name: { en: "Medium Beef Shawarma", ar: "شاورما لحمة وسط" }, category: "Shawarma", price: 330, description: "", imageUrl: "", available: true, order: 83 },

  { name: { en: "Chicken Shawarma Meal with Fries", ar: "وجبة شاورما دجاج مع بطاطا" }, category: "Meals", price: 400, description: "", imageUrl: "", available: true, order: 84 },
  { name: { en: "Beef Shawarma Meal with Fries", ar: "وجبة شاورما لحمة مع بطاطا" }, category: "Meals", price: 500, description: "", imageUrl: "", available: true, order: 85 },
  { name: { en: "Story Shawarma Box", ar: "شاورما ستوري بوكس" }, category: "Meals", price: 0, description: "", imageUrl: "", available: true, order: 86 },

  { name: { en: "Fish Burger", ar: "برغر سمك" }, category: "Burgers", price: 0, description: "", imageUrl: "", available: true, order: 87 },
  { name: { en: "Honey Mustard Burger", ar: "برغر هاني ماسترد" }, category: "Burgers", price: 0, description: "", imageUrl: "", available: true, order: 88 },
  { name: { en: "Double Cheese Burger", ar: "دبل تشيز برغر" }, category: "Burgers", price: 0, description: "", imageUrl: "", available: true, order: 89 },
  { name: { en: "Sujuk Burger", ar: "برغر سجق" }, category: "Burgers", price: 400, description: "", imageUrl: "", available: true, order: 90 },
  { name: { en: "Beef Burger", ar: "برغر لحمة" }, category: "Burgers", price: 0, description: "", imageUrl: "", available: true, order: 91 },
  { name: { en: "Escalope Burger", ar: "برغر اسكالوب" }, category: "Burgers", price: 400, description: "", imageUrl: "", available: true, order: 92 },
  { name: { en: "Lebanese Burger", ar: "برغر لبناني" }, category: "Burgers", price: 250, description: "", imageUrl: "", available: true, order: 93 },

  { name: { en: "Cheese Zinger", ar: "زنجر جبنة" }, category: "Zinger", price: 400, description: "", imageUrl: "", available: true, order: 104 },
  { name: { en: "Habash Zinger", ar: "زنجر حبش" }, category: "Zinger", price: 450, description: "", imageUrl: "", available: true, order: 106 },
  { name: { en: "Story Zinger", ar: "ستوري زنجر" }, category: "Zinger", price: 450, description: "", imageUrl: "", available: true, order: 107 },

  { name: { en: "Small Fries Sandwich", ar: "سندويش بطاطا صغير" }, category: "Potato", price: 100, description: "", imageUrl: "", available: true, order: 108 },
  { name: { en: "Medium Fries Sandwich", ar: "سندويش بطاطا وسط" }, category: "Potato", price: 180, description: "", imageUrl: "", available: true, order: 109 },
  { name: { en: "Large Fries Sandwich", ar: "سندويش بطاطا كبير" }, category: "Potato", price: 220, description: "", imageUrl: "", available: true, order: 110 },

  { name: { en: "Salad", ar: "سلطة" }, category: "Appetizers", price: 0, description: "", imageUrl: "", available: true, order: 111 },
  { name: { en: "Grape Leaves", ar: "ورق عنب" }, category: "Appetizers", price: 0, description: "", imageUrl: "", available: true, order: 112 },
  { name: { en: "Mayonnaise Salad", ar: "سلطة ميونيز" }, category: "Appetizers", price: 0, description: "", imageUrl: "", available: true, order: 113 },

  { name: { en: "Pepsi 1.25L", ar: "بيبسي لتر وربع" }, category: "Drinks", price: 130, description: "", imageUrl: "", available: true, order: 114 },
  { name: { en: "Pepsi Plastic (Small)", ar: "بيبسي بلاستيك صغير" }, category: "Drinks", price: 60, description: "", imageUrl: "", available: true, order: 115 },
  { name: { en: "Laban", ar: "لبن" }, category: "Drinks", price: 60, description: "", imageUrl: "", available: true, order: 116 },
  { name: { en: "Pepsi Can", ar: "بيبسي تنك" }, category: "Drinks", price: 80, description: "", imageUrl: "", available: true, order: 117 },
  { name: { en: "Small Water", ar: "مياه صغيرة" }, category: "Drinks", price: 30, description: "", imageUrl: "", available: true, order: 118 },
  { name: { en: "Large Water", ar: "مياه كبيرة" }, category: "Drinks", price: 40, description: "", imageUrl: "", available: true, order: 119 }
];

function normalizeItem(item) {
  const cat = categoryMap[item.category];
  if (!cat) throw new Error(`Unknown category key: "${item.category}"`);
  return { ...item, category: { en: cat.en, ar: cat.ar } };
}

async function run() {
  const seen = new Set();
  for (const it of menuItems) {
    if (seen.has(it.order)) throw new Error(`Duplicate order in script: ${it.order}`);
    seen.add(it.order);
  }

  const batch = db.batch();
  for (const item of menuItems) {
    const normalized = normalizeItem(item);
    const docId = `order_${normalized.order}`;
    batch.set(db.collection("menuItems").doc(docId), normalized, { merge: true });
    console.log(`Upsert queued: ${normalized.order} - ${normalized.name.en}`);
  }

  await batch.commit();
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
