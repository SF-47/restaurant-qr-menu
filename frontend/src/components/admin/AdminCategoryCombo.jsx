import { useState } from "react";
import { catKey } from "../../utils/categoryUtils";

export default function AdminCategoryCombo({ categories, value, onPickObj, t }) {
  const [open, setOpen] = useState(false);
  const selectedText = value?.en || "";

  function pick(category) {
    onPickObj?.(category);
    setOpen(false);
  }

  function toggleOpen() {
    setOpen((prev) => !prev);
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        <button
          className="inline-flex min-h-9 min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border border-primary/15 bg-white px-2.5 py-1.5 text-left text-[13px] font-black text-primary shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange"
          type="button"
          onClick={toggleOpen}
        >
          <span className={selectedText ? "truncate" : "truncate text-muted"}>
            {selectedText || t.pickCategory}
          </span>
          <span aria-hidden="true">v</span>
        </button>

        
      </div>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-[9999] max-h-[min(260px,46vh)] overflow-y-auto overflow-x-hidden rounded-2xl border border-primary/15 bg-white/95 p-2 shadow-card backdrop-blur">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category.en}
                className={`min-h-9 flex-none rounded-full border px-3 py-1.5 text-xs font-black shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                  catKey(category.en) === catKey(selectedText)
                    ? "border-transparent bg-gradient-to-br from-primary to-teal text-white"
                    : "border-primary/15 bg-white text-primary hover:bg-teal/10"
                }`}
                type="button"
                onClick={() => pick(category)}
                title={category.ar || category.en}
              >
                {category.en}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
