import { useEffect, useRef, useState } from "react";
import {
  IoAdd,
  IoChevronDown,
  IoFolderOpenOutline,
  IoLogOutOutline,
  IoOpenOutline,
  IoPricetagOutline,
  IoRefresh,
} from "react-icons/io5";
import { btn } from "./adminUi";
import { ASSETS } from "../../data/constants";

function LanguageSwitch({ language, onLanguageChange, t }) {
  return (
    <div className="inline-flex flex-none rounded-full border border-primary/15 bg-white p-0.5" role="group" aria-label="Language">
      {["en", "ar"].map((code) => (
        <button
          key={code}
          className={`min-h-9 min-w-11 rounded-full px-3 text-xs font-bold transition-colors ${
            language === code ? "bg-primary text-white" : "text-primary hover:bg-primary/5"
          }`}
          type="button"
          onClick={() => onLanguageChange(code)}
          aria-pressed={language === code}
        >
          {code === "ar" ? t.languageAr : t.languageEn}
        </button>
      ))}
    </div>
  );
}

function MoreMenu({ items, label }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        className={btn.secondary}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <IoChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute end-0 top-[calc(100%+6px)] z-40 grid w-56 gap-0.5 rounded-2xl border border-primary/10 bg-white p-1.5 shadow-[0_12px_32px_rgba(23,34,31,0.14)]">
          {items.map((item) => {
            const { label: itemLabel, icon: Icon, onClick, danger, disabled, divider } = item;
            return (
            <button
              key={itemLabel}
              className={`flex min-h-10 items-center gap-2.5 rounded-xl px-3 text-start text-sm font-bold disabled:opacity-50 ${
                danger ? "text-red-700 hover:bg-red-50" : "text-charcoal hover:bg-primary/5"
              } ${divider ? "mt-1 border-t border-primary/10 pt-1" : ""}`}
              type="button"
              disabled={disabled}
              onClick={() => {
                setOpen(false);
                onClick();
              }}
            >
              <Icon className="h-4 w-4 flex-none" aria-hidden="true" />
              {itemLabel}
            </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminHeader({
  onAdd,
  onAddCategory,
  onRefresh,
  onManageCategories,
  loading,
  onGoToMenu,
  onLogout,
  t,
  language,
  onLanguageChange,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-primary/10 bg-cream-soft">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-3 px-4 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <img src={ASSETS.logo} alt="" width="36" height="36" className="h-9 w-9 flex-none rounded-full object-cover" />
          <h1 className="m-0 truncate text-lg font-extrabold tracking-tight text-primary">{t.menuManagement}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitch language={language} onLanguageChange={onLanguageChange} t={t} />
          <MoreMenu
            label={t.more}
            items={[
              { label: t.addCategory, icon: IoPricetagOutline, onClick: onAddCategory },
              { label: t.manageCategories, icon: IoFolderOpenOutline, onClick: onManageCategories },
              { label: loading ? t.refreshing : t.refresh, icon: IoRefresh, onClick: onRefresh, disabled: loading, divider: true },
              { label: t.goToMenu, icon: IoOpenOutline, onClick: onGoToMenu },
              { label: t.logout, icon: IoLogOutOutline, onClick: onLogout, danger: true, divider: true },
            ]}
          />
          <button className={btn.primary} type="button" onClick={onAdd}>
            <IoAdd className="h-5 w-5" aria-hidden="true" />
            {t.addItem}
          </button>
        </div>
      </div>
    </header>
  );
}

export { LanguageSwitch };
