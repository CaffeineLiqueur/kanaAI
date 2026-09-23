import { createHash } from 'node:crypto'
import { generateText, Output } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth'
import { getAIModel, getAIModelName } from '@/lib/ai/model'
import { generatedFeedbackSchema } from '@/lib/learning/types'
import { prisma } from '@/lib/prisma'

const schema = z.object({ attemptId: z.string().min(1) })
const PROMPT_VERSION = 'feedback-v1'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 })
  const parsed = schema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: '反馈请求格式错误' }, { status: 400 })
  const attempt = await prisma.attempt.findFirst({ where: { id: parsed.data.attemptId, userId: user.id }, include: { activityTemplate: true } })
  if (!attempt) return NextResponse.json({ error: '作答记录不存在' }, { status: 404 })
  const fixed = { source: 'fixed', explanation: attempt.activityTemplate?.explanation || attempt.feedback, nextStep: '回到课程示例，再试一道同目标练习。' }
  if (attempt.correct || !attempt.activityTemplate) return NextResponse.json(fixed)

  const cacheKey = createHash('sha256').update(`${PROMPT_VERSION}:${attempt.id}`).digest('hex')
  const cached = await prisma.generatedContent.findUnique({ where: { cacheKey } })
  if (cached?.status === 'VALID' && cached.content) {
    const content = generatedFeedbackSchema.safeParse(cached.content)
    if (content.success) return NextResponse.json({ source: 'ai', ...content.data })
  }
  if (cached && cached.expiresAt && cached.expiresAt > new Date()) return NextResponse.json(fixed)

  const started = Date.now()
  const record = await prisma.generatedContent.upsert({
    where: { cacheKey },
    update: { status: 'PENDING', error: null, expiresAt: new Date(Date.now() + 30000) },
    create: { lessonId: attempt.activityTemplate.lessonId, cacheKey, promptVersion: PROMPT_VERSION, model: getAIModelName(), status: 'PENDING', expiresAt: new Date(Date.now() + 30000) },
  })
  try {
    const result = await generateText({
      model: getAIModel(),
      output: Output.object({ schema: generatedFeedbackSchema }),
      abortSignal: AbortSignal.timeout(8000),
      system: '你是 kanaAI 的 N5 日语学习反馈老师。只解释本题的已知错误并提出一个简短的重试动作。不得更改正确答案、评分或课程范围。使用简体中文，不推断学习者个人特征。',
      prompt: JSON.stringify({ prompt: attempt.activityTemplate.prompt, material: attempt.activityTemplate.content, answer: attempt.activityTemplate.answer, learnerAnswer: JSON.stringify(attempt.answer).slice(0, 200), fixedExplanation: attempt.activityTemplate.explanation }),
    })
    await prisma.generatedContent.update({ where: { id: record.id }, data: { status: 'VALID', content: result.output, latencyMs: Date.now() - started, expiresAt: new Date(Date.now() + 30 * 86400000) } })
    return NextResponse.json({ source: 'ai', ...result.output })
  } catch (error) {
    await Promise.all([
      prisma.generatedContent.update({ where: { id: record.id }, data: { status: 'FALLBACK', error: error instanceof Error ? error.message.slice(0, 500) : 'AI_ERROR', latencyMs: Date.now() - started, expiresAt: new Date(Date.now() + 60 * 60000) } }),
      prisma.eventLog.create({ data: { userId: user.id, name: 'ai_fallback', payload: { attemptId: attempt.id, cacheKey, kind: 'feedback' } } }),
    ])
    return NextResponse.json(fixed)
  }
}
