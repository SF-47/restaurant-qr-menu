import { useEffect, useId, useRef } from "react";
import { IoClose } from "react-icons/io5";

/**
 * Dialog shell. Pass `onSubmit` to render the body as a <form>, so Enter submits.
 * `footer` is rendered in a fixed bar below the scrollable body.
 */
export default function AdminModal({
  open,
  title,
  children,
  footer,
  onClose,
  onSubmit,
  closeLabel = "Close",
  size = "md",
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Focus the first field (or the panel), close on Escape, lock page scroll,
  // and return focus to whatever opened the dialog.
  useEffect(() => {
    if (!open) return undefined;

    const opener = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const first = panelRef.current?.querySelector("input, select, textarea");
    (first || panelRef.current)?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") onCloseRef.current?.();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, [open]);

  if (!open) return null;

  const Body = onSubmit ? "form" : "div";
  const bodyProps = onSubmit
    ? {
        noValidate: true,
        onSubmit: (event) => {
          event.preventDefault();
          onSubmit();
        },
      }
    : {};

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-charcoal/50" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-cream-soft shadow-2xl outline-none sm:rounded-2xl ${
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex flex-none items-center justify-between gap-3 border-b border-primary/10 px-5 py-3">
          <h2 id={titleId} className="m-0 text-lg font-extrabold tracking-tight text-primary">
            {title}
          </h2>
          <button
            className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full text-primary hover:bg-primary/10"
            onClick={onClose}
            type="button"
            aria-label={closeLabel}
          >
            <IoClose className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <Body className="flex min-h-0 flex-1 flex-col" {...bodyProps}>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
          {footer ? (
            <div className="flex flex-none flex-wrap justify-end gap-2 border-t border-primary/10 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          ) : null}
        </Body>
      </div>
    </div>
  );
}
