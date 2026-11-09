import { ASSETS, BRAND_NAME } from "../../data/constants";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "ar", label: "عربي" },
];

// Fixed height (h-14) so the sticky category bar can sit exactly below it.
export default function Header({ language, onLanguageChange, t }) {
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-primary/10 bg-cream-soft" id="home">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-3 px-4">
        <a
          className="flex min-w-0 items-center gap-2.5 text-primary no-underline"
          href="#home"
          aria-label={`${BRAND_NAME} home`}
        >
          <img
            src={ASSETS.logo}
            alt=""
            width="36"
            height="36"
            className="h-9 w-9 flex-none rounded-full object-cover"
          />
          <span className="truncate text-lg font-extrabold tracking-tight">{t.brandName}</span>
        </a>

        <div
          className="inline-flex flex-none rounded-full border border-primary/15 bg-white p-0.5"
          role="group"
          aria-label="Language"
        >
          {LANGUAGES.map(({ code, label }) => {
            const active = language === code;
            return (
              <button
                key={code}
                className={`min-h-9 min-w-11 rounded-full px-3 text-xs font-bold transition-colors ${
                  active ? "bg-primary text-white" : "text-primary hover:bg-primary/5"
                }`}
                type="button"
                lang={code}
                onClick={() => onLanguageChange(code)}
                aria-pressed={active}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
