'use client'

export function OrderingInput({ tokens, value, onChange, disabled = false }: { tokens: string[]; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const selected = value ? value.split('|') : []
  const remaining = tokens.filter((token) => !selected.includes(token))

  return <div className="mt-5" aria-label="排序造句">
    <div className="min-h-16 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3">
      {selected.length ? <div className="flex flex-wrap gap-2">{selected.map((token, index) => <button key={`${token}-${index}`} type="button" disabled={disabled} onClick={() => onChange(selected.filter((_, position) => position !== index).join('|'))} className="min-h-10 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-3 font-semibold" aria-label={`移除第 ${index + 1} 个词块 ${token}`}>{token}</button>)}</div> : <p className="py-2 text-sm text-[var(--muted)]">依次选择下方词块</p>}
    </div>
    <div className="mt-3 flex flex-wrap gap-2" aria-label="可选词块">{remaining.map((token) => <button key={token} type="button" disabled={disabled} onClick={() => onChange([...selected, token].join('|'))} className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 font-semibold hover:border-[var(--accent)]">{token}</button>)}</div>
    {!disabled && selected.length > 0 && <button type="button" className="mt-3 text-sm font-semibold text-[var(--accent-strong)]" onClick={() => onChange('')}>重新排列</button>}
  </div>
}
