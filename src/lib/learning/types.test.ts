import { describe, expect, it } from 'vitest'
import { generatedFeedbackSchema, generatedLessonPayloadSchema } from './types'

describe('AI content constraints', () => {
  it('rejects incomplete lesson variants and overly long feedback', () => {
    expect(generatedLessonPayloadSchema.safeParse({ objectiveCode: 'N5-KANA-01', explanation: '短', examples: [], activities: [], commonMistake: '错误', difficulty: 8 }).success).toBe(false)
    expect(generatedFeedbackSchema.safeParse({ explanation: '短', nextStep: '好' }).success).toBe(false)
    expect(generatedFeedbackSchema.safeParse({ explanation: '「は」表示句子的主题，这里不能用表示宾语的「を」。', nextStep: '重新组成完整句子。' }).success).toBe(true)
  })
})
