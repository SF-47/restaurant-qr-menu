import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./Menu.css";
import logoImg from "./assets/logo.jpg";
import s1 from "./assets/images_for_slide/s1.jpeg";
import s2 from "./assets/images_for_slide/s2.jpeg";
import s3 from "./assets/images_for_slide/s3.jpeg";
import s5 from "./assets/images_for_slide/s5.jpeg";
//import s6 from "./assets/images_for_slide/s6.jpeg";
import s8 from "./assets/images_for_slide/s8.jpeg";



const WHATSAPP_NUMBER = "78771076";

const CATEGORY_ORDER = [
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



function catKey(v) {
  return (v || "").toString().trim().toLowerCase();
}

const CATEGORY_INDEX = new Map(
  CATEGORY_ORDER.map((name, idx) => [catKey(name), idx])
);

function categoryRank(catEn) {
  const key = catKey(catEn);

  // force these always at the end
  if (END_CATEGORIES.map(catKey).includes(key)) return 1_000_000;

  // known categories by your preferred order
  if (CATEGORY_INDEX.has(key)) return CATEGORY_INDEX.get(key);

  // new categories from firebase (not in list) go after known ones
  return 500_000;
}


const END_CATEGORIES = ["Appetizers", "Drinks"];

// Helper: safely read bilingual text or fallback to string
function getLangText(value, lang = "en") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value?.[lang] ?? "";
  return "";
}

function toNum(v) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v) || 0;
  return 0;
}


  

export default function Menu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("All"); // keep EN key for logic
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        setError("");
        const snap = await getDocs(collection(db, "menuItems"));
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Firestore load failed:", e);
        setItems([]);
        setError("Could not load menu items. Please reload.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ✅ Hide items that are not available (available:false)
  // - If "available" is missing (old docs), we treat it as available
  const availableItems = useMemo(
    () => items.filter((item) => item.available !== false),
    [items],
  );

  const categories = useMemo(() => {
  const map = new Map();

  availableItems.forEach((item) => {
    const en =
      getLangText(item.category, "en") ||
      (typeof item.category === "string" ? item.category : "");
    const ar = getLangText(item.category, "ar");

    const key = catKey(en);
    if (!key) return;

    if (!map.has(key)) map.set(key, { en: en.trim(), ar: (ar || "").trim() });
  });

  const list = Array.from(map.values());

  list.sort((a, b) => {
    const ra = categoryRank(a.en);
    const rb = categoryRank(b.en);
    if (ra !== rb) return ra - rb;
    return a.en.localeCompare(b.en);
  });

  return [{ en: "All", ar: "الكل" }, ...list];
}, [availableItems]);



  
  
  const sliderImages = [s3, s2, s1 , s5 , s8]; // or import images
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (sliderImages.length <= 1) return;

    const id = setInterval(() => {
      setSlide((s) => (s + 1) % sliderImages.length);
    }, 1500); // change speed (ms)

    return () => clearInterval(id);
  }, []);

  const filtered =
  category === "All"
    ? availableItems
        .slice()
        .sort((a, b) => {
          const aCat =
            getLangText(a.category, "en") ||
            (typeof a.category === "string" ? a.category : "");
          const bCat =
            getLangText(b.category, "en") ||
            (typeof b.category === "string" ? b.category : "");

          // 1) category order first (Offers first, Appetizers/Drinks last)
          const ra = categoryRank(aCat);
          const rb = categoryRank(bCat);
          if (ra !== rb) return ra - rb;

          // 2) same category -> item order ASC (1,2,3...)
          const ao = toNum(a.order);
          const bo = toNum(b.order);
          if (ao !== bo) return ao - bo;

          // 3) tie breaker
          return getLangText(a.name, "en").localeCompare(getLangText(b.name, "en"));
        })
    : availableItems
        .filter((i) => {
          const en =
            getLangText(i.category, "en") ||
            (typeof i.category === "string" ? i.category : "");
          return en === category;
        })
        .slice()
        .sort((a, b) => toNum(a.order) - toNum(b.order));


  return (
    <div className="menuPage">
      <div className="menuHeader">
        <div className="logoContainer">
          <img src={logoImg} alt="Shawarma Story" className="logoImg" />
        </div>

        <h1 className="menuTitle">Shawarma Story</h1>

        <div className="slider">
          <img className="sliderImg" src={sliderImages[slide]} alt="promo" />
        </div>
      </div>

      <div className="categoryRow">
        {categories.map((c) => (
          <button
            key={c.en}
            onClick={() => setCategory(c.en)}
            className={`categoryBtn ${category === c.en ? "categoryBtnActive" : ""}`}
            type="button"
          >
            <div className="categoryText">
              <div className="categoryEn">{c.en}</div>
              {c.ar ? <div className="categoryAr">{c.ar}</div> : null}
            </div>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="emptyState">
          <div className="spinner"></div>
          Loading menu...
        </div>
      ) : error ? (
        <div className="emptyState">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="emptyState">No items in this category.</div>
      ) : (
        <div className="itemsGrid">
          {filtered.map((item) => {
            const nameEn = getLangText(item.name, "en");
            const nameAr = getLangText(item.name, "ar");

            const descEn =
              getLangText(item.description, "en") ||
              (typeof item.description === "string" ? item.description : "");
            const descAr = getLangText(item.description, "ar");

            const price =
              typeof item.price === "number"
                ? item.price
                : typeof item.price === "string"
                  ? Number(item.price)
                  : 0;

            return (
              <div key={item.id} className="itemCard">
                <div className="itemTop">
                  <div className="itemNames">
                    <p className="itemNameEn">{nameEn}</p>
                    {nameAr ? <p className="itemNameAr">{nameAr}</p> : null}
                    
                  </div>

                  {price > 0 ? (
                    <span className="itemPrice">{price}</span>
                  ) : null}
                </div>

                {descEn || descAr ? (
                  <p className="itemDesc">
                    {descEn}
                    {descAr ? (
                      <span className="itemDescAr"> {descAr}</span>
                    ) : null}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <a
        className="whatsAppBtn"
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
      >
        Order on WhatsApp
      </a>
    </div>
  );
}
