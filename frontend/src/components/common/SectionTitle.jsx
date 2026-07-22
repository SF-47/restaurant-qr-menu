export default function SectionTitle({ eyebrow, title, description, id }) {
  return (
    <div className="mb-2.5 grid gap-1.5 text-start">
      {eyebrow ? (
        <span className="w-fit rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 id={id} className="m-0 text-2xl font-black leading-tight text-primary">
        {title}
      </h2>
      {description ? <p className="m-0 text-[13px] text-muted">{description}</p> : null}
    </div>
  );
}
