import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoInformationCircleOutline } from "react-icons/io5";
import AdminDashboard from "../components/admin/AdminDashboard";
import { DEMO_MENU } from "../data/demoMenu";
import { getAdminTranslations } from "../i18n/adminTranslations";
import { createMemoryMenuRepository } from "../services/memoryMenuRepository";
import { getStoredLanguage } from "../utils/languageUtils";

// Public portfolio demo of the admin panel. No login, no Firebase:
// all changes stay in memory and reset on reload.
export default function AdminDemoPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(getStoredLanguage);
  const [repo] = useState(() => createMemoryMenuRepository(DEMO_MENU));
  const t = getAdminTranslations(language);

  // Keep the demo out of search results.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <AdminDashboard
      repo={repo}
      language={language}
      onLanguageChange={setLanguage}
      onGoToMenu={() => navigate("/")}
      onLogout={() => navigate("/")}
      banner={
        <div className="border-b border-gold/40 bg-gold/15">
          <p className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2.5 text-sm text-charcoal">
            <IoInformationCircleOutline className="mt-0.5 h-5 w-5 flex-none text-orange" aria-hidden="true" />
            <span>
              <strong className="font-bold">{t.demoTitle}</strong> {t.demoBody}
            </span>
          </p>
        </div>
      }
    />
  );
}
