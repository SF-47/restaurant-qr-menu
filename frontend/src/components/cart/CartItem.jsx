import { IoTrashOutline } from "react-icons/io5";
import { getItemName, getPrice, formatPrice } from "../../utils/menuUtils";

export default function CartItem({ entry, language, t, onIncrease, onDecrease, onRemove }) {
  const { item, quantity } = entry;
  const name = getItemName(item, language);
  const price = getPrice(item);
  const subtotal = price * quantity;

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-2xl border border-primary/10 bg-white p-2.5 sm:p-3">
      <div>
        <h3 className="m-0 break-words text-[15px] font-black leading-tight text-charcoal sm:text-base">{name}</h3>
        {price > 0 ? (
          <p className="m-0 mt-0.5 text-xs text-muted sm:text-[13px]">
            {formatPrice(price)}
            {quantity > 1 ? ` - ${formatPrice(subtotal)}` : ""}
          </p>
        ) : null}
      </div>

      <div className="inline-flex items-center self-start overflow-hidden rounded-full border border-primary/15 bg-cream-soft" aria-label={t.quantity}>
        <button className="h-8 w-8 border-0 bg-transparent text-lg font-black text-primary" type="button" onClick={() => onDecrease(item.id)} aria-label="-">
          -
        </button>
        <span className="min-w-7 text-center font-black text-primary">{quantity}</span>
        <button className="h-8 w-8 border-0 bg-transparent text-lg font-black text-primary" type="button" onClick={() => onIncrease(item)} aria-label="+">
          +
        </button>
      </div>

      <button className="col-span-full inline-flex items-center gap-1 justify-self-start border-0 bg-transparent p-0 text-xs font-black text-red-700 rtl:justify-self-end" type="button" onClick={() => onRemove(item.id)} aria-label={`${t.remove}: ${name}`}>
        <IoTrashOutline className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
        {t.remove}
      </button>
    </article>
  );
}
