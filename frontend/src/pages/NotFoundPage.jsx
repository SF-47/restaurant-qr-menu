import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ASSETS } from "../data/constants";
import { getTranslations } from "../i18n/translations";
import { getDirection, getStoredLanguage } from "../utils/languageUtils";

// Shown for any unknown route. Firebase Hosting also serves this app as
// 404.html, so the server answers unknown paths with a real 404 status.
export default function NotFoundPage() {
  const [language] = useState(getStoredLanguage);
  const t = getTranslations(language);
  const direction = getDirection(language);

  useEffect(() => {
    const previousTitle = document.title;
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.title = `${t.notFoundTitle} | ${t.brandName}`;
    return () => {
      document.title = previousTitle;
    };
  }, [language, direction, t.notFoundTitle, t.brandName]);

  return (
    <main
      className="grid min-h-dvh place-items-center px-4 py-10 text-center text-charcoal"
      dir={direction}
      lang={language}
    >
      <div className="grid max-w-sm justify-items-center gap-4">
        <img src={ASSETS.logo} alt="" width="64" height="64" className="h-16 w-16 rounded-full object-cover" />
        <p className="m-0 text-5xl font-extrabold tabular-nums tracking-tight text-primary">404</p>
        <h1 className="m-0 text-2xl font-extrabold tracking-tight">{t.notFoundTitle}</h1>
        <p className="m-0 text-muted">{t.notFoundBody}</p>
        <Link
          to="/"
          className="mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-white no-underline transition-[transform,background-color] duration-150 hover:bg-teal active:scale-[0.98]"
        >
          {t.backToMenu}
        </Link>
      </div>
    </main>
  );
}
