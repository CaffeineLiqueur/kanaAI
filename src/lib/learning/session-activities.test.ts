import { describe, expect, it } from 'vitest'
import { publicSessionActivity, sessionActivitySchema } from './session-activities'

describe('session activity snapshot', () => {
  it('keeps the answer server-side while exposing a playable prompt', () => {
    const activity = sessionActivitySchema.parse({
      templateId: 'template-1', objectiveId: 'objective-1', lessonId: 'lesson-1', type: 'MULTIPLE_CHOICE',
      prompt: '选择读音', content: { japanese: 'あ', options: ['a', 'i'] }, answer: { value: 'a' }, explanation: '读作 a。',
    })
    expect(publicSessionActivity(activity)).toEqual({ id: 'template-1', type: 'MULTIPLE_CHOICE', prompt: '选择读音', content: { japanese: 'あ', options: ['a', 'i'] } })
    expect(JSON.stringify(publicSessionActivity(activity))).not.toContain('explanation')
  })
})
