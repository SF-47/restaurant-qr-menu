// Skeleton shaped like the menu rows, so the layout doesn't jump when items load.
export default function LoadingState({ message = "Loading..." }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{message}</span>
      <div className="grid gap-3 md:grid-cols-2" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex animate-pulse items-center gap-4 rounded-2xl bg-white p-4">
            <div className="grid flex-1 gap-2">
              <div className="h-4 w-2/3 rounded bg-primary/10" />
              <div className="h-3 w-1/3 rounded bg-primary/10" />
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
