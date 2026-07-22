import AdminItemCard from "./AdminItemCard";

export default function AdminItemList({
  items,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleAvailable,
  t,
}) {
  if (loading) {
    return <div className="mx-auto w-full max-w-[1180px] rounded-2xl border border-dashed border-primary/20 bg-white/80 p-4 text-center text-muted shadow-card">{t.loading}</div>;
  }
  if (error) {
    return <div className="mx-auto w-full max-w-[1180px] rounded-2xl border border-dashed border-primary/20 bg-white/80 p-4 text-center text-muted shadow-card">{error}</div>;
  }
  if (items.length === 0) {
    return <div className="mx-auto w-full max-w-[1180px] rounded-2xl border border-dashed border-primary/20 bg-white/80 p-4 text-center text-muted shadow-card">{t.noItems}</div>;
  }

  return (
    <div className="mx-auto grid w-full max-w-[1180px] gap-2.5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <AdminItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleAvailable={onToggleAvailable}
          t={t}
        />
      ))}
    </div>
  );
}
