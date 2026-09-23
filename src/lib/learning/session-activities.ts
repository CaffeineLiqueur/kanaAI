import { z } from 'zod'
import { activityDefinitionSchema } from './types'

export const sessionActivitySchema = activityDefinitionSchema.pick({ type: true, prompt: true, content: true, answer: true, explanation: true }).extend({
  templateId: z.string(),
  objectiveId: z.string().nullable(),
  lessonId: z.string(),
})

export type SessionActivity = z.infer<typeof sessionActivitySchema>

export function publicSessionActivity(activity: SessionActivity) {
  return { id: activity.templateId, type: activity.type, prompt: activity.prompt, content: activity.content }
}
