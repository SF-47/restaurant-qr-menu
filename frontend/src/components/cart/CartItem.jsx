import { IoAdd, IoRemove, IoTrashOutline } from "react-icons/io5";
import { getItemName, getPrice, formatPrice } from "../../utils/menuUtils";

const STEP =
  "inline-flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10";

export default function CartItem({ entry, language, t, onIncrease, onDecrease, onRemove }) {
  const { item, quantity } = entry;
  const name = getItemName(item, language);
  const price = getPrice(item);

  return (
    <li className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <h3 className="m-0 break-words text-base font-bold leading-snug text-charcoal">{name}</h3>
        {price > 0 ? (
          <p className="m-0 mt-0.5 text-sm tabular-nums text-muted">
            {formatPrice(price * quantity)}
          </p>
        ) : null}
        <button
          className="mt-1 inline-flex min-h-8 items-center gap-1 text-xs font-bold text-red-700"
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`${t.remove}: ${name}`}
        >
          <IoTrashOutline className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
          {t.remove}
        </button>
      </div>

      <div
        className="inline-flex flex-none items-center rounded-full border border-primary/15 bg-white"
        role="group"
        aria-label={`${t.quantity}: ${name}`}
      >
        <button className={STEP} type="button" onClick={() => onDecrease(item.id)} aria-label={t.decrease}>
          <IoRemove className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="min-w-6 text-center font-bold tabular-nums text-primary" aria-live="polite">
          {quantity}
        </span>
        <button className={STEP} type="button" onClick={() => onIncrease(item)} aria-label={t.increase}>
          <IoAdd className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
