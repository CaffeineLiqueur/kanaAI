# kanaAI 🐾

<p align="center">
  <img src="public/brand/wordmark.png" alt="kanaAI" width="280" />
</p>

<p align="center">
  <em>零基础学日语,顺便养只像素宠物。<br/>AI 老师讲到你懂,宠物陪你熬过五十音。</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-blue" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4" alt="Tailwind 4" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT" />
</p>

## 这是啥?

一个给中文母语者的日语学习 Web 应用:

- 🈶 **假名** — 平假名片假名图鉴式收集
- 📖 **词汇** — 卡片翻转 + 艾宾浩斯该忘的时候让你忘
- 📝 **语法** — AI 给你讲得明明白白,顺便造几个例句
- 💬 **AI 对话** — 选个场景(自我介绍 / 餐厅 / 购物…),AI 陪你练,说错了温柔地纠
- ✨ **测验** — 选择 / 填空 / 罗马音标注 / 翻译,系统默默给你记账
- 🐶 **宠物** — 柴犬 / 猫 / 兔子随便领养一只,学习涨经验,它就升级进化

> 设计走的是「和风 Riso 印刷」—— 暖白纸、硬边阴影、错版味儿。不是那种满屏像素宝可梦,现在更安静一点。

## 一行命令跑起来

前提:装了 [Docker Desktop](https://www.docker.com/products/docker-desktop/)。

```bash
# mac / linux
bash scripts/dev.sh

# windows
scripts\dev.bat
```

脚本会帮你:
1. 把 Docker Desktop 喊起来(如果你忘了)
2. 起一个 PostgreSQL 容器(`kanaai-postgres`,端口 5433)
3. 跑迁移、灌种子
4. `npm run dev` 启动

跑起来之后:
- 🌐 <http://localhost:3000>
- 👤 测试账号:`dev@kanaai.local` / `dev12345678`(已经有一只叫 ハチ 的柴犬在等你)

## 想自己折腾?

```bash
npm install
cp .env.example .env   # 填上 ANTHROPIC_API_KEY 或 OPENAI_API_KEY

# 起个 Postgres,改 DATABASE_URL 指过去
docker run -d --name kanaai-postgres \
  -e POSTGRES_USER=kanaai -e POSTGRES_PASSWORD=test123 -e POSTGRES_DB=kanaai \
  -p 5433:5432 postgres:16-alpine

npm run db:migrate
npm run db:seed
npm run dev
```

`.env` 里能配的:

```env
AI_PROVIDER=anthropic            # 或者 openai
ANTHROPIC_API_KEY=...
ANTHROPIC_BASE_URL=...            # 想走火山方舟 / 中转?填这里
OPENAI_API_KEY=...
VOICEVOX_ENGINE_URL=...           # 不填默认 http://localhost:50027
```

> AI 路由对火山方舟 / 中转 API 做了点适配:自动补 `/v1`,给不带 signature 的 thinking block 打补丁,免得 SDK 解析炸了。

## 怎么造宠物升级?

宠物有 4 个动作,写在 [src/app/api/pet/route.ts](src/app/api/pet/route.ts):

| 动作 | 干啥 |
| --- | --- |
| `feed` | 饱腹度 -20,心情 +10 |
| `pet` | 心情 +15(就是摸一下) |
| `sleep` | 饱腹度 +10(睡了就不饿了?) |
| `study` | 加经验,可能升级;升级到 Lv 11 / Lv 26 时触发进化 |

经验曲线:`expToNext = ⌊100 × 1.5^(level - 1)⌋`。也就是说从 Lv 1 升到 2 要 100 EXP,升到 3 要 150,升到 4 要 225……指数增长,后面越来越难。

## 技术栈(给好奇心重的人)

| | |
| --- | --- |
| 框架 | Next.js 16 App Router + React 19 |
| 语言 | TypeScript 5 |
| 样式 | Tailwind 4 + 「和风 Riso」主题 |
| 数据库 | PostgreSQL 16 + Prisma 7(用 `@prisma/adapter-pg`) |
| AI | Vercel AI SDK 6(Anthropic / OpenAI 都能接) |
| 认证 | 自己撸的 JWT(`jose` 签 HS256)+ bcrypt |
| 语音 | VOICEVOX 代理 |
| 动画 | Framer Motion |
| 状态 | Zustand |
| 字体 | Shippori Antique(日文)+ Noto Sans SC(中文)+ JetBrains Mono + Klee One |

## 项目长啥样

```
src/
├── app/
│   ├── (auth)/              登录 / 注册
│   ├── (main)/
│   │   ├── dashboard/       仪表板
│   │   ├── kana/            假名
│   │   ├── vocabulary/      词汇
│   │   ├── grammar/         语法
│   │   ├── practice/        AI 对话
│   │   ├── quiz/            测验
│   │   └── pet/             宠物
│   ├── api/                 auth / ai/chat / pet / progress / vocab-progress / quiz / tts
│   ├── home-view.tsx        公开首页(已登录自动跳到 /dashboard)
│   └── pixel-theme.css      Riso 配色 + 字体
├── components/ui/           PixelButton / PixelCard / Logo / SpeakerSelector / …
├── lib/
│   ├── auth.ts              bcrypt + 会话 cookie
│   ├── jwt.ts               jose 签发 / 解析
│   ├── ai/config.ts         AI provider + 系统提示词
│   └── tts/                 VOICEVOX Context
└── generated/prisma/        prisma generate 产物(Prisma 7 输出在这里)

prisma/
├── schema.prisma            User / Pet / Progress / VocabProgress / QuizResult
├── seed.ts                  灌 dev 用户 + 宠物 + 进度
└── migrations/

scripts/
├── dev.sh                   linux/mac 一键启动
└── dev.bat                  windows 一键启动
```

## 已经做好的 / 还在路上的

<p align="center">
  <img src="public/brand/mark.png" alt="kanaAI mascot" width="160" />
</p>

- [x] 认证、首页、所有学习页面
- [x] 宠物系统(等级 / 进化 / 互动)
- [x] 艾宾浩斯数据结构
- [x] AI 对话 + TTS
- [x] 一键启动脚本
- [x] Prisma 持久化 + 种子
- [ ] 像素宠物精灵图(现在还是 emoji 占位)
- [ ] 音效 / BGM
- [ ] 部署上线

## 提个 issue / PR?

来吧。学日语这事儿一个人学太孤单,代码也是。
