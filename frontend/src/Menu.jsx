import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./Menu.css";
import logoImg from "./assets/logo.jpg";

const WHATSAPP_NUMBER = "78771076";

// Helper: safely read bilingual text or fallback to string
function getLangText(value, lang = "en") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value?.[lang] ?? "";
  return "";
}

export default function Menu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("All"); // keep EN key for logic
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const snap = await getDocs(collection(db, "menuItems"));
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Firestore load failed:", e);
        setItems([]);
        setError(
          "Could not load menu items. If you use an adblocker, allow firestore.googleapis.com and reload.",
        );
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

  // Build unique categories from AVAILABLE items only
  const categories = useMemo(() => {
    const map = new Map();

    availableItems.forEach((item) => {
      const en =
        getLangText(item.category, "en") ||
        (typeof item.category === "string" ? item.category : "");
      const ar = getLangText(item.category, "ar");

      if (en && !map.has(en)) {
        map.set(en, { en, ar });
      }
    });

    return [{ en: "All", ar: "الكل" }, ...Array.from(map.values())];
  }, [availableItems]);

  // Filter by EN key from AVAILABLE items only
  const filtered =
    category === "All"
      ? availableItems
      : availableItems.filter((i) => {
          const en =
            getLangText(i.category, "en") ||
            (typeof i.category === "string" ? i.category : "");
          return en === category;
        });

  return (
    <div className="menuPage">
      <div className="menuHeader">
        <div className="logoContainer">
          <img src={logoImg} alt="Shawarma Story" className="logoImg" />
        </div>

        <h1 className="menuTitle">Shawarma Story</h1>

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
      </div>

      {error ? <div className="emptyState">{error}</div> : null}

      {!error && filtered.length === 0 ? (
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

                  {price > 0 ? <span className="itemPrice">{price}</span> : null}
                </div>

                {descEn || descAr ? (
                  <p className="itemDesc">
                    {descEn}
                    {descAr ? <span className="itemDescAr"> {descAr}</span> : null}
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
