import { describe, expect, it } from 'vitest'
import { cacheAudio, getCachedAudio } from './cache'

describe('TTS cache', () => {
  it('returns a cached recording until it expires', () => {
    const bytes = new Uint8Array([1, 2, 3]).buffer
    cacheAudio('voice-1', bytes, 100)
    expect(getCachedAudio('voice-1', 101)).toBe(bytes)
    expect(getCachedAudio('voice-1', 100 + 86400000)).toBeNull()
  })
})
