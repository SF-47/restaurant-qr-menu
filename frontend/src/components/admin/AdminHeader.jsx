import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";

const primaryButton =
  "inline-flex min-h-10 flex-none items-center justify-center whitespace-nowrap rounded-xl bg-gradient-to-br from-primary to-teal px-3 py-2 text-sm font-black text-white shadow-soft focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-60 sm:px-4";

const menuButton =
  "inline-flex min-h-10 w-full items-center justify-start gap-2 rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm font-black text-primary transition hover:border-orange/40 hover:bg-cream-soft focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-60";

const dangerMenuButton =
  "inline-flex min-h-10 w-full items-center justify-start gap-2 rounded-xl border border-red-700/20 bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-orange";

export default function AdminHeader({
  onAdd,
  onAddCategory,
  onRefresh,
  onManageCategories,
  loading,
  onGoToMenu,
  onLogout,
  stats,
  t,
  language,
  onLanguageChange,
}) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const cards = [
    { label: t.totalItems, value: stats?.total ?? 0 },
    { label: t.availableItems, value: stats?.available ?? 0 },
    { label: t.unavailableItems, value: stats?.unavailable ?? 0 },
    { label: t.categories, value: stats?.categories ?? 0 },
  ];

  function runAction(action) {
    setActionsOpen(false);
    action?.();
  }

  return (
    <header className="mx-auto mb-3 grid w-full max-w-[1180px] gap-3 rounded-[22px] border border-primary/15 bg-white/90 p-3 shadow-card sm:p-4">
      <div className="grid gap-3 rounded-[18px] border border-primary/10 bg-cream-soft p-3 sm:p-4">
        <div className="min-w-0 border-b border-primary/10 pb-3">
          <span className="mb-2 inline-flex w-fit rounded-full bg-gold/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-primary">
            {t.adminBrand}
          </span>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="m-0 text-[clamp(22px,5vw,32px)] font-black leading-none text-primary">
                {t.menuManagement}
              </h1>
              <p className="m-0 mt-1.5 max-w-[680px] text-[13px] leading-snug text-muted">
                {t.adminSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-stretch gap-2">
          <div className="flex flex-none items-center rounded-xl border border-primary/15 bg-white p-1 shadow-sm">
            {["en", "ar"].map((code) => (
              <button
                className={`min-h-9 rounded-lg px-3 text-xs font-black transition ${
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

          <div className="relative min-w-0">
            <button
              className={`${primaryButton} w-full gap-2`}
              type="button"
              onClick={() => setActionsOpen((open) => !open)}
              aria-expanded={actionsOpen}
              aria-label={t.actions}
            >
              {actionsOpen ? <IoClose aria-hidden="true" /> : <IoMenu aria-hidden="true" />}
              <span>{t.actions}</span>
            </button>

            {actionsOpen ? (
              <div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 grid gap-1.5 overflow-hidden rounded-2xl border border-primary/15 bg-white/95 p-2 shadow-card backdrop-blur">
                <button className={menuButton} type="button" onClick={() => runAction(onAdd)}>
                  {t.addItem}
                </button>
                <div className="my-1 h-px bg-primary/10" aria-hidden="true" />
                <button className={menuButton} type="button" onClick={() => runAction(onAddCategory)}>
                  {t.addCategory}
                </button>
                <button className={menuButton} type="button" onClick={() => runAction(onManageCategories)}>
                  {t.manageCategories}
                </button>
                <div className="my-1 h-px bg-primary/10" aria-hidden="true" />
                <button
                  className={menuButton}
                  type="button"
                  onClick={() => runAction(onRefresh)}
                  disabled={loading}
                >
                  {loading ? t.refreshing : t.refresh}
                </button>
                <div className="my-1 h-px bg-primary/10" aria-hidden="true" />
                <button className={menuButton} type="button" onClick={() => runAction(onGoToMenu)}>
                  {t.goToMenu}
                </button>
                <button className={dangerMenuButton} type="button" onClick={() => runAction(onLogout)}>
                  {t.logout}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4" aria-label="Menu stats">
        {cards.map((card) => (
          <div className="grid min-h-[64px] content-center gap-1 rounded-2xl border border-primary/10 bg-white p-3 shadow-sm" key={card.label}>
            <span className="truncate text-[11px] font-extrabold text-muted">{card.label}</span>
            <strong className="text-[24px] font-black leading-none text-primary">{card.value}</strong>
          </div>
        ))}
      </div>
    </header>
  );
}
