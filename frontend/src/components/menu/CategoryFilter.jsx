import { getCategoryLabel } from "../../utils/categoryUtils";

// Sticks directly below the h-14 header.
export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  language,
}) {
  return (
    <div className="sticky top-14 z-20 -mx-4 mb-4 border-b border-primary/10 bg-cream-soft">
      <div
        className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Menu categories"
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.key;
          const isOffer = category.key === "offers";

          return (
            <button
              key={category.key || category.en}
              onClick={() => onSelectCategory(category.key)}
              className={`min-h-9 flex-none whitespace-nowrap rounded-full border px-4 text-sm font-bold transition-colors ${
                isSelected
                  ? isOffer
                    ? "border-orange bg-orange text-white"
                    : "border-primary bg-primary text-white"
                  : isOffer
                    ? "border-orange/40 bg-white text-orange"
                    : "border-primary/15 bg-white text-primary hover:border-primary/40"
              }`}
              type="button"
              aria-pressed={isSelected}
            >
              {getCategoryLabel(category, language)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
