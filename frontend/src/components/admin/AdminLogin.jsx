import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ASSETS } from "../../data/constants";

const pageClass =
  "min-h-screen bg-cream p-3 text-charcoal [background:radial-gradient(circle_at_top_left,rgba(246,170,45,0.18),transparent_22rem),linear-gradient(180deg,#fff7e8,#fffdf8_34rem,#fffaf0)]";
const inputClass =
  "min-h-10 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-charcoal shadow-sm outline-none focus:border-orange focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";
const buttonClass =
  "inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-teal px-4 py-2 text-sm font-black text-white shadow-soft transition duration-150 hover:-translate-y-0.5 hover:from-teal hover:to-leaf hover:shadow-card active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";

export default function AdminLogin({ children, onUserChange, actions, t, language, onLanguageChange }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

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
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setEmail("");
      setPass("");
    } catch (e) {
      console.error(e);
      setErr(t.loginFailed);
    }
  }

  async function logout() {
    setErr("");
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
      setErr(t.logoutFailed);
    }
  }

  if (checking) {
    return (
      <div className={pageClass}>
        <div className="mx-auto w-full max-w-[1180px] rounded-2xl border border-dashed border-primary/20 bg-white/80 p-4 text-center text-muted shadow-card">
          {t.checkingLogin}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${pageClass} grid place-items-center p-5`} dir={language === "ar" ? "rtl" : "ltr"} lang={language}>
        <section className="grid w-full max-w-[430px] gap-4 rounded-[22px] border border-primary/15 bg-white/90 p-5 shadow-card" aria-labelledby="admin-login-title">
          <div className="flex items-center gap-3">
            <img className="h-14 w-14 rounded-full object-cover shadow-soft" src={ASSETS.logo} alt="Shawarma Story logo" />
            <div className="min-w-0 flex-1">
              <h1 id="admin-login-title" className="m-0 text-2xl font-black leading-none text-primary">
                {t.adminBrand}
              </h1>
              <p className="m-0 mt-1.5 text-[13px] text-muted">{t.loginSubtitle}</p>
            </div>
          </div>

          <div className="flex w-fit rounded-full border border-primary/15 bg-cream-soft p-1">
            {["en", "ar"].map((code) => (
              <button
                className={`min-h-8 rounded-full px-3 text-xs font-black transition duration-150 hover:bg-primary/10 hover:text-orange active:scale-95 ${
                  language === code ? "bg-primary text-white shadow-soft" : "text-primary"
                }`}
                key={code}
                type="button"
                onClick={() => onLanguageChange(code)}
              >
                {code === "ar" ? t.languageAr : t.languageEn}
              </button>
            ))}
          </div>

          {err ? (
            <div className="rounded-2xl border border-red-700/20 bg-red-50 p-3 text-sm font-extrabold text-red-700">
              {err}
            </div>
          ) : null}

          <form onSubmit={login} className="grid gap-3">
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-muted">{t.email}</span>
              <input
                className={inputClass}
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-muted">{t.password}</span>
              <input
                className={inputClass}
                type="password"
                placeholder="Enter password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </label>
            <button className={buttonClass} type="submit">
              {t.login}
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
    actions,
  });
}
