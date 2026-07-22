export default function AdminModal({
  open,
  title,
  children,
  onClose,
  headerExtra,
  headerRight,
  closeLabel = "Close",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] grid place-items-center bg-[#061613]/70 p-0 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[90vh] w-[94vw] max-w-[760px] flex-col overflow-hidden rounded-2xl border border-primary/15 bg-white/90 shadow-2xl">
        <div className="flex flex-none items-center gap-2 border-b border-primary/10 bg-cream-soft px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="m-0 text-base font-black leading-tight text-primary">{title}</h3>
            {headerExtra}
          </div>
          {headerRight ? <div className="ms-auto">{headerRight}</div> : null}
          <button
            className="ms-auto inline-flex h-7 w-7 flex-none items-center justify-center rounded-full border border-primary/15 bg-white text-sm font-black text-primary transition duration-150 hover:-translate-y-0.5 hover:border-orange/40 hover:bg-cream-soft hover:text-orange active:translate-y-0 active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange"
            onClick={onClose}
            type="button"
            aria-label={closeLabel}
          >
            x
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain p-2.5 [-webkit-overflow-scrolling:touch] sm:p-3">
          {children}
        </div>
      </div>
    </div>
  );
}
