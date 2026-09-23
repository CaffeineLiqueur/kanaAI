# kanaAI

面向中文母语成人自学者的零基础到 N5 日语学习应用。学习路径是：建档 → 今日计划 → 课程 → 练习 → 到期复习 → 进度回顾。猫咪只奖励真实完成的学习事件，不存在可刷经验的按钮。

## 当前范围

- 12 个单元、186 节固定课程、800 个 N5 词条、1207 个固定活动。所有目标都有离线可用的核心内容；AI 补充解释、例句和错因反馈，故障时立即使用固定内容。
- 完整假名表及本地 AnimCJK 笔顺资源，含浊音、半浊音、拗音、促音和长音规则。描摹不自动评分。
- 10 到 15 分钟的今日计划、最多 20 张的复习轮次、`ts-fsrs` 四档调度、由作答结果计算的掌握度。
- 听力依赖可选的 VOICEVOX TTS。TTS 故障时听力题可显示文本继续答题；不包含录音、语音识别或发音评分。
- Next.js 16、React 19、Tailwind 4、Prisma 7、PostgreSQL。公开首页和主要布局是 Server Components，练习播放器保留小型客户端组件。

词汇释义已通过结构校验和低置信项人工覆盖，但尚未完成 800 词逐条日语教学审校；发布前仍需内容审校和真实用户验收。第三方内容许可见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 本地运行

需要 Node.js 20+、PostgreSQL 16+。复制 `.env.example` 为 `.env`，配置 `DATABASE_URL` 与至少 32 位的 `SESSION_SECRET`。若沿用旧环境变量，`NEXTAUTH_SECRET` 暂时作为兼容回退。AI 和 VOICEVOX 凭据可暂不配置。

```bash
npm ci
npx prisma generate
npm run dev
```

`scripts/dev.sh` 和 `scripts/dev.bat` 只启动开发服务器，不会自动建库、迁移或清空数据。数据库尚未迁移时，公开首页可预览；登录后的学习功能需要完成下方数据库准备。

## 数据库迁移与种子

`20260923090000_n5_product_reset` 会删除旧的 `Pet`、`Progress`、`VocabProgress`、`QuizResult` 表，保留 `User` 账号并让现有账号重新建档。**不要在没有核对数据库身份和备份的情况下运行它。** 如果已有生产用户或需要保留旧进度，先制定字段映射迁移，不能直接使用该重置迁移。

1. 在目标环境确认 `DATABASE_URL` 指向的主机、端口、库名和用户；不要仅凭 `.env` 文件名判断。
2. 用 `pg_dump --format=custom` 备份目标库，将备份文件放在工作区之外，并验证备份文件非空且可由 `pg_restore --list` 读取。
3. 在隔离数据库先演练迁移和种子，再在确认的目标库运行：

```bash
npx prisma migrate deploy
npm run db:seed
```

`db:seed` 会写入课程目录；只有配置 `SEED_USER_EMAIL` 和 `SEED_USER_PASSWORD`（至少 12 位）时才创建本地开发账号。不要在生产环境配置种子账号。当前工作区尚未对配置在 `.env` 的数据库执行这次迁移，且该端口目前不可连接。

## 质量检查

```bash
npm run check
npm run test:e2e
```

`check` 包含 lint、类型检查、单元测试、内容校验和生产构建。Playwright 覆盖公开首页的 1440px、1024px、390px 视口及 axe 检查；完整登录后学习路径的端到端测试还需要隔离测试数据库。设置 `E2E_DATABASE_URL` 指向隔离库；若 3000 端口被占用，可设置 `E2E_PORT`。CI 会安装 Chromium 并运行现有 E2E。

## 关键目录

- `src/content/`：12 单元课程、词汇和假名表。
- `src/lib/learning/`：每日计划、掌握度、FSRS 与学习会话题目快照。
- `src/app/(main)/`：今日、课程、复习、专项练习、进度、伙伴与设置。
- `src/app/api/`：服务端鉴权、作答评分、结课、复习、AI 回退与 TTS。
- `prisma/`：数据模型、需审慎应用的迁移和课程种子。
