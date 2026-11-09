import restaurantConfig from "../config/restaurantConfig";
import { WHATSAPP_NUMBER } from "../data/constants";

export function getWhatsAppUrl(
  message = `Hello ${restaurantConfig.name.en}, I would like to order.`,
  number = WHATSAPP_NUMBER,
) {
  // wa.me only accepts digits (no "+", spaces or dashes).
  const digits = String(number).replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function getItemOrderMessage(itemName) {
  return `مرحبًا، أريد طلب ${itemName} من ${restaurantConfig.name.en}.`;
}
