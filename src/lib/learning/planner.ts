import type { DailyPlan, DailyPlanTask } from './types'
import { shouldPauseNewContent } from './mastery'

interface PlanInput {
  date: string
  goalMinutes: number
  dueReviews: Array<{ id: string; title: string }>
  nextLesson?: { id: string; title: string; durationMinutes: number }
  recentAccuracy?: number
}

export function buildDailyPlan(input: PlanInput): DailyPlan {
  const tasks: DailyPlanTask[] = []
  const reviewCount = Math.min(20, input.dueReviews.length)
  if (reviewCount) {
    tasks.push({
      id: 'reviews-due',
      kind: 'REVIEW',
      title: `复习 ${reviewCount} 张到期卡片`,
      description: '优先巩固已经到期的知识，避免遗忘。',
      estimatedMinutes: Math.min(8, Math.max(2, Math.ceil(reviewCount * 0.4))),
      status: 'PENDING',
      required: true,
      href: '/review',
    })
  }

  const pauseLesson = shouldPauseNewContent(input.dueReviews.length, input.recentAccuracy ?? 1)
  if (input.nextLesson && !pauseLesson) {
    const required = tasks.reduce((sum, item) => sum + (item.required ? item.estimatedMinutes : 0), 0) + input.nextLesson.durationMinutes <= input.goalMinutes
    tasks.push({
      id: input.nextLesson.id,
      kind: 'LESSON',
      title: input.nextLesson.title,
      description: required ? '沿主线继续学习一个新目标。' : '今天的时间留给复习，有空可以继续主线。',
      estimatedMinutes: input.nextLesson.durationMinutes,
      status: 'PENDING',
      required,
      href: `/learn/${input.nextLesson.id}`,
    })
  }

  if (!tasks.length && input.nextLesson) {
    tasks.push({
      id: input.nextLesson.id,
      kind: pauseLesson ? 'PRACTICE' : 'LESSON',
      title: pauseLesson ? '先巩固薄弱内容' : input.nextLesson.title,
      description: pauseLesson ? '近期正确率偏低，今天先不增加新内容。' : '沿主线继续学习一个新目标。',
      estimatedMinutes: Math.min(10, input.goalMinutes),
      status: 'PENDING',
      required: true,
      href: pauseLesson ? '/practice/checkpoint' : `/learn/${input.nextLesson.id}`,
    })
  }

  tasks.push({
    id: 'optional-listening',
    kind: 'PRACTICE',
    title: '听力热身',
    description: '用四分钟强化声音与意义的连接。',
    estimatedMinutes: 4,
    status: 'PENDING',
    required: false,
    href: '/practice/listening',
  })

  const required = tasks.filter((item) => item.required)

  return {
    date: input.date,
    tasks,
    estimatedMinutes: required.reduce((sum, item) => sum + item.estimatedMinutes, 0),
    completedCount: required.filter((item) => item.status === 'COMPLETED').length,
    totalCount: required.length,
  }
}
