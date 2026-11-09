export default function SectionTitle({ title, description, id }) {
  return (
    <div className="mb-4 grid gap-1 text-start">
      <h2 id={id} className="m-0 text-2xl font-extrabold tracking-tight text-primary">
        {title}
      </h2>
      {description ? <p className="m-0 text-sm text-muted">{description}</p> : null}
    </div>
  );
}
