import { fsrs, Rating, State, type Card, type Grade } from 'ts-fsrs'

export type ReviewGrade = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY'

export interface StoredReviewCard {
  due: Date
  stability: number
  difficulty: number
  elapsedDays: number
  scheduledDays: number
  learningSteps: number
  reps: number
  lapses: number
  state: number
  lastReview: Date | null
}

const scheduler = fsrs({ enable_fuzz: true, maximum_interval: 365 })

export const GRADE_MAP: Record<ReviewGrade, Grade> = {
  AGAIN: Rating.Again,
  HARD: Rating.Hard,
  GOOD: Rating.Good,
  EASY: Rating.Easy,
}

export function toFsrsCard(card: StoredReviewCard): Card {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    learning_steps: card.learningSteps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as State,
    ...(card.lastReview ? { last_review: card.lastReview } : {}),
  }
}

export function scheduleReview(card: StoredReviewCard, grade: ReviewGrade, now = new Date()) {
  return scheduler.next(toFsrsCard(card), now, GRADE_MAP[grade])
}
