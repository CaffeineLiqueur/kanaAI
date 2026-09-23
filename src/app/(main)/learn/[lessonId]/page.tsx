import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { sessionActivitySchema, publicSessionActivity } from '@/lib/learning/session-activities'
import { LessonPlayer } from './lesson-player'
import { requireOnboardedUser } from '@/lib/dal'

export default async function LearnPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params
  const [lesson, user] = await Promise.all([
    prisma.lesson.findUnique({ where: { id: lessonId }, include: { activities: { orderBy: { order: 'asc' } } } }),
    requireOnboardedUser(),
  ])
  if (!lesson) notFound()
  const content = lesson.fallbackContent as unknown as { objectiveCode: string; explanation: string; examples: Array<{ japanese: string; chinese: string; reading: string }> }
  const activities = lesson.activities.map((activity) => publicSessionActivity(sessionActivitySchema.parse({
    templateId: activity.id, objectiveId: activity.objectiveId, lessonId: activity.lessonId,
    type: activity.type, prompt: activity.prompt, content: activity.content, answer: activity.answer, explanation: activity.explanation,
  })))
  return <LessonPlayer lessonId={lesson.id} title={lesson.title} summary={lesson.summary} content={content} activities={activities} kanaHints={user.kanaHints} ttsEnabled={user.ttsEnabled} />
}
