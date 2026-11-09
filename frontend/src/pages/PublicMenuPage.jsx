import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CategoryFilter from "../components/menu/CategoryFilter";
import HeroSection from "../components/menu/HeroSection";
import LocationSection from "../components/menu/LocationSection";
import MenuGrid from "../components/menu/MenuGrid";
import CartButton from "../components/cart/CartButton";
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
  getCartTotal,
  getStoredCart,
  removeCartItem,
  storeCart,
  syncCartWithMenu,
  updateCartQuantity,
} from "../utils/cartUtils";
import { formatPrice, getItemName, getPrice, hasSuspiciousLowPrice } from "../utils/menuUtils";
import restaurantConfig from "../config/restaurantConfig";

export default function PublicMenuPage() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState(getStoredCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
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
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const snap = await getDocs(collection(db, "menuItems"));
        if (cancelled) return;
        const menuData = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(menuData);
        // A cart restored from localStorage may hold old prices or removed items.
        setCart((current) => syncCartWithMenu(current, menuData));
      } catch (e) {
        if (cancelled) return;
        console.error("Firestore load failed:", e);
        setItems([]);
        setError("loadFailed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

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

  const quantities = useMemo(
    () => new Map(cart.map((entry) => [entry.item.id, entry.quantity])),
    [cart],
  );

  const cartCount = getCartItemCount(cart);

  const addToCart = useCallback((item) => {
    setCart((current) => addItemToCart(current, item));
  }, []);

  const decreaseCartItem = useCallback((itemId) => {
    setCart((current) => {
      const existing = current.find((entry) => entry.item.id === itemId);
      if (!existing) return current;
      return updateCartQuantity(current, itemId, existing.quantity - 1);
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((current) => removeCartItem(current, itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setNote("");
  }, []);

  // Stable reference: the drawer's dialog effect depends on it.
  const closeCart = useCallback(() => setCartOpen(false), []);

  function selectCategory(key) {
    setCategory(key);
    // If the user scrolled deep into the list, bring the new category's top into view.
    const menu = document.getElementById("menu");
    if (menu && menu.getBoundingClientRect().top < 0) {
      menu.scrollIntoView({ block: "start" });
    }
  }

  return (
    <div
      className={`min-h-dvh text-charcoal ${cartCount > 0 ? "pb-24" : ""}`}
      dir={direction}
      lang={language}
    >
      <Header language={language} onLanguageChange={setLanguage} t={t} />

      <main>
        <HeroSection t={t} />

        <section className="mx-auto mt-8 max-w-5xl px-4" id="menu" aria-labelledby="menu-title">
          <SectionTitle id="menu-title" title={t.menu} description={t.menuHint} />

          <CategoryFilter
            categories={categories}
            selectedCategory={category}
            onSelectCategory={selectCategory}
            language={language}
          />

          {loading ? (
            <LoadingState message={t.loadingMenu} />
          ) : error ? (
            <ErrorState
              message={t.loadFailed}
              actionLabel={t.retry}
              onAction={() => setReloadKey((k) => k + 1)}
            />
          ) : filtered.length === 0 ? (
            <ErrorState message={t.noItems} />
          ) : (
            <MenuGrid
              items={filtered}
              grouped={category === "all"}
              language={language}
              quantities={quantities}
              t={t}
              onAddToCart={addToCart}
            />
          )}
        </section>

        <LocationSection t={t} />
      </main>

      <Footer t={t} />

      <CartButton
        count={cartCount}
        total={formatPrice(getCartTotal(cart))}
        onClick={() => setCartOpen(true)}
        t={t}
      />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        note={note}
        language={language}
        t={t}
        onClose={closeCart}
        onNoteChange={setNote}
        onIncrease={addToCart}
        onDecrease={decreaseCartItem}
        onRemove={removeFromCart}
        onClear={clearCart}
      />
    </div>
  );
}
