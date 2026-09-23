export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div>{eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}<h1 className="page-title">{title}</h1>{description && <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{description}</p>}</div>{action}</div>
}
