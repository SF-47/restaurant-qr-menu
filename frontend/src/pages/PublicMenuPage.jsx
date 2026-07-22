import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CategoryFilter from "../components/menu/CategoryFilter";
import HeroSection from "../components/menu/HeroSection";
import LocationSection from "../components/menu/LocationSection";
import MenuGrid from "../components/menu/MenuGrid";
import CartDrawer from "../components/cart/CartDrawer";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import SectionTitle from "../components/common/SectionTitle";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { getTranslations } from "../i18n/translations";
import {
  getItemCategoryKey,
  makeCategoriesFromItems,
  sortMenuItems,
} from "../utils/categoryUtils";
import {
  getDirection,
  getStoredLanguage,
  storeLanguage,
} from "../utils/languageUtils";
import {
  addItemToCart,
  getCartItemCount,
  getStoredCart,
  removeCartItem,
  storeCart,
  updateCartQuantity,
} from "../utils/cartUtils";
import { getItemName, getPrice, hasSuspiciousLowPrice } from "../utils/menuUtils";
import restaurantConfig from "../config/restaurantConfig";

export default function PublicMenuPage() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(getStoredCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(getStoredLanguage);
  const t = getTranslations(language);
  const direction = getDirection(language);

  useEffect(() => {
    storeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  useEffect(() => {
    storeCart(cart);
  }, [cart]);

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
        setError("loadFailed");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const availableItems = useMemo(
    () => items.filter((item) => item.available !== false),
    [items],
  );

  const sortedAvailableItems = useMemo(
    () => sortMenuItems(availableItems),
    [availableItems],
  );

  useEffect(() => {
    const suspiciousItems = availableItems.filter(hasSuspiciousLowPrice);
    if (suspiciousItems.length === 0) return;

    console.warn(
      `${restaurantConfig.name.en} menu has suspicious low ${restaurantConfig.currencyLabel} prices. Fix these values in Firestore/Admin instead of multiplying in code:`,
      suspiciousItems.map((item) => ({
        id: item.id,
        name: getItemName(item, "en") || getItemName(item, "ar"),
        price: getPrice(item),
      })),
    );
  }, [availableItems]);

  const categories = useMemo(
    () => makeCategoriesFromItems(availableItems, true),
    [availableItems],
  );

  const filtered =
    category === "all"
      ? sortedAvailableItems
      : sortedAvailableItems.filter((item) => getItemCategoryKey(item) === category);

  const cartCount = getCartItemCount(cart);

  function addToCart(item) {
    setCart((current) => addItemToCart(current, item));
  }

  function increaseCartItem(item) {
    setCart((current) => addItemToCart(current, item));
  }

  function decreaseCartItem(itemId) {
    setCart((current) => {
      const existing = current.find((entry) => entry.item.id === itemId);
      if (!existing) return current;
      return updateCartQuantity(current, itemId, existing.quantity - 1);
    });
  }

  function clearCart() {
    setCart([]);
    setNote("");
  }

  return (
    <div
      className="min-h-screen bg-cream pb-5 text-charcoal [background:radial-gradient(circle_at_top_left,rgba(246,170,45,0.16),transparent_22rem),linear-gradient(180deg,#fff7e8,#fffdf8_34rem,#fffaf0)]"
      dir={direction}
      lang={language}
    >
      <Header
        language={language}
        onLanguageChange={setLanguage}
        t={t}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <main>
        <HeroSection t={t} />

        <section
          className="mx-auto my-2.5 w-[min(1120px,calc(100%_-_20px))] overflow-clip rounded-[18px] border border-primary/15 bg-white/80 p-3.5 pt-3 shadow-card"
          id="menu"
          aria-labelledby="menu-title"
        >
          <SectionTitle
            id="menu-title"
            eyebrow={t.menu}
            title={t.orderFresh}
            description={t.menuHint}
          />

          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            onSelectCategory={setCategory}
            language={language}
          />

          {loading ? (
            <LoadingState message={t.loadingMenu} />
          ) : error ? (
            <ErrorState message={error === "loadFailed" ? t.loadFailed : error} />
          ) : filtered.length === 0 ? (
            <ErrorState message={t.noItems} />
          ) : (
            <MenuGrid
              items={filtered}
              language={language}
              t={t}
              onAddToCart={addToCart}
            />
          )}
        </section>

        <LocationSection t={t} />
      </main>

      <Footer t={t} />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        note={note}
        language={language}
        t={t}
        onClose={() => setCartOpen(false)}
        onNoteChange={setNote}
        onIncrease={increaseCartItem}
        onDecrease={decreaseCartItem}
        onRemove={(itemId) => setCart((current) => removeCartItem(current, itemId))}
        onClear={clearCart}
      />
    </div>
  );
}
