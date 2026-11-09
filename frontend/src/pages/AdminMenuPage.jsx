import { useState } from "react";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminLogin from "../components/admin/AdminLogin";
import { getAdminTranslations } from "../i18n/adminTranslations";
import { firestoreMenuRepository } from "../services/firestoreMenuRepository";
import { getStoredLanguage } from "../utils/languageUtils";

// Real admin panel: requires Firebase Auth, reads and writes the live menu.
// Writes are also enforced server-side by firestore.rules (admins collection).
export default function AdminMenuPage() {
  const [language, setLanguage] = useState(getStoredLanguage);
  const t = getAdminTranslations(language);

  return (
    <AdminLogin t={t} language={language} onLanguageChange={setLanguage}>
      {({ goToMenu, logout, authError }) => (
        <AdminDashboard
          repo={firestoreMenuRepository}
          language={language}
          onLanguageChange={setLanguage}
          onGoToMenu={goToMenu}
          onLogout={logout}
          authError={authError}
        />
      )}
    </AdminLogin>
  );
}
