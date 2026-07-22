export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex min-h-[42px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-black no-underline transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";
  const styles =
    variant === "secondary"
      ? "border border-primary/15 bg-white text-primary hover:text-orange"
      : "bg-gradient-to-br from-primary to-teal text-white shadow-soft hover:from-teal hover:to-leaf";
  const classes = `${base} ${styles} ${className}`.trim();

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
