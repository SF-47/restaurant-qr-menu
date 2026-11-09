import { useEffect, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Button from "../common/Button";
import CartItem from "./CartItem";
import {
  buildCartWhatsAppMessage,
  getCartTotal,
  hasPricedItems,
} from "../../utils/cartUtils";
import { formatPrice } from "../../utils/menuUtils";
import { getWhatsAppUrl } from "../../utils/whatsappUtils";

export default function CartDrawer({
  open,
  cart,
  note,
  language,
  t,
  onClose,
  onNoteChange,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
}) {
  const closeRef = useRef(null);

  // Dialog behavior: focus the close button, close on Escape, lock page
  // scroll behind the sheet, and give focus back to the opener on close.
  useEffect(() => {
    if (!open) return undefined;

    const opener = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const total = getCartTotal(cart);
  const canShowTotal = hasPricedItems(cart);
  const orderMessage = buildCartWhatsAppMessage(cart, note, language, t);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-charcoal/50" onClick={onClose} aria-hidden="true" />

      <div
        className="relative flex max-h-[90dvh] w-full max-w-lg flex-col rounded-t-2xl bg-cream-soft shadow-2xl sm:rounded-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="flex items-center justify-between gap-3 border-b border-primary/10 px-5 py-4">
          <h2 id="cart-title" className="m-0 text-xl font-extrabold tracking-tight text-primary">
            {t.yourOrder}
          </h2>
          <button
            ref={closeRef}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-primary/10"
            type="button"
            onClick={onClose}
            aria-label={t.close}
          >
            <IoClose className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="grid justify-items-center gap-4 px-5 py-10 text-center text-muted">
            <p className="m-0">{t.cartEmpty}</p>
            <Button variant="secondary" onClick={onClose}>
              {t.continueBrowsing}
            </Button>
          </div>
        ) : (
          <>
            <ul className="m-0 flex-1 list-none divide-y divide-primary/10 overflow-y-auto overscroll-contain px-5 py-1">
              {cart.map((entry) => (
                <CartItem
                  key={entry.item.id}
                  entry={entry}
                  language={language}
                  t={t}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                />
              ))}
            </ul>

            <div className="grid gap-3 border-t border-primary/10 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              {canShowTotal ? (
                <div className="flex items-center justify-between gap-3 text-base font-bold text-charcoal">
                  <span>{t.total}</span>
                  <span className="tabular-nums text-orange">{formatPrice(total)}</span>
                </div>
              ) : null}

              <div className="grid gap-1.5">
                <label htmlFor="cart-note" className="text-sm font-bold text-primary">
                  {t.customerNote}
                </label>
                <textarea
                  id="cart-note"
                  className="w-full resize-none rounded-xl border border-primary/20 bg-white px-3 py-2 text-base text-charcoal placeholder:text-muted"
                  value={note}
                  onChange={(e) => onNoteChange(e.target.value)}
                  placeholder={t.notePlaceholder}
                  rows={2}
                />
              </div>

              <Button href={getWhatsAppUrl(orderMessage)} target="_blank" rel="noreferrer" className="min-h-12 text-base">
                <FaWhatsapp className="h-5 w-5 flex-none" aria-hidden="true" />
                {t.orderOnWhatsApp}
              </Button>
              <button
                className="min-h-10 text-sm font-bold text-muted hover:text-red-700"
                type="button"
                onClick={onClear}
              >
                {t.clearCart}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
