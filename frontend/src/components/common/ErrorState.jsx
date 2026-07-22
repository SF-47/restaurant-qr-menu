export default function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-primary/20 bg-white/70 p-5 text-center text-muted">
      {message}
    </div>
  );
}
