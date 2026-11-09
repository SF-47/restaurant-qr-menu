// Shared admin styles. Same rule as the public menu: buttons are pills,
// surfaces are rounded-2xl, inputs are rounded-xl. Flat colors, no gradients.

export const btn = {
  primary:
    "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-teal disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-primary/20 bg-white px-4 text-sm font-bold text-primary transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
  danger:
    "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-red-700 px-4 text-sm font-bold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60",
  quiet:
    "inline-flex min-h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10",
  quietDanger:
    "inline-flex min-h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-bold text-red-700 transition-colors hover:bg-red-50",
};

export const field = {
  wrap: "grid content-start gap-1.5",
  label: "text-sm font-bold text-charcoal",
  hint: "text-xs text-muted",
  error: "text-xs font-bold text-red-700",
  input:
    "min-h-11 w-full rounded-xl border border-primary/20 bg-white px-3 text-base text-charcoal placeholder:text-muted focus:border-primary aria-[invalid=true]:border-red-700",
  textarea:
    "w-full resize-y rounded-xl border border-primary/20 bg-white px-3 py-2 text-base text-charcoal placeholder:text-muted focus:border-primary",
  checkbox: "h-4 w-4 flex-none accent-primary",
};

export const surface = "rounded-2xl border border-primary/10 bg-white";
