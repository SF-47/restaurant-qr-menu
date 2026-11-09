import MenuCard from "./MenuCard";
import { getItemCategoryKey, getItemCategoryLabel } from "../../utils/categoryUtils";

function groupByCategory(items) {
  const groups = [];
  const byKey = new Map();

  items.forEach((item) => {
    const key = getItemCategoryKey(item) || "other";
    if (!byKey.has(key)) {
      const group = { key, id: `menu-cat-${groups.length}`, first: item, items: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    byKey.get(key).items.push(item);
  });

  return groups;
}

function Items({ items, language, quantities, t, onAddToCart }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          language={language}
          quantity={quantities.get(item.id) || 0}
          t={t}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

// `items` must already be sorted; when `grouped`, a heading is shown per category.
export default function MenuGrid({ items, grouped = false, language, quantities, t, onAddToCart }) {
  const props = { language, quantities, t, onAddToCart };

  if (!grouped) return <Items items={items} {...props} />;

  return (
    <div className="grid gap-8">
      {groupByCategory(items).map((group) => (
        <section key={group.key} aria-labelledby={group.id}>
          <h3
            id={group.id}
            className="m-0 mb-3 text-lg font-extrabold tracking-tight text-primary"
          >
            {getItemCategoryLabel(group.first, language)}
          </h3>
          <Items items={group.items} {...props} />
        </section>
      ))}
    </div>
  );
}
