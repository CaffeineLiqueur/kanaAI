import { z } from 'zod';

export const activityTypeSchema = z.enum([
  'KANA_TRACE',
  'LISTENING_CHOICE',
  'MULTIPLE_CHOICE',
  'MATCHING',
  'ORDERING',
  'TEXT_INPUT',
  'ERROR_CORRECTION',
  'READING',
  'CHECKPOINT',
]);

export const activityDefinitionSchema = z.object({
  id: z.string(),
  type: activityTypeSchema,
  objectiveCode: z.string(),
  prompt: z.string().min(1),
  content: z.object({
    japanese: z.string().optional(),
    chinese: z.string().optional(),
    romaji: z.string().optional(),
    options: z.array(z.string()).optional(),
    tokens: z.array(z.string()).optional(),
    traceCharacter: z.string().optional(),
    audioText: z.string().optional(),
  }),
  answer: z.object({
    value: z.union([z.string(), z.array(z.string())]),
    accepted: z.array(z.string()).optional(),
  }),
  explanation: z.string().min(1),
});

export const generatedLessonPayloadSchema = z.object({
  objectiveCode: z.string(),
  explanation: z.string().min(20).max(1200),
  examples: z.array(z.object({
    japanese: z.string().min(1),
    chinese: z.string().min(1),
    reading: z.string().min(1),
  })).min(2).max(5),
  activities: z.array(activityDefinitionSchema).min(2).max(6),
  commonMistake: z.string().min(5).max(300),
  difficulty: z.number().int().min(1).max(5),
});

export const generatedFeedbackSchema = z.object({
  explanation: z.string().min(15).max(500),
  nextStep: z.string().min(5).max(160),
});

export const attemptResultSchema = z.object({
  correct: z.boolean(),
  score: z.number().min(0).max(1),
  errorType: z.string().nullable(),
  feedback: z.string(),
  masteryDelta: z.number(),
  rewardExp: z.number().int().min(0),
});

export type ActivityDefinition = z.infer<typeof activityDefinitionSchema>;
export type GeneratedLessonPayload = z.infer<typeof generatedLessonPayloadSchema>;
export type AttemptResult = z.infer<typeof attemptResultSchema>;

export interface DailyPlanTask {
  id: string;
  kind: 'REVIEW' | 'LESSON' | 'PRACTICE';
  title: string;
  description: string;
  href: string;
  estimatedMinutes: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'SKIPPED';
  required: boolean;
}

export interface DailyPlan {
  date: string;
  estimatedMinutes: number;
  completedCount: number;
  totalCount: number;
  tasks: DailyPlanTask[];
}
