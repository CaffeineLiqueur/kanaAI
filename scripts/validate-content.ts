import { N5_COURSE, N5_VOCABULARY, TOTAL_LESSONS, TOTAL_VOCABULARY_TARGET } from '../src/content/curriculum'
import { activityDefinitionSchema } from '../src/lib/learning/types'

const errors: string[] = []
const activityIds = new Set<string>()
const wordPairs = new Set<string>()
const wordByCode = new Map(N5_VOCABULARY.map((word) => [`N5-WORD-${word.id}`, word]))
const testedWords = new Set<string>()

for (const unit of N5_COURSE.units) {
  if (!unit.lessons.length) errors.push(`${unit.slug}: 缺少课程`)

  for (const lesson of unit.lessons) {
    if (!lesson.explanation || !lesson.examples.length || !lesson.activities.length) {
      errors.push(`${unit.slug}/${lesson.slug}: 固定回退内容不完整`)
    }
    for (const activity of lesson.activities) {
      const result = activityDefinitionSchema.safeParse(activity)
      if (!result.success) errors.push(`${activity.id}: ${result.error.message}`)
      if (activityIds.has(activity.id)) errors.push(`${activity.id}: 活动 ID 重复`)
      if (activity.objectiveCode !== lesson.objective.code) {
        const word = wordByCode.get(activity.objectiveCode)
        if (!word || !lesson.examples.some((example) => example.japanese === word.japanese && example.reading === word.reading)) errors.push(`${activity.id}: 目标引用无效`)
        if (activity.id === `vocab-${word?.id}`) testedWords.add(activity.objectiveCode)
      }
      if (activity.content.options) {
        if (new Set(activity.content.options).size !== activity.content.options.length) errors.push(`${activity.id}: 选项重复`)
        if (typeof activity.answer.value === 'string' && activity.content.options.filter((option) => option === activity.answer.value).length !== 1) errors.push(`${activity.id}: 正确答案不唯一`)
      }
      if (activity.type === 'ORDERING') {
        const tokens = activity.content.tokens || []
        const answer = activity.answer.value
        if (!Array.isArray(answer) || tokens.length < 2 || new Set(tokens).size !== tokens.length || answer.length !== tokens.length || [...tokens].sort().join('|') !== [...answer].sort().join('|')) errors.push(`${activity.id}: 排序题词块或答案无效`)
      }
      activityIds.add(activity.id)
    }
  }
}

if (N5_COURSE.units.length !== 12) errors.push(`应有 12 个单元，当前为 ${N5_COURSE.units.length}`)
if (TOTAL_VOCABULARY_TARGET !== 800) errors.push(`词汇目标应为 800，当前为 ${TOTAL_VOCABULARY_TARGET}`)
if (N5_VOCABULARY.length !== 800) errors.push(`实际词汇应为 800，当前为 ${N5_VOCABULARY.length}`)
if (testedWords.size !== N5_VOCABULARY.length) errors.push(`逐词练习未覆盖全部词汇：${testedWords.size}/${N5_VOCABULARY.length}`)
for (const word of N5_VOCABULARY) {
  if (!word.japanese || !word.reading || !word.chinese) errors.push(`${word.id}: 缺少日文、读音或中文释义`)
  if (word.matchScore < 1 && !word.reviewedOverride) errors.push(`${word.id}: 低置信词义未审查`)
  const pair = `${word.japanese}:${word.reading}`
  if (wordPairs.has(pair)) errors.push(`${word.id}: 词汇重复`)
  wordPairs.add(pair)
}
if (TOTAL_LESSONS < 24) errors.push(`课程应至少有 24 节，当前为 ${TOTAL_LESSONS}`)

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`内容校验通过：12 单元，${TOTAL_LESSONS} 节课，${N5_VOCABULARY.length} 个实际词条，${activityIds.size} 个固定活动。`)
