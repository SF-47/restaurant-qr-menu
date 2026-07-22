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
  if (!open) return null;

  const total = getCartTotal(cart);
  const canShowTotal = hasPricedItems(cart);
  const orderMessage = buildCartWhatsAppMessage(cart, note, language, t);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 p-2 sm:p-3" role="dialog" aria-modal="true" aria-label={t.yourOrder}>
      <div className="flex max-h-[min(88vh,680px)] w-[min(520px,100%)] flex-col overflow-hidden rounded-t-[20px] border border-primary/15 bg-cream-soft shadow-2xl sm:rounded-[22px]">
        <div className="flex items-start justify-between gap-3 border-b border-primary/15 p-3 sm:p-4">
          <div>
            <span className="w-fit rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary sm:py-1 sm:text-[11px]">{t.cart}</span>
            <h2 className="m-0 mt-1.5 text-xl font-black leading-none text-primary sm:text-2xl">{t.yourOrder}</h2>
          </div>
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 bg-white text-primary" type="button" onClick={onClose} aria-label="Close">
            <IoClose className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="grid gap-3 p-4 text-center text-muted sm:p-5">
            <p className="m-0">{t.cartEmpty}</p>
            <button className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-black text-primary" type="button" onClick={onClose}>
              {t.continueBrowsing}
            </button>
          </div>
        ) : (
          <>
            <div className="grid flex-1 gap-2 overflow-auto px-3 py-2.5 sm:px-4 sm:py-3">
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
            </div>

            {canShowTotal ? (
              <div className="flex items-center justify-between gap-3 border-t border-primary/15 px-3 pt-2.5 font-black text-primary sm:px-4">
                <span>{t.total}</span>
                <strong className="text-orange">{formatPrice(total)}</strong>
              </div>
            ) : null}

            <label className="grid gap-1.5 px-3 py-2.5 text-[13px] font-black text-primary sm:px-4">
              <span>{t.customerNote}</span>
              <textarea
                className="w-full resize-y rounded-2xl border border-primary/15 bg-white px-3 py-2 font-normal text-charcoal"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder={t.notePlaceholder}
                rows={2}
              />
            </label>

            <div className="grid gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
              <Button href={getWhatsAppUrl(orderMessage)} target="_blank" rel="noreferrer">
                <FaWhatsapp className="me-1.5 h-4 w-4 flex-none" aria-hidden="true" />
                {t.orderOnWhatsApp}
              </Button>
              <button className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-black text-primary" type="button" onClick={onClear}>
                {t.clearCart}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
