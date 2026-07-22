import { formatPrice, getItemName, getPrice } from "./menuUtils";
import restaurantConfig from "../config/restaurantConfig";

const CART_STORAGE_KEY = `${restaurantConfig.storageKeyPrefix}-cart`;

export function getStoredCart() {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function storeCart(cart) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function addItemToCart(cart, item) {
  const existing = cart.find((entry) => entry.item.id === item.id);
  if (existing) {
    return cart.map((entry) =>
      entry.item.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
    );
  }

  return [...cart, { item, quantity: 1 }];
}

export function updateCartQuantity(cart, itemId, quantity) {
  if (quantity <= 0) {
    return removeCartItem(cart, itemId);
  }

  return cart.map((entry) =>
    entry.item.id === itemId ? { ...entry, quantity } : entry,
  );
}

export function removeCartItem(cart, itemId) {
  return cart.filter((entry) => entry.item.id !== itemId);
}

export function getCartItemCount(cart) {
  return cart.reduce((sum, entry) => sum + entry.quantity, 0);
}

export function getCartTotal(cart) {
  return cart.reduce((sum, entry) => sum + getPrice(entry.item) * entry.quantity, 0);
}

export function hasPricedItems(cart) {
  return cart.some((entry) => getPrice(entry.item) > 0);
}

export function buildCartWhatsAppMessage(cart, note) {
  const lines = [
    `طلب من ${restaurantConfig.name.en}`,
    "",
    "مرحبًا، أريد طلب:",
    "",
  ];

  cart.forEach((entry, index) => {
    const name = getItemName(entry.item, "ar");
    const price = getPrice(entry.item);
    const subtotal = price * entry.quantity;

    lines.push(`${index + 1}) ${name}`);
    lines.push(`الكمية: ${entry.quantity}`);
    lines.push(`المجموع: ${formatPrice(subtotal)}`);
    lines.push("");
  });

  lines.push("--------------------");
  lines.push(`مجموع الطلب: ${formatPrice(getCartTotal(cart))}`);

  const cleanNote = note.trim();
  if (cleanNote) {
    lines.push("");
    lines.push("ملاحظة:");
    lines.push(cleanNote);
  }

  return lines.join("\n");
}
