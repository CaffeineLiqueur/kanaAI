export interface MasteryInput {
  previousScore: number
  attempts: number
  correct: boolean
  activityWeight?: number
}

export function calculateMastery({ previousScore, attempts, correct, activityWeight = 1 }: MasteryInput) {
  const evidence = correct ? 1 : 0
  const confidence = Math.min(0.32, 0.16 + attempts * 0.02) * activityWeight
  const next = previousScore + (evidence - previousScore) * confidence
  return Math.max(0, Math.min(1, Number(next.toFixed(4))))
}

export function shouldPauseNewContent(dueReviews: number, recentAccuracy: number) {
  return dueReviews > 20 || recentAccuracy < 0.6
}
