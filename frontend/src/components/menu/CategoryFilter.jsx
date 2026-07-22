import { getCategoryLabel } from "../../utils/categoryUtils";

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  language,
}) {
  return (
    <div
      className="sticky top-[82px] z-40 mb-2 flex gap-1.5 overflow-x-auto bg-white/95 px-2 py-1.5 backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:top-[62px]"
      aria-label="Menu categories"
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.key;
        const isOffer = category.key === "offers";

        return (
          <button
            key={category.key || category.en}
            onClick={() => onSelectCategory(category.key)}
            className={` mt-2.5 min-h-9 min-w-[68px] flex-none rounded-full border px-2.5 py-1.5 text-xs font-black shadow-sm sm:min-h-[42px] sm:min-w-[76px] sm:px-3 sm:py-2 sm:text-[13px] ${
              isSelected
                ? isOffer
                  ? "border-transparent bg-gradient-to-br from-orange to-gold text-white"
                  : "border-transparent bg-gradient-to-br from-primary to-teal text-white"
                : isOffer
                  ? "border-orange/30 bg-gold/20 text-orange"
                  : "border-primary/15 bg-white text-primary"
            }`}
            type="button"
            aria-pressed={isSelected}
          >
            <span>
              {isOffer ? "★ " : ""}
              {getCategoryLabel(category, language)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
