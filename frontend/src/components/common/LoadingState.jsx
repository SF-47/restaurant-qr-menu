export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="rounded-2xl border border-dashed border-primary/20 bg-white/70 p-5 text-center text-muted">
      <div className="mx-auto mb-2.5 h-6 w-6 animate-spin rounded-full border-4 border-primary/15 border-t-primary"></div>
      {message}
    </div>
  );
}
