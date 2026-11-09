// Shape rule for the public menu: buttons are full pills, surfaces are rounded-2xl.
const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold no-underline transition-[transform,background-color,color] duration-150 active:scale-[0.98]";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-teal",
  secondary: "border border-primary/20 bg-white text-primary hover:border-primary/40",
  // For use on the dark green surface.
  inverse: "bg-white text-primary hover:bg-cream",
  inverseOutline: "border border-white/40 text-white hover:bg-white/10",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const classes = `${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${className}`.trim();

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
