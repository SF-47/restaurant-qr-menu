import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { LanguageSwitch } from "./AdminHeader";
import { btn, field, surface } from "./adminUi";
import { ASSETS } from "../../data/constants";

export default function AdminLogin({ children, onUserChange, t, language, onLanguageChange }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [err, setErr] = useState("");
  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      onUserChange?.(u);
      setChecking(false);
    });
    return () => unsub();
  }, [auth, onUserChange]);

  async function login(e) {
    e.preventDefault();
    if (signingIn) return;
    setErr("");
    setSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      setEmail("");
      setPass("");
    } catch (error) {
      console.error(error);
      setErr(t.loginFailed);
    } finally {
      setSigningIn(false);
    }
  }

  async function logout() {
    setErr("");
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      setErr(t.logoutFailed);
    }
  }

  if (checking) {
    return (
      <div className="grid min-h-dvh place-items-center text-muted" role="status">
        {t.checkingLogin}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid min-h-dvh place-items-center px-4 py-8" dir={dir} lang={language}>
        <section className={`${surface} grid w-full max-w-sm gap-5 p-6`} aria-labelledby="admin-login-title">
          <div className="flex items-center justify-between gap-3">
            <img className="h-12 w-12 rounded-full object-cover" src={ASSETS.logo} alt="" width="48" height="48" />
            <LanguageSwitch language={language} onLanguageChange={onLanguageChange} t={t} />
          </div>

          <div className="grid gap-1">
            <h1 id="admin-login-title" className="m-0 text-2xl font-extrabold tracking-tight text-primary">
              {t.adminBrand}
            </h1>
            <p className="m-0 text-sm text-muted">{t.loginSubtitle}</p>
          </div>

          {err ? (
            <p className="m-0 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">
              {err}
            </p>
          ) : null}

          <form onSubmit={login} className="grid gap-4">
            <div className={field.wrap}>
              <label htmlFor="admin-email" className={field.label}>{t.email}</label>
              <input
                id="admin-email"
                className={field.input}
                type="email"
                dir="ltr"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={field.wrap}>
              <label htmlFor="admin-password" className={field.label}>{t.password}</label>
              <input
                id="admin-password"
                className={field.input}
                type="password"
                dir="ltr"
                autoComplete="current-password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
            <button className={`${btn.primary} min-h-11`} type="submit" disabled={signingIn}>
              {signingIn ? t.signingIn : t.login}
            </button>
          </form>
        </section>
      </div>
    );
  }

  return children({
    goToMenu: () => navigate("/"),
    logout,
    authError: err,
  });
}
