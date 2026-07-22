import MenuCard from "./MenuCard";

export default function MenuGrid({
  items,
  featured = false,
  className = "itemsGrid",
  language,
  t,
  onAddToCart,
}) {
  return (
    <div className={className === "itemsGrid" ? "grid gap-2 md:grid-cols-2 md:gap-2.5 lg:grid-cols-3" : className}>
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          featured={featured}
          language={language}
          t={t}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
