# 第三方学习素材

## AnimCJK 假名笔顺

- 来源：[AnimCJK](https://github.com/parsimonhi/animCJK)，`svgsJaKana` 文件夹，2026-09-23 获取。
- 用途：`public/kana-strokes` 中 177 个平假名和片假名 SVG，供假名描摹页面本地加载。
- 原作者与项目署名：AnimCJK contributors / François Mizessyn 等。
- 许可：GNU Lesser General Public License。仓库内保留了 [许可证原文](public/licenses/AnimCJK-LGPL.txt)。
- 修改：未修改 SVG 内容，仅移动到产品的静态资源目录。

## N5 词汇素材

`src/content/vocabulary.json` 是独立的学习数据文件，按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 分享。它结合了以下来源：

- [JLPTSuccess](https://github.com/gauravhq/JLPTSuccess) 的 N5 词条、日语写法、读音、英语释义、主题及频率字段，版权所有 © 2026 JLPTSuccess contributors。原内容许可见其 [CONTENT-LICENSE.md](https://github.com/gauravhq/JLPTSuccess/blob/master/N5/CONTENT-LICENSE.md)。
- [Tomoshi Dictionary Open Data](https://github.com/tomoshi-app/tomoshi-dict-data) 2026-09-02 版本中的中文词义，含 JMdict 衍生内容。JMdict 版权所有 © Electronic Dictionary Research and Development Group；Tomoshi 中文衍生层版权所有 © Y1Z。原项目的 [许可与署名](https://github.com/tomoshi-app/tomoshi-dict-data/blob/main/NOTICE.md) 适用。

改动：按日语写法和读音匹配词典，选取 800 条，分配至 12 单元；对 27 条低置信匹配的中文释义做了人工修正。机器匹配的其余词义仍应在发布前由日语内容审校者逐条复核。本项目的品牌、界面代码和自行编写的课程说明不因此被声明为上游项目内容。
