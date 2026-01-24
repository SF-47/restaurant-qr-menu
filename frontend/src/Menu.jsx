import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import "./Menu.css";
import logoImg from "./assets/logo.jpg";

const WHATSAPP_NUMBER = "81821171";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "menuItems"));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    load();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(items.map((i) => i.category).filter(Boolean))],
    [items],
  );

  const filtered =
    category === "All" ? items : items.filter((i) => i.category === category);

  return (
    <div className="menuPage">
      <div className="menuHeader">
        <div className="logoContainer">
          <img src={logoImg} alt="Story Shawarma" className="logoImg" />
        </div>

        <h1 className="menuTitle">Story Shawarma</h1>

        <div className="categoryRow">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`categoryBtn ${
                category === c ? "categoryBtnActive" : ""
              }`}
              type="button"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="emptyState">No items in this category.</div>
      ) : (
        <div className="itemsGrid">
          {filtered.map((item) => (
            <div key={item.id} className="itemCard">
              <div className="itemTop">
                <div className="itemNames">
                  <p className="itemNameEn">{item.name?.en}</p>
                  <p className="itemNameAr">{item.name?.ar}</p>
                </div>

                {item.price > 0 && (
                  <span className="itemPrice">{item.price}</span>
                )}
              </div>

              {item.description ? (
                <p className="itemDesc">{item.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <a className="whatsAppBtn" href={`https://wa.me/${WHATSAPP_NUMBER}`}>
        Order on WhatsApp
      </a>
    </div>
  );
}
