# kanaAI — AI 日语学习应用

> 从零开始,和一只像素宠物一起学日语。
> 「和风 Riso 印刷」视觉风格的 Web 应用,集成 AI 老师、艾宾浩斯复习、宠物养成。

![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![React 19](https://img.shields.io/badge/React-19-blue) ![Tailwind 4](https://img.shields.io/badge/Tailwind-4-06B6D4) ![Prisma 7](https://img.shields.io/badge/Prisma-7-2D3748) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能

### 📚 学习模块
- **假名学习** — 平假名 / 片假名图鉴式收集
- **词汇** — 基础单词卡片 + 艾宾浩斯遗忘曲线复习
- **语法** — AI 生成由浅入深的语法讲解
- **AI 对话** — 场景化日语对话(自我介绍、餐厅、购物……),AI 老师实时纠错
- **智能测验** — 选择 / 填空 / 罗马音标注 / 翻译题,系统记录错题本

### 🐾 宠物系统
- 领养柴犬 / 猫咪 / 兔子同伴
- 学习获得经验值,宠物升级、3 阶段进化(幼年 → 成长 → 成年)
- 喂食、摸摸、睡觉互动
- 3 阶段经验曲线:`expToNext = ⌊100 × 1.5^(level - 1)⌋`,Lv 11 / Lv 26 触发进化

### 🔊 语音合成
- 通过 [VOICEVOX](https://voicevox.hiroshiba.jp/) 引擎合成日语朗读
- 支持扬声器选择(由后端 `/api/tts/speakers` 拉取)

### 👤 账号系统
- 邮箱 + 密码注册 / 登录(bcrypt)
- 自建 JWT 会话(HS256,`jose` 签名),HttpOnly Cookie
- "记住我" 选项:勾选 → 30 天持久 Cookie;不勾选 → 浏览器关闭即失效

## 🛠 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Next.js 16.2(App Router) + React 19 |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 + 「和风 Riso」自定义主题(朱红 / 钴蓝 / 芥末 / 鼠尾草) |
| 数据库 | PostgreSQL 16(脚本会启动 Docker 容器,宿主机 5433 端口) |
| ORM | Prisma 7 + `@prisma/adapter-pg` |
| AI | Vercel AI SDK 6(`@ai-sdk/anthropic` / `@ai-sdk/openai`),支持自定义 `baseURL` |
| 认证 | 自建 JWT + bcryptjs(用 `jose` 签发) |
| 动画 | Framer Motion |
| 状态 | Zustand |
| 字体 | Shippori Antique(日文显示) / Noto Sans SC(中文正文) / JetBrains Mono / Klee One |

## 🚀 快速开始

> 推荐方式:一条命令完成「启动 PostgreSQL 容器 → 跑迁移 → 灌种子数据 → 启动 Next.js」。

### 一键启动(推荐)

需要本机已安装并运行 [Docker Desktop](https://www.docker.com/products/docker-desktop/)。

```bash
# macOS / Linux
bash scripts/dev.sh

# Windows
scripts\dev.bat
```

脚本会做这些事:

1. 检查 Docker,必要时启动 Docker Desktop
2. 启动 `kanaai-postgres` 容器(端口 5433)
3. 等待 PostgreSQL 就绪
4. 跑 `prisma migrate dev`(如果还没有迁移)
5. 检查种子数据(没有就跑 `prisma/seed.ts`)
6. 启动 `npm run dev`

启动后:

- 应用:<http://localhost:3000>
- 开发账号:`dev@kanaai.local` / `dev12345678`

### 手动启动

```bash
# 1. 安装依赖
npm install

# 2. 准备 PostgreSQL(任选其一)
#    方式 A:用项目自带的容器
docker run -d --name kanaai-postgres \
  -e POSTGRES_USER=kanaai -e POSTGRES_PASSWORD=test123 -e POSTGRES_DB=kanaai \
  -p 5433:5432 postgres:16-alpine

#    方式 B:用自己的实例,改 .env 里的 DATABASE_URL 即可

# 3. 复制环境变量
cp .env.example .env
# 填入 ANTHROPIC_API_KEY / OPENAI_API_KEY(以及可选的 *BASE_URL)

# 4. 数据库迁移 + 种子
npm run db:migrate
npm run db:seed

# 5. 启动开发服务器
npm run dev
```

### 常用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务 |
| `npm run lint` | ESLint 检查 |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | 灌入种子数据 |
| `npm run db:studio` | 打开 Prisma Studio |

## ⚙️ 环境变量

`.env` 需要至少以下几项:

```env
# AI(二选一或都填,默认用 anthropic)
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
# 可选:代理到第三方(火山方舟 / 中转站等)
ANTHROPIC_BASE_URL=https://...

OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o
OPENAI_BASE_URL=https://api.openai.com/v1

# 数据库
DATABASE_URL=postgresql://kanaai:test123@localhost:5433/kanaai

# JWT 签名密钥(生产环境务必改!)
NEXTAUTH_SECRET=...

# 可选:VOICEVOX 引擎(默认 http://localhost:50027)
VOICEVOX_ENGINE_URL=...
```

> AI 路由对火山方舟 /api/coding 这类不带 `/v1` 的 `baseURL` 做了自动补全,并对响应中缺失 `signature` 的 `thinking` content block 注入了桩字段,避免 SDK 解析失败。

## 📁 项目结构

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/                 # 登录页
│   │   └── register/              # 注册页
│   ├── (main)/
│   │   ├── dashboard/             # 学习仪表板
│   │   ├── kana/                  # 假名学习
│   │   ├── vocabulary/            # 词汇
│   │   ├── grammar/               # 语法
│   │   ├── practice/              # AI 对话练习
│   │   ├── quiz/                  # 智能测验
│   │   └── pet/                   # 宠物系统
│   ├── api/
│   │   ├── auth/                  # login / register / logout / me
│   │   ├── ai/chat/               # 通用 AI 对话(Vercel AI SDK)
│   │   ├── pet/                   # GET 当前宠物 / PUT 动作(feed/pet/study/sleep)
│   │   ├── progress/              # 学习进度
│   │   ├── vocab-progress/        # 词汇掌握度(艾宾浩斯)
│   │   ├── quiz/                  # 测验结果
│   │   └── tts/                   # VOICEVOX 代理 + speakers
│   ├── home-view.tsx              # 公开首页(已登录用户被服务端重定向到 /dashboard)
│   ├── layout.tsx
│   ├── globals.css                # Tailwind 4 主题
│   └── pixel-theme.css            # 「和风 Riso」主题变量 & 字体
├── components/
│   ├── ui/                        # PixelButton / PixelCard / PixelProgress / Logo / SpeakerSelector / …
│   └── Providers.tsx
├── lib/
│   ├── auth.ts                    # bcrypt + 会话 cookie
│   ├── jwt.ts                     # jose HS256 签发 / 解析
│   ├── prisma.ts                  # PrismaClient 单例
│   ├── ai/config.ts               # AI provider + 系统提示词
│   ├── tts/                       # TTS Context + useTTS hook
│   └── utils.ts
├── generated/prisma/              # `prisma generate` 产物(Prisma 7 client 输出)
└── middleware.ts

prisma/
├── schema.prisma                  # User / Pet / Progress / VocabProgress / QuizResult
├── seed.ts                        # 灌入 dev 用户 + 宠物 + 进度
└── migrations/                    # 迁移历史

scripts/
├── dev.sh                         # Linux / macOS 一键启动
├── dev.bat                        # Windows 一键启动
├── optimize-images.js
└── replace-logo.js

public/
└── img/                           # Logo 等静态资源
```

## 🗂 数据模型(Prisma)

| 模型 | 关键字段 |
| --- | --- |
| `User` | `email` unique,`password`(bcrypt),一对多关联 `Pet` / `Progress` / `VocabProgress` / `QuizResult` |
| `Pet` | `species`、`level`、`exp`、`happiness`、`hunger`、`evolution`、String[] `accessories` |
| `Progress` | `(userId, module, itemId)` 唯一,`mastered` + `reviewAt`(艾宾浩斯) |
| `VocabProgress` | `(userId, wordId)` 唯一,`level` 0–5 掌握度,`correctCount` / `wrongCount` |
| `QuizResult` | `type` / `score` / `total` + `details` JSON |

## 🎨 设计语言

- **风格**:和风 Riso 印刷感 — 暖白纸(FAF7F2)+ 硬边阴影、轻微错版效果、衬线显示字(Shippori Antique)
- **配色**:朱红 `#C8102E` · 钴蓝 `#1E3A8A` · 芥末 `#D4A04A` · 鼠尾草 `#5B7553` · 墨 `#0F0F1A`
- **字体**:中文优先 Noto Sans SC,日文片段自动回退到 Shippori Antique(浏览器按字符挑选)
- **组件**:`PixelButton` / `PixelCard` / `PixelBadge` / `PixelDialog` / `PixelInput` / `PixelProgress` / `PlayButton` / `SpeakerSelector` / `Logo`

## ✅ 已完成 / 🛠 进行中

- [x] 项目初始化 + 主题系统
- [x] 基础 UI 组件库
- [x] 自建 JWT 认证(注册 / 登录 / 登出 / `/me`)
- [x] 首页(已登录用户自动重定向到 Dashboard)
- [x] Dashboard · Kana · Vocabulary · Grammar · Practice · Quiz · Pet 页面骨架
- [x] 宠物互动动作:`feed` / `pet` / `study` / `sleep`
- [x] 艾宾浩斯词汇复习数据结构
- [x] AI 对话接口(Anthropic / OpenAI,可换 `baseURL`)
- [x] VOICEVOX TTS 代理
- [x] 一键启动脚本(Docker + 迁移 + 种子 + dev)
- [x] Prisma 数据库持久化 + 种子数据
- [ ] 像素宠物精灵图(当前为 emoji 占位)
- [ ] 音效 / 背景音乐
- [ ] 部署到 Vercel / Fly.io

## 📝 License

MIT
