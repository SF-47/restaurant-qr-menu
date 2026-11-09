import AdminItemCard from "./AdminItemCard";
import { btn, surface } from "./adminUi";

function Message({ children }) {
  return (
    <div className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-primary/20 px-5 py-10 text-center text-muted">
      {children}
    </div>
  );
}

export default function AdminItemList({
  items,
  loading,
  error,
  language,
  onEdit,
  onDelete,
  onToggleAvailable,
  onRetry,
  t,
}) {
  if (loading && items.length === 0) {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label={t.loading}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${surface} grid animate-pulse gap-3 p-4`} aria-hidden="true">
            <div className="h-4 w-2/3 rounded bg-primary/10" />
            <div className="h-3 w-1/3 rounded bg-primary/10" />
            <div className="h-8 rounded bg-primary/5" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Message>
        <p className="m-0">{error}</p>
        <button className={btn.secondary} type="button" onClick={onRetry}>
          {t.refresh}
        </button>
      </Message>
    );
  }

  if (items.length === 0) return <Message>{t.noItems}</Message>;

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <AdminItemCard
          key={item.id}
          item={item}
          language={language}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAvailable={onToggleAvailable}
          t={t}
        />
      ))}
    </div>
  );
}
