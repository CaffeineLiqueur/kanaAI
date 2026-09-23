import 'dotenv/config'
import { PrismaClient, ActivityType, ContentSource } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import { N5_COURSE, N5_VOCABULARY } from '../src/content/curriculum'
import { stableJson } from '../src/lib/learning/content-version'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })
const vocabularyByCode = new Map(N5_VOCABULARY.map((word) => [`N5-WORD-${word.id}`, word]))

async function seedCurriculum() {
  const course = await prisma.course.upsert({
    where: { slug: N5_COURSE.slug },
    update: { title: N5_COURSE.title, description: N5_COURSE.description, version: N5_COURSE.version, published: true },
    create: { slug: N5_COURSE.slug, title: N5_COURSE.title, description: N5_COURSE.description, level: N5_COURSE.level, version: N5_COURSE.version, published: true },
  })

  for (const [unitIndex, unitData] of N5_COURSE.units.entries()) {
    const unit = await prisma.unit.upsert({
      where: { courseId_slug: { courseId: course.id, slug: unitData.slug } },
      update: { title: unitData.title, description: unitData.description, order: unitIndex + 1, vocabularyTarget: unitData.vocabularyTarget, grammarTopics: unitData.grammarTopics },
      create: { courseId: course.id, slug: unitData.slug, title: unitData.title, description: unitData.description, order: unitIndex + 1, vocabularyTarget: unitData.vocabularyTarget, grammarTopics: unitData.grammarTopics },
    })

    for (const [lessonIndex, lessonData] of unitData.lessons.entries()) {
      const fallbackContent = { objectiveCode: lessonData.objective.code, explanation: lessonData.explanation, examples: lessonData.examples, activities: lessonData.activities }
      const lesson = await prisma.lesson.upsert({
        where: { unitId_slug: { unitId: unit.id, slug: lessonData.slug } },
        update: { title: lessonData.title, summary: lessonData.summary, order: lessonIndex + 1, durationMinutes: lessonData.durationMinutes, fallbackContent },
        create: { unitId: unit.id, slug: lessonData.slug, title: lessonData.title, summary: lessonData.summary, order: lessonIndex + 1, durationMinutes: lessonData.durationMinutes, fallbackContent },
      })
      const objective = await prisma.learningObjective.upsert({
        where: { code: lessonData.objective.code },
        update: { lessonId: lesson.id, ...lessonData.objective, order: 1 },
        create: { lessonId: lesson.id, ...lessonData.objective, order: 1 },
      })
      const existingActivities = await prisma.activityTemplate.findMany({ where: { lessonId: lesson.id }, select: { id: true, order: true }, orderBy: { order: 'asc' } })
      if (existingActivities.some((activity) => lessonData.activities.findIndex((item) => item.id === activity.id) + 1 !== activity.order)) {
        for (const [index, activity] of existingActivities.entries()) {
          await prisma.activityTemplate.update({ where: { id: activity.id }, data: { order: -(index + 1) } })
        }
      }
      for (const [index, activity] of lessonData.activities.entries()) {
        const word = vocabularyByCode.get(activity.objectiveCode)
        const activityObjective = word ? await prisma.learningObjective.upsert({
          where: { code: activity.objectiveCode },
          update: { lessonId: lesson.id, title: word.japanese, description: `读音：${word.reading}。常见意义：${word.chinese}。`, kind: 'vocabulary', order: index + 2 },
          create: { lessonId: lesson.id, code: activity.objectiveCode, title: word.japanese, description: `读音：${word.reading}。常见意义：${word.chinese}。`, kind: 'vocabulary', order: index + 2 },
        }) : objective
        const data = { lessonId: lesson.id, objectiveId: activityObjective.id, type: activity.type as ActivityType, order: index + 1, prompt: activity.prompt, content: activity.content, answer: activity.answer, explanation: activity.explanation }
        await prisma.activityTemplate.upsert({ where: { id: activity.id }, update: data, create: { id: activity.id, ...data } })
      }
      const latest = await prisma.contentVersion.findFirst({ where: { lessonId: lesson.id }, orderBy: { version: 'desc' } })
      if (!latest || stableJson(latest.content) !== stableJson(fallbackContent)) {
        await prisma.contentVersion.create({ data: { lessonId: lesson.id, version: (latest?.version || 0) + 1, content: fallbackContent, source: ContentSource.CURATED } })
      }
    }
  }
  return course
}

async function seedOptionalDeveloper(courseId: string) {
  const email = process.env.SEED_USER_EMAIL
  const password = process.env.SEED_USER_PASSWORD
  if (!email || !password) return
  if (password.length < 12 || /^replace_with_|^your_/i.test(password)) throw new Error('SEED_USER_PASSWORD 必须是至少 12 位的本地开发密码')
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: process.env.SEED_USER_NAME || '学习者', password: await bcrypt.hash(password, 10) },
  })
  await prisma.companion.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } })
  await prisma.streak.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } })
  const firstLesson = await prisma.lesson.findFirst({ where: { unit: { courseId } }, orderBy: [{ unit: { order: 'asc' } }, { order: 'asc' }] })
  await prisma.enrollment.upsert({ where: { userId_courseId: { userId: user.id, courseId } }, update: {}, create: { userId: user.id, courseId, currentLessonId: firstLesson?.id } })
}

async function main() {
  const course = await seedCurriculum()
  await seedOptionalDeveloper(course.id)
  console.log(`课程种子完成：${N5_COURSE.units.length} 个单元`)
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
