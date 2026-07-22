import restaurantConfig from "../config/restaurantConfig";
import { WHATSAPP_NUMBER } from "../data/constants";

export function getWhatsAppUrl(
  message = `Hello ${restaurantConfig.name.en}, I would like to order.`,
  number = WHATSAPP_NUMBER,
) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getItemOrderMessage(itemName) {
  return `مرحبًا، أريد طلب ${itemName} من ${
    restaurantConfig.name.ar || restaurantConfig.name.en
  }.`;
}
