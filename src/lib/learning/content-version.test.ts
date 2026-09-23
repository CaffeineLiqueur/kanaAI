import { describe, expect, it } from 'vitest'
import { stableJson } from './content-version'

describe('content version comparison', () => {
  it('ignores JSONB object-key order but preserves array order', () => {
    expect(stableJson({ activities: [{ answer: 'a', id: '1' }], title: '第一课' })).toBe(stableJson({ title: '第一课', activities: [{ id: '1', answer: 'a' }] }))
    expect(stableJson({ activities: ['a', 'b'] })).not.toBe(stableJson({ activities: ['b', 'a'] }))
  })
})
