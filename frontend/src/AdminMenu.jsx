import { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import "./AdminMenu.css";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

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
  CATEGORY_ORDER.map((name, idx) => [catKey(name), idx]),
);

function getLangText(value, lang = "en") {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return value?.[lang] ?? "";
  return "";
}

function toNum(v, fallback = 0) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v) || fallback;
  return fallback;
}

function normalizeCategory(cat) {
  // Firestore might have string or {en, ar}
  const en = getLangText(cat, "en") || (typeof cat === "string" ? cat : "");
  const ar = getLangText(cat, "ar");
  return { en: en.trim(), ar: (ar || "").trim() };
}

function normalizeTextObj(v) {
  // ensure {en, ar}
  if (!v) return { en: "", ar: "" };
  if (typeof v === "string") return { en: v, ar: "" };
  if (typeof v === "object") return { en: v.en || "", ar: v.ar || "" };
  return { en: "", ar: "" };
}

function makeCategoriesFromItems(items) {
  const map = new Map();

  // collect categories from items (use normalized key to avoid "Offers" vs "offers")
  items.forEach((s) => {
    const c = normalizeCategory(s.category);
    const key = catKey(c.en);
    if (!key) return;

    // keep first seen display values
    if (!map.has(key)) map.set(key, { en: c.en.trim(), ar: c.ar.trim() });
  });

  const list = Array.from(map.values());

  // sort by CATEGORY_INDEX (preferred order), then alphabetically
  list.sort((a, b) => {
    const ai = CATEGORY_INDEX.get(catKey(a.en)) ?? 999999;
    const bi = CATEGORY_INDEX.get(catKey(b.en)) ?? 999999;

    if (ai !== bi) return ai - bi;
    return a.en.localeCompare(b.en);
  });

  return list;
}

function computeNextOrderFillGaps(items) {
  const used = new Set();

  for (const it of items || []) {
    const n = toNum(it.order, 0);
    if (Number.isInteger(n) && n > 0) used.add(n);
  }

  let candidate = 1;
  while (used.has(candidate)) candidate++;
  return candidate;
}


/** Simple modal */
function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="amodalOverlay" role="dialog" aria-modal="true">
      <div className="amodal">
        <div className="amodalHeader">
          <h3 className="amodalTitle">{title}</h3>
          <button
            className="amodalClose"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="amodalBody">{children}</div>
      </div>
    </div>
  );
}

/** Combobox-ish: searchable dropdown + pick existing + quick add */
/** Combobox: searchable dropdown + allow typing new category */
function CategoryCombo({ categories, value, onTypeEn, onPickObj }) {
  const [open, setOpen] = useState(false);

  const text = value?.en || "";

  const filtered = useMemo(() => {
    const q = (text || "").toLowerCase().trim();
    if (!q) return categories;
    return categories.filter((c) => (c.en || "").toLowerCase().includes(q));
  }, [categories, text]);

  function pick(c) {
    onPickObj?.(c);
    setOpen(false);
  }

  function commitTyped() {
    const en = (text || "").trim();
    if (!en) return;

    const existing = categories.find((c) => catKey(c.en) === catKey(en));
    if (existing) {
      pick(existing);
      return;
    }

    // new category (AR empty for now)
    onPickObj?.({ en, ar: "" });
    setOpen(false);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitTyped();
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="combo">
      <div className="comboTop">
        <input
          className="ainput"
          value={text}
          placeholder="Pick or type category"
          onChange={(e) => {
            onTypeEn?.(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />

        <button
          className="abtn abtnGhost"
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle categories"
        >
          ▾
        </button>
      </div>

      {open ? (
        <div className="comboList">
          {text.trim() ? (
            <button
              className="comboItem comboCreate"
              type="button"
              onClick={commitTyped}
            >
              <div className="comboEn">Use: {text.trim()}</div>
              <div className="comboAr">(new category)</div>
            </button>
          ) : null}

          {filtered.map((c) => (
            <button
              key={c.en}
              className="comboItem"
              type="button"
              onClick={() => pick(c)}
            >
              <div className="comboEn">{c.en}</div>
              {c.ar ? <div className="comboAr">{c.ar}</div> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const emptyDraft = {
  id: null,
  name: { en: "", ar: "" },
  description: { en: "", ar: "" },
  category: { en: "", ar: "" },
  price: 0,
  order: 1,
  available: true,
};

function LoginGate({ children }) {
  const auth = getAuth();

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, [auth]);

  async function login(e) {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setEmail("");
      setPass("");
    } catch (e) {
      console.error(e);
      setErr("Login failed. Check email/password.");
    }
  }

  async function logout() {
    setErr("");
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
      setErr("Logout failed.");
    }
  }

  // Loading auth state
  if (checking) {
    return (
      <div className="adminPage">
        <div className="adminEmpty">Checking login…</div>
      </div>
    );
  }

  // Not logged in -> login screen
  if (!user) {
    return (
      <div className="adminPage">
        <div className="adminTopbar">
          <div className="adminTitle">
            <h1>Admin Login</h1>
            <p>Sign in to manage menu items.</p>
          </div>
        </div>

        {err ? <div className="adminEmpty">{err}</div> : null}

        <form
          onSubmit={login}
          style={{
            maxWidth: 420,
            margin: "0 auto",
            display: "grid",
            gap: 10,
          }}
        >
          <input
            className="ainput"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="ainput"
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button className="abtn" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }

  // Logged in -> show logout + admin UI
  return (
    <>
      <div className="adminTopbar" style={{ marginBottom: 10 }}>
        <div className="adminTitle">
          <h1>Menu Admin</h1>
          <p>Logged in</p>
        </div>

        <div className="adminActions">
          <button className="abtn abtnGhost" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {children}
    </>
  );
}

export default function AdminMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (u) => setUser(u));
    return () => unsub();
  }, []);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // view controls
  // eslint-disable-next-line no-unused-vars
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showUnavailable, setShowUnavailable] = useState(true);

  // modal controls
  const [modal, setModal] = useState({ open: false, mode: "add" }); // add | edit | delete
  const [draft, setDraft] = useState(emptyDraft);

  async function load() {
    setLoading(true);
    try {
      setErr("");
      const snap = await getDocs(collection(db, "menuItems"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
    } catch (e) {
      console.error(e);
      setErr("Could not load items.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) return; // ✅ wait for login
    load();
  }, [user]);

  const categories = useMemo(() => makeCategoriesFromItems(items), [items]);

  const filtered = useMemo(() => {
    const query = (q || "").toLowerCase().trim();

    return items
      .filter((it) => (showUnavailable ? true : it.available !== false))
      .filter((it) => {
        const catEn = normalizeCategory(it.category).en;
        if (catFilter === "All") return true;
        return catEn === catFilter;
      })
      .filter((it) => {
        if (!query) return true;
        const nEn = getLangText(it.name, "en").toLowerCase();
        const nAr = getLangText(it.name, "ar");
        const dEn = getLangText(it.description, "en").toLowerCase();
        const catEn = normalizeCategory(it.category).en.toLowerCase();
        return (
          nEn.includes(query) ||
          dEn.includes(query) ||
          catEn.includes(query) ||
          (nAr || "").includes(q)
        );
      })
      .slice()
      .sort((a, b) => {
        const aCatRaw = normalizeCategory(a.category).en;
        const bCatRaw = normalizeCategory(b.category).en;

        const aKey = catKey(aCatRaw);
        const bKey = catKey(bCatRaw);

        const ai = CATEGORY_INDEX.has(aKey) ? CATEGORY_INDEX.get(aKey) : 999999;
        const bi = CATEGORY_INDEX.has(bKey) ? CATEGORY_INDEX.get(bKey) : 999999;

        // category priority first
        if (ai !== bi) return ai - bi;

        // same category -> item order
        const ao = toNum(a.order, 999999);
        const bo = toNum(b.order, 999999);
        if (ao !== bo) return ao - bo;

        // final tie-breaker: name
        return getLangText(a.name, "en").localeCompare(
          getLangText(b.name, "en"),
        );
      });
  }, [items, q, catFilter, showUnavailable]);

  function openAdd() {
    const defaultCat = categories[0]?.en || "";
    const next = computeNextOrderFillGaps(items);

    setDraft({
      ...emptyDraft,
      category: {
        en: defaultCat,
        ar: categories.find((c) => c.en === defaultCat)?.ar || "",
      },
      order: next, // ✅ global order
      available: true,
    });

    setModal({ open: true, mode: "add" });
  }

  function openEdit(item) {
    const cat = normalizeCategory(item.category);
    setDraft({
      id: item.id,
      name: normalizeTextObj(item.name),
      description: normalizeTextObj(item.description),
      category: cat,
      price: toNum(item.price, 0),
      order: toNum(item.order, 1),
      available: item.available !== false,
    });
    setModal({ open: true, mode: "edit" });
  }

  function openDelete(item) {
    setDraft({ ...draft, id: item.id, name: normalizeTextObj(item.name) });
    setModal({ open: true, mode: "delete" });
  }

  function closeModal() {
    setModal({ open: false, mode: "add" });
    setDraft(emptyDraft);
  }

  function setField(path, value) {
    // path examples: "name.en" , "category.en"
    setDraft((d) => {
      const copy = structuredClone(d);
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  }

  async function save() {
    const payload = {
      name: {
        en: (draft.name.en || "").trim(),
        ar: (draft.name.ar || "").trim(),
      },
      description: {
        en: (draft.description.en || "").trim(),
        ar: (draft.description.ar || "").trim(),
      },
      category: {
        en: (draft.category.en || "").trim(),
        ar: (draft.category.ar || "").trim(),
      },
      price: toNum(draft.price, 0),
      order: toNum(draft.order, 1),
      available: !!draft.available,
      updatedAt: serverTimestamp(),
    };

    // minimal validation
    if (!payload.name.en) {
      alert("Name (EN) is required.");
      return;
    }
    if (!payload.category.en) {
      alert("Category (EN) is required.");
      return;
    }

    try {
      if (modal.mode === "add") {
        await addDoc(collection(db, "menuItems"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      } else if (modal.mode === "edit" && draft.id) {
        await updateDoc(doc(db, "menuItems", draft.id), payload);
      }
      await load();
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Save failed. Check console.");
    }
  }

  async function remove() {
    if (!draft.id) return;
    try {
      await deleteDoc(doc(db, "menuItems", draft.id));
      await load();
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Delete failed. Check console.");
    }
  }

  return (
    <LoginGate>
      <div className="adminPage">
        <div className="adminTopbar">
          <div className="adminTitle">
            <h1>Menu Admin</h1>
            <p>CRUD panel for Firestore “menuItems”.</p>
          </div>

          <div className="adminActions">
            <button className="abtn" type="button" onClick={openAdd}>
              + Add Item
            </button>
            <button
              className="abtn abtnGhost"
              type="button"
              onClick={load}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="adminFilters">
          <select
            className="aselect"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c.en} value={c.en}>
                {c.en}
              </option>
            ))}
          </select>

          <label className="acheck">
            <input
              type="checkbox"
              checked={showUnavailable}
              onChange={(e) => setShowUnavailable(e.target.checked)}
            />
            Show unavailable
          </label>
        </div>

        {loading ? (
          <div className="adminEmpty">Loading…</div>
        ) : err ? (
          <div className="adminEmpty">{err}</div>
        ) : filtered.length === 0 ? (
          <div className="adminEmpty">No items found.</div>
        ) : (
          <div className="adminGrid">
            {filtered.map((it) => {
              const cat = normalizeCategory(it.category);
              const nameEn = getLangText(it.name, "en");
              const nameAr = getLangText(it.name, "ar");
              const price = toNum(it.price, 0);
              const order = toNum(it.order, 1);
              const available = it.available !== false;

              return (
                <div
                  className={`adminCard ${available ? "" : "adminCardDisabled"}`}
                  key={it.id}
                >
                  <div className="adminCardTop">
                    <div className="adminCardNames">
                      <div className="adminNameEn">{nameEn}</div>
                      {nameAr ? (
                        <div className="adminNameAr">{nameAr}</div>
                      ) : null}
                      <div className="adminMeta">
                        <span className="pill">{cat.en || "—"}</span>
                        <span className="pill">Order: {order}</span>
                        {price ? (
                          <span className="pill">Price: {price}</span>
                        ) : (
                          <span className="pill">Price: —</span>
                        )}
                        <span
                          className={`pill ${available ? "pillOk" : "pillBad"}`}
                        >
                          {available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>

                    <div className="adminCardBtns">
                      <button
                        className="abtnSmall"
                        type="button"
                        onClick={() => openEdit(it)}
                      >
                        Edit
                      </button>
                      <button
                        className="abtnSmall abtnDanger"
                        type="button"
                        onClick={() => openDelete(it)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {getLangText(it.description, "en") ||
                  getLangText(it.description, "ar") ? (
                    <div className="adminDesc">
                      <div>{getLangText(it.description, "en")}</div>
                      {getLangText(it.description, "ar") ? (
                        <div className="adminDescAr">
                          {getLangText(it.description, "ar")}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {/* ADD / EDIT */}
        <Modal
          open={modal.open && (modal.mode === "add" || modal.mode === "edit")}
          title={modal.mode === "add" ? "Add Item" : "Edit Item"}
          onClose={closeModal}
        >
          <div className="formGrid">
            <div className="field">
              <label>Name (EN) *</label>
              <input
                className="ainput"
                value={draft.name.en}
                onChange={(e) => setField("name.en", e.target.value)}
              />
            </div>

            <div className="field">
              <label>Name (AR)</label>
              <input
                className="ainput"
                value={draft.name.ar}
                onChange={(e) => setField("name.ar", e.target.value)}
                dir="rtl"
              />
            </div>

            <div className="field">
              <label>Description (EN)</label>
              <textarea
                className="atextarea"
                value={draft.description.en}
                onChange={(e) => setField("description.en", e.target.value)}
              />
            </div>

            <div className="field">
              <label>Description (AR)</label>
              <textarea
                className="atextarea"
                value={draft.description.ar}
                onChange={(e) => setField("description.ar", e.target.value)}
                dir="rtl"
              />
            </div>

            <div className="field">
              <label>Category (combobox) *</label>
              <CategoryCombo
                categories={categories}
                value={draft.category}
                onTypeEn={(v) => {
                  setField("category.en", v);
                  // optional: clear Arabic while typing a new category
                  // setField("category.ar", "");
                }}
                onPickObj={(obj) => {
                  setField("category.en", obj.en);
                  setField("category.ar", obj.ar || "");
                }}
              />

              <div className="hint">
                Tip: type a new category name then click “Use …”.
              </div>
            </div>

            <div className="field">
              <label>Category (AR)</label>
              <input
                className="ainput"
                value={draft.category.ar}
                onChange={(e) => setField("category.ar", e.target.value)}
                dir="rtl"
              />
            </div>

            <div className="field">
              <label>Price</label>
              <input
                className="ainput"
                type="number"
                inputMode="decimal"
                value={draft.price}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, price: toNum(e.target.value, 0) }))
                }
              />
            </div>

            <div className="field">
              <label>Order (default auto)</label>
              <input
                className="ainput"
                type="number"
                inputMode="numeric"
                value={draft.order}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, order: toNum(e.target.value, 1) }))
                }
              />
            </div>

            <div className="field inline">
              <label className="acheck">
                <input
                  type="checkbox"
                  checked={!!draft.available}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, available: e.target.checked }))
                  }
                />
                Available
              </label>
            </div>
          </div>

          <div className="modalFooter">
            <button
              className="abtn abtnGhost"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button className="abtn" type="button" onClick={save}>
              Save
            </button>
          </div>
        </Modal>

        {/* DELETE */}
        <Modal
          open={modal.open && modal.mode === "delete"}
          title="Delete item?"
          onClose={closeModal}
        >
          <p>
            This will permanently delete:{" "}
            <b>{draft.name?.en || "Unknown item"}</b>
          </p>
          <div className="modalFooter">
            <button
              className="abtn abtnGhost"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button className="abtn abtnDanger" type="button" onClick={remove}>
              Delete
            </button>
          </div>
        </Modal>
      </div>
    </LoginGate>
  );
}
