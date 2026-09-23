import { describe, expect, it } from 'vitest'
import { buildDailyPlan } from './planner'
import { calculateMastery } from './mastery'
import { GRADE_MAP, scheduleReview } from './fsrs'
import { Rating } from 'ts-fsrs'

describe('daily planner', () => {
  it('limits mandatory reviews and pauses a lesson when backlog is high', () => {
    const dueReviews = Array.from({ length: 28 }, (_, index) => ({ id: `${index}`, title: '复习' }))
    const plan = buildDailyPlan({
      date: '2026-09-22',
      goalMinutes: 15,
      dueReviews,
      nextLesson: { id: 'lesson-1', title: '第一课', durationMinutes: 12 },
      recentAccuracy: 0.9,
    })
    expect(plan.tasks[0]?.title).toContain('20')
    expect(plan.tasks.filter((item) => item.required)).toHaveLength(1)
    expect(plan.estimatedMinutes).toBeLessThanOrEqual(8)
  })
  it('offers the lesson without making a long day mandatory', () => {
    const plan = buildDailyPlan({ date: '2026-09-22', goalMinutes: 10, dueReviews: [{ id: 'r1', title: '复习' }], nextLesson: { id: 'lesson-1', title: '第一课', durationMinutes: 10 }, recentAccuracy: 1 })
    expect(plan.tasks.find((item) => item.kind === 'LESSON')?.required).toBe(false)
    expect(plan.tasks.find((item) => item.kind === 'REVIEW')?.required).toBe(true)
  })
})

describe('mastery', () => {
  it('only changes from attempt evidence and stays within range', () => {
    expect(calculateMastery({ previousScore: 0.4, attempts: 2, correct: true })).toBeGreaterThan(0.4)
    expect(calculateMastery({ previousScore: 0.4, attempts: 2, correct: false })).toBeLessThan(0.4)
  })
})

describe('FSRS mapping', () => {
  it('maps four product ratings and advances a card', () => {
    expect(GRADE_MAP).toEqual({ AGAIN: Rating.Again, HARD: Rating.Hard, GOOD: Rating.Good, EASY: Rating.Easy })
    const now = new Date('2026-09-22T08:00:00Z')
    const result = scheduleReview({ due: now, stability: 0, difficulty: 0, elapsedDays: 0, scheduledDays: 0, learningSteps: 0, reps: 0, lapses: 0, state: 0, lastReview: null }, 'GOOD', now)
    expect(result.card.reps).toBe(1)
    expect(result.card.due.getTime()).toBeGreaterThan(now.getTime())
  })
})
