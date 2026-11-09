import { IoBagHandleOutline } from "react-icons/io5";

// Bottom order bar: only rendered once the cart has items.
export default function CartButton({ count, total, onClick, t }) {
  if (count <= 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <button
        className="mx-auto flex min-h-14 w-full max-w-md items-center gap-3 rounded-full bg-primary px-5 text-white shadow-[0_10px_30px_rgba(11,79,69,0.3)] transition-transform duration-150 active:scale-[0.98]"
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
      >
        <span className="relative flex-none">
          <IoBagHandleOutline className="h-6 w-6" aria-hidden="true" />
          <span className="absolute -end-2 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[11px] font-bold tabular-nums">
            {count}
            <span className="sr-only"> {t.itemsCount}</span>
          </span>
        </span>
        <span className="flex-1 text-start text-base font-bold">{t.viewOrder}</span>
        {total ? <span className="text-sm font-bold tabular-nums">{total}</span> : null}
      </button>
    </div>
  );
}
