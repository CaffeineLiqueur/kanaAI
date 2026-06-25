# kanaAI - 日语学习应用开发计划

## Context

用户是日语零基础学习者，希望创建一个个人日语学习Web应用，集成AI辅助学习功能，并包含像素风宠物互动系统。UI设计采用宝可梦画风，带后端数据库支持多设备同步。

---

## 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **前端** | React 18 + TypeScript + Vite | 现代化构建，快速HMR |
| **样式** | Tailwind CSS + 自定义像素风主题 | 宝可梦风格的像素艺术UI |
| **状态管理** | Zustand | 轻量级状态管理 |
| **后端** | Next.js 14 (App Router) | 全栈框架，API Routes |
| **数据库** | PostgreSQL + Prisma ORM | 类型安全的数据库操作 |
| **AI集成** | Vercel AI SDK | 统一支持 Anthropic/OpenAI |
| **认证** | NextAuth.js | 简单的用户认证 |
| **动画** | Framer Motion + CSS像素动画 | 宠物动画和UI过渡 |

---

## 项目结构

```
jplearning/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # 认证页面组
│   │   ├── login/
│   │   └── register/
│   ├── (main)/                 # 主应用页面组
│   │   ├── dashboard/          # 学习仪表板
│   │   ├── kana/               # 假名学习
│   │   ├── vocabulary/         # 词汇学习
│   │   ├── grammar/            # 语法学习
│   │   ├── practice/           # AI对话练习
│   │   ├── quiz/               # 智能测验
│   │   └── pet/                # 宠物系统
│   ├── api/                    # API路由
│   │   ├── ai/                 # AI相关接口
│   │   ├── progress/           # 学习进度
│   │   └── pet/                # 宠物数据
│   └── layout.tsx
├── components/
│   ├── ui/                     # 基础UI组件
│   ├── pixel/                  # 像素风专用组件
│   ├── kana/                   # 假名相关组件
│   ├── vocabulary/             # 词汇相关组件
│   ├── pet/                    # 宠物系统组件
│   └── game/                   # 游戏化组件
├── lib/
│   ├── ai/                     # AI集成逻辑
│   │   ├── anthropic.ts        # Anthropic API
│   │   ├── openai.ts           # OpenAI API
│   │   └── prompts.ts          # 提示词模板
│   ├── db/                     # 数据库工具
│   └── utils/                  # 工具函数
├── prisma/
│   └── schema.prisma           # 数据库模型
├── public/
│   ├── sprites/                # 像素精灵图
│   ├── fonts/                  # 像素字体
│   └── sounds/                 # 音效
└── styles/
    └── pixel-theme.css         # 像素风主题样式
```

---

## 核心功能设计

### 1. 假名学习模块

**功能：**
- 平假名 (あ～ん) 和片假名 (ア～ン) 的完整学习
- 每个假名包含：罗马音、发音音频、书写笔顺动画
- 分组学习：按行 (あ行、か行等) 或按类 (清音、浊音、拗音)
- 书写练习：Canvas画布模拟手写

**UI设计：**
- 像素风格的假名卡片，类似宝可梦图鉴
- 解锁机制：完成一组才能解锁下一组
- 收集进度：类似宝可梦图鉴的收集感

### 2. 基础词汇模块

**功能：**
- 分类词汇：数字、颜色、家庭、食物、日常用语等
- 艾宾浩斯遗忘曲线复习算法
- 单词卡片：显示假名、汉字、罗马音、中文释义、例句
- 词汇测试：选择题、填空题、听写

**数据结构：**
```typescript
interface Word {
  id: string;
  kanji: string;        // 汉字写法
  hiragana: string;     // 平假名读音
  katakana?: string;    // 片假名（外来语）
  romaji: string;       // 罗马音
  meaning: string;      // 中文释义
  example: string;      // 例句
  exampleMeaning: string;
  jlptLevel: string;    // N5/N4等
  category: string;     // 分类
}
```

### 3. 语法入门模块

**功能：**
- 基础语法点：は/が、を/に、で/と等
- AI生成语法解释和例句
- 语法练习：造句、改错
- 进度追踪

**AI提示词示例：**
```
你是一位耐心的日语老师，正在教一个零基础的中国学生。
请用简单易懂的中文解释日语语法点：{grammar_point}
要求：
1. 用生活化的例子说明
2. 对比中文和日文的语序差异
3. 给出3个由简到难的例句
4. 指出常见错误
```

### 4. AI对话练习模块

**功能：**
- 场景化对话：自我介绍、点餐、问路等
- AI扮演角色与用户对话
- 实时语法纠错和建议
- 对话历史保存

**实现：**
```typescript
// 对话场景配置
interface DialogueScene {
  id: string;
  title: string;
  description: string;
  aiRole: string;          // AI扮演的角色
  systemPrompt: string;    // AI系统提示词
  difficulty: 'beginner' | 'intermediate';
  vocabulary: string[];    // 本场景重点词汇
  grammar: string[];       // 本场景重点语法
}
```

### 5. 智能测验模块

**功能：**
- AI根据学习进度动态生成题目
- 多种题型：选择、填空、排序、听写
- 难度自适应
- 错题本功能

**AI生成题目：**
```typescript
interface QuizConfig {
  type: 'kana' | 'vocabulary' | 'grammar' | 'mixed';
  difficulty: number;      // 1-10
  count: number;           // 题目数量
  focusAreas?: string[];   // 重点考察领域
  weakPoints?: string[];   // 薄弱环节（从错题本获取）
}
```

### 6. 宠物系统 (核心亮点)

**概念：**
用户领养一只像素风小动物（柴犬/猫咪/兔子），通过学习获得经验值，宠物会成长、进化。

**宠物状态：**
```typescript
interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'rabbit';
  level: number;
  exp: number;
  expToNext: number;
  happiness: number;       // 0-100
  hunger: number;          // 0-100
  state: 'idle' | 'happy' | 'eating' | 'sleeping' | 'studying';
  evolution: number;       // 进化阶段 1-3
  accessories: string[];   // 装饰品
  createdAt: Date;
}
```

**成长机制：**
- 学习假名：+10 EXP
- 完成词汇复习：+5 EXP/词
- 完成语法练习：+15 EXP
- 完成对话练习：+20 EXP
- 连续学习（每日打卡）：额外奖励

**进化系统（3阶段）：**
1. **幼年期** (Lv 1-10)：小小的、可爱的像素精灵
2. **成长期** (Lv 11-25)：变大一点，有新动画
3. **成年期** (Lv 26+)： fully grown，解锁特殊动作

**互动功能：**
- 喂食：用学习获得的金币买食物
- 摸摸：点击宠物触发可爱动画
- 装扮：解锁装饰品打扮宠物
- 对话：宠物会用简单日语和你打招呼

**宠物精灵图需求：**
- 每种动物 x 3进化阶段 x 多种状态（idle/happy/eat/sleep/study）
- 像素尺寸：32x32 或 64x64
- 帧动画：每状态2-4帧

---

## 数据库模型 (Prisma Schema)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  createdAt     DateTime  @default(now())

  pet           Pet?
  progress      Progress[]
  quizResults   QuizResult[]
  vocabProgress VocabProgress[]
}

model Pet {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  name        String
  species     String   // dog/cat/rabbit
  level       Int      @default(1)
  exp         Int      @default(0)
  happiness   Int      @default(80)
  hunger      Int      @default(20)
  evolution   Int      @default(1)
  accessories String[] @default([])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Progress {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  module    String   // kana/vocabulary/grammar
  itemId    String   // 具体学习项ID
  mastered  Boolean  @default(false)
  reviewAt  DateTime? // 下次复习时间（艾宾浩斯）
  createdAt DateTime @default(now())

  @@unique([userId, module, itemId])
}

model VocabProgress {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  wordId        String
  level         Int      @default(0) // 0-5 掌握程度
  nextReview    DateTime
  correctCount  Int      @default(0)
  wrongCount    Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([userId, wordId])
}

model QuizResult {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  type       String
  score      Int
  total      Int
  details    Json     // 题目详情和答案
  createdAt  DateTime @default(now())
}
```

---

## AI集成方案

### API路由设计

```typescript
// app/api/ai/chat/route.ts
// 通用AI对话接口

// app/api/ai/quiz/route.ts
// AI生成测验题目

// app/api/ai/grammar/route.ts
// AI解释语法点

// app/api/ai/pronunciation/route.ts
// AI评估发音（可选，需要语音识别）
```

### AI配置

```typescript
// lib/ai/config.ts
export const aiConfig = {
  provider: process.env.AI_PROVIDER || 'anthropic', // 'anthropic' | 'openai'
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-sonnet-20241022',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o',
  },
};
```

### Vercel AI SDK集成

```typescript
// lib/ai/index.ts
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

export function getAIModel() {
  if (aiConfig.provider === 'anthropic') {
    return anthropic(aiConfig.anthropic.model);
  }
  return openai(aiConfig.openai.model);
}
```

---

## UI/UX设计规范 (宝可梦像素风)

### 设计语言

- **字体**：像素风格字体（如 Press Start 2P、Zpix）
- **配色**：
  - 主色：宝可梦红 #FF1C1C
  - 辅助：宝可梦蓝 #3B82F6
  - 背景：复古米色 #F5F0E1
  - 文字：深灰 #2D2D2D
  - 强调：金色 #FFD700（经验值、奖励）
- **边框**：像素风格的双层边框
- **按钮**：立体像素按钮，有按下效果
- **阴影**：硬边阴影，无模糊

### 组件风格示例

```css
/* 像素按钮 */
.pixel-button {
  font-family: 'Press Start 2P', cursive;
  background: #FF1C1C;
  color: white;
  border: 4px solid #000;
  box-shadow:
    inset -4px -4px 0 0 #CC0000,
    inset 4px 4px 0 0 #FF6666,
    8px 8px 0 0 rgba(0,0,0,0.3);
  padding: 12px 24px;
  cursor: pointer;
  transition: transform 0.1s;
}

.pixel-button:active {
  transform: translate(4px, 4px);
  box-shadow:
    inset -4px -4px 0 0 #CC0000,
    inset 4px 4px 0 0 #FF6666,
    4px 4px 0 0 rgba(0,0,0,0.3);
}

/* 像素卡片 */
.pixel-card {
  background: #F5F0E1;
  border: 4px solid #000;
  box-shadow: 8px 8px 0 0 rgba(0,0,0,0.2);
  padding: 16px;
}

/* 像素进度条 */
.pixel-progress {
  height: 24px;
  background: #2D2D2D;
  border: 3px solid #000;
  position: relative;
}

.pixel-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500);
  transition: width 0.3s;
  image-rendering: pixelated;
}
```

### 像素精灵图需求

需要准备或生成以下像素精灵图：

1. **宠物精灵图**（每种动物3进化阶段）
   - dog_1.png, dog_2.png, dog_3.png
   - cat_1.png, cat_2.png, cat_3.png
   - rabbit_1.png, rabbit_2.png, rabbit_3.png

2. **UI图标**
   - 假名卡片背景
   - 各功能图标（书本、铅笔、对话框等）
   - 状态图标（心形、星星、金币等）

3. **背景**
   - 主界面背景
   - 学习界面背景
   - 宠物房间背景

---

## 实现步骤

### Phase 1: 项目初始化与基础架构 (Day 1-2)

1. 初始化 Next.js 项目
2. 配置 Tailwind CSS 像素主题
3. 设置 Prisma 和 PostgreSQL
4. 实现基础认证系统
5. 创建基础UI组件库

### Phase 2: 核心学习模块 (Day 3-5)

1. 实现假名学习模块
2. 实现词汇学习模块（含艾宾浩斯算法）
3. 实现语法学习模块
4. 集成AI接口

### Phase 3: AI功能实现 (Day 6-7)

1. 实现AI对话练习
2. 实现AI智能测验
3. 实现AI语法解释

### Phase 4: 宠物系统 (Day 8-9)

1. 实现宠物数据模型
2. 实现宠物成长/进化系统
3. 实现宠物互动功能
4. 添加宠物动画

### Phase 5: 打磨与部署 (Day 10)

1. 添加音效和背景音乐
2. 优化动画和过渡效果
3. 测试和修复bug
4. 部署到 Vercel

---

## 依赖清单

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.0.0",
    "next-auth": "^4.24.0",
    "ai": "^3.0.0",
    "@ai-sdk/anthropic": "^0.0.0",
    "@ai-sdk/openai": "^0.0.0",
    "zustand": "^4.5.0",
    "framer-motion": "^11.0.0",
    "tailwindcss": "^3.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "prisma": "^5.0.0",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 验证方案

1. **功能测试**：手动测试所有学习模块
2. **AI测试**：验证Anthropic和OpenAI两种API都能正常工作
3. **宠物系统测试**：验证经验值计算、升级、进化逻辑
4. **响应式测试**：确保移动端可用
5. **性能测试**：检查页面加载速度

---

## 风险与注意事项

1. **像素精灵图资源**：需要自行准备或生成像素风格的宠物精灵图
2. **AI API成本**：频繁调用AI会产生费用，需要做好限流
3. **数据库选择**：本地开发可用SQLite，生产环境建议PostgreSQL
4. **字体加载**：像素字体文件较大，需要优化加载策略
