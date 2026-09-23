import { createHash } from 'node:crypto'
import { after, NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateText, Output } from 'ai'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatedLessonPayloadSchema } from '@/lib/learning/types'
import { getAIModel, getAIModelName } from '@/lib/ai/model'

const requestSchema = z.object({ lessonId: z.string().min(1), variant: z.enum(['examples', 'practice']).default('examples') })
const PROMPT_VERSION = 'lesson-v1'

async function generateAndCache(id: string, lesson: { id: string; title: string; fallbackContent: unknown }) {
  const started = Date.now()
  try {
    const result = await generateText({
      model: getAIModel(),
      output: Output.object({ schema: generatedLessonPayloadSchema }),
      abortSignal: AbortSignal.timeout(8000),
      system: '你是 kanaAI 的日语课程内容生成器。课程目标、答案边界和 N5 难度不可改变。只输出 schema 要求的简体中文解释与日语素材，不得引入 N4 以上语法。',
      prompt: `为课程「${lesson.title}」生成同目标的练习变体。固定核心内容如下：${JSON.stringify(lesson.fallbackContent)}`,
    })
    if (result.output.objectiveCode !== (lesson.fallbackContent as { objectiveCode?: string }).objectiveCode) throw new Error('AI_OBJECTIVE_MISMATCH')
    await prisma.generatedContent.update({ where: { id }, data: { status: 'VALID', content: result.output, latencyMs: Date.now() - started, expiresAt: new Date(Date.now() + 30 * 86400000) } })
  } catch (error) {
    await prisma.generatedContent.update({ where: { id }, data: { status: 'FALLBACK', error: error instanceof Error ? error.message.slice(0, 500) : 'AI_ERROR', latencyMs: Date.now() - started, expiresAt: new Date(Date.now() + 60 * 60000) } })
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: '内容请求格式错误' }, { status: 400 })
  const lesson = await prisma.lesson.findUnique({ where: { id: parsed.data.lessonId } })
  if (!lesson) return NextResponse.json({ error: '课程不存在' }, { status: 404 })
  const cacheKey = createHash('sha256').update(`${lesson.id}:${PROMPT_VERSION}:${parsed.data.variant}:${JSON.stringify(lesson.fallbackContent)}`).digest('hex')
  const cached = await prisma.generatedContent.findUnique({ where: { cacheKey } })
  if (cached?.status === 'VALID' && cached.content && (!cached.expiresAt || cached.expiresAt > new Date())) {
    const content = generatedLessonPayloadSchema.safeParse(cached.content)
    if (content.success) return NextResponse.json({ source: 'ai', content: { objectiveCode: content.data.objectiveCode, explanation: content.data.explanation, examples: content.data.examples, commonMistake: content.data.commonMistake }, contentVersion: cached.id })
  }
  const expired = !cached?.expiresAt || cached.expiresAt <= new Date()
  if (!cached || (cached.status === 'FALLBACK' && expired) || (cached.status === 'PENDING' && expired) || (cached.status === 'VALID' && !generatedLessonPayloadSchema.safeParse(cached.content).success)) {
    const record = await prisma.generatedContent.upsert({ where: { cacheKey }, update: { status: 'PENDING', error: null, expiresAt: new Date(Date.now() + 30000) }, create: { lessonId: lesson.id, cacheKey, promptVersion: PROMPT_VERSION, model: getAIModelName(), status: 'PENDING', expiresAt: new Date(Date.now() + 30000) } })
    after(() => generateAndCache(record.id, lesson))
  }
  await prisma.eventLog.create({ data: { userId: user.id, name: 'ai_fallback', payload: { lessonId: lesson.id, cacheKey } } })
  return NextResponse.json({ source: 'fallback', content: lesson.fallbackContent, retryable: true })
}
