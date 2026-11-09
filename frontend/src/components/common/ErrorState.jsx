export default function ErrorState({ message, actionLabel, onAction }) {
  return (
    <div className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-primary/20 px-5 py-10 text-center text-muted">
      <p className="m-0">{message}</p>
      {onAction ? (
        <button
          className="min-h-10 rounded-full border border-primary/20 bg-white px-4 text-sm font-bold text-primary"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
