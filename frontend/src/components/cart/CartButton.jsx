import { IoCartOutline } from "react-icons/io5";

export default function CartButton({ count, onClick, t, variant = "default" }) {
  const isCorner = variant === "corner";
  const isIcon = variant === "icon";

  return (
    <button
      className={
        isCorner
          ? "absolute end-3 top-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 bg-white text-primary shadow-soft focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange"
          : isIcon
            ? "relative inline-flex h-9 w-9 flex-none items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-soft focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange sm:h-10 sm:w-10"
          : "inline-flex min-h-8 flex-none items-center justify-center rounded-full border border-primary/15 bg-white px-2.5 py-1.5 text-[11px] font-black text-primary sm:min-h-9 sm:text-xs"
      }
      type="button"
      onClick={onClick}
      aria-label={t.cart}
    >
      <IoCartOutline className={isCorner || isIcon ? "h-5 w-5 flex-none" : "me-1 h-3.5 w-3.5 flex-none"} aria-hidden="true" />
      {isCorner || isIcon ? <span className="sr-only">{t.cart}</span> : <span>{t.cart}</span>}
      {count > 0 ? (
        <span
          className={
            isCorner || isIcon
              ? "absolute -end-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[11px] font-black text-white"
              : "ms-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-[11px] text-white"
          }
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
