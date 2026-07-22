import { WHATSAPP_NUMBER } from "../data/constants";

export function getWhatsAppUrl(
  message = "Hello Shawarma Story, I would like to order.",
  number = WHATSAPP_NUMBER,
) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getItemOrderMessage(itemName) {
  return `مرحبًا، أريد طلب ${itemName} من Story Shawarma.`;
}
