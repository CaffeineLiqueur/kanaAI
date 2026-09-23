const MAX_ENTRIES = 100
const TTL_MS = 24 * 60 * 60 * 1000
const entries = new Map<string, { bytes: ArrayBuffer; expiresAt: number }>()

export function getCachedAudio(key: string, now = Date.now()) {
  const entry = entries.get(key)
  if (!entry) return null
  if (entry.expiresAt <= now) { entries.delete(key); return null }
  entries.delete(key)
  entries.set(key, entry)
  return entry.bytes
}

export function cacheAudio(key: string, bytes: ArrayBuffer, now = Date.now()) {
  entries.delete(key)
  entries.set(key, { bytes, expiresAt: now + TTL_MS })
  while (entries.size > MAX_ENTRIES) entries.delete(entries.keys().next().value!)
}
