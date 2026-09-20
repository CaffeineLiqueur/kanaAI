import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  const seedUserName = process.env.SEED_USER_NAME || '开发者'
  const seedUserEmail = process.env.SEED_USER_EMAIL
  const seedUserPassword = process.env.SEED_USER_PASSWORD

  if (!seedUserEmail || !seedUserPassword || /^replace_with_|^your_/i.test(seedUserPassword)) {
    throw new Error('Set SEED_USER_EMAIL and a local-only SEED_USER_PASSWORD before running the seed script')
  }

  if (seedUserPassword.length < 12) {
    throw new Error('SEED_USER_PASSWORD must contain at least 12 characters')
  }

  const hashedPassword = await bcrypt.hash(seedUserPassword, 10)

  const devUser = await prisma.user.upsert({
    where: { email: seedUserEmail },
    update: {},
    create: {
      name: seedUserName,
      email: seedUserEmail,
      password: hashedPassword,
    },
  })

  console.log(`✅ Created dev user: ${devUser.name} (${devUser.email})`)

  // Create pet for dev user
  const pet = await prisma.pet.upsert({
    where: { userId: devUser.id },
    update: {},
    create: {
      userId: devUser.id,
      name: 'ハチ',
      species: 'dog',
      level: 5,
      exp: 120,
      happiness: 85,
      hunger: 25,
      evolution: 1,
    },
  })

  console.log(`✅ Created pet: ${pet.name} (Lv.${pet.level})`)

  // Create some kana progress
  const kanaItems = ['あ', 'い', 'う', 'か', 'き']
  for (const item of kanaItems) {
    await prisma.progress.upsert({
      where: {
        userId_module_itemId: {
          userId: devUser.id,
          module: 'kana',
          itemId: item,
        },
      },
      update: {},
      create: {
        userId: devUser.id,
        module: 'kana',
        itemId: item,
        mastered: true,
        reviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
  }

  console.log(`✅ Created kana progress: ${kanaItems.join(', ')}`)

  // Create some vocabulary progress
  const vocabItems = [
    { wordId: '1', level: 3 },
    { wordId: '2', level: 2 },
    { wordId: '4', level: 4 },
    { wordId: '5', level: 5 },
  ]

  for (const item of vocabItems) {
    await prisma.vocabProgress.upsert({
      where: {
        userId_wordId: {
          userId: devUser.id,
          wordId: item.wordId,
        },
      },
      update: {},
      create: {
        userId: devUser.id,
        wordId: item.wordId,
        level: item.level,
        nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        correctCount: item.level * 2,
        wrongCount: Math.max(0, 5 - item.level),
      },
    })
  }

  console.log(`✅ Created vocabulary progress for ${vocabItems.length} words`)

  // Create grammar progress
  const grammarItems = ['1']
  for (const item of grammarItems) {
    await prisma.progress.upsert({
      where: {
        userId_module_itemId: {
          userId: devUser.id,
          module: 'grammar',
          itemId: item,
        },
      },
      update: {},
      create: {
        userId: devUser.id,
        module: 'grammar',
        itemId: item,
        mastered: true,
        reviewAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    })
  }

  console.log(`✅ Created grammar progress`)

  // Create a sample quiz result
  await prisma.quizResult.create({
    data: {
      userId: devUser.id,
      type: 'kana-vocab',
      score: 4,
      total: 5,
      details: {
        questions: [
          { question: '「あ」的罗马音是？', answer: 'a', correct: true },
          { question: '「ありがとう」的意思是？', answer: '谢谢', correct: true },
          { question: '「水」的读音是？', answer: 'みず', correct: true },
          { question: '「一」的罗马音是？', answer: 'ichi', correct: true },
          { question: '「お父さん」的意思是？', answer: '妈妈', correct: false },
        ],
        scorePercentage: 80,
      },
    },
  })

  console.log('✅ Created sample quiz result')

  console.log('\n🎉 Seeding completed!')
  console.log('Seed user configured from SEED_USER_* environment variables.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
