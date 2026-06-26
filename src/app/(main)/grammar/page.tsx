'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, PixelDialog, PlayButton } from '@/components/ui';

// 语法数据
const grammarData = [
  {
    id: '1',
    title: 'は (wa) - 主题标记',
    titleCn: '主题标记助词',
    level: 'N5',
    explanation: '「は」用于标记句子的主题，表示"关于..."。',
    examples: [
      { jp: '私は学生です。', cn: '我是学生。', romaji: 'Watashi wa gakusei desu.' },
      { jp: 'これは本です。', cn: '这是书。', romaji: 'Kore wa hon desu.' },
      { jp: '東京は大きいです。', cn: '东京很大。', romaji: 'Toukyou wa ookii desu.' },
    ],
    tips: '「は」读作"wa"，但作为助词时读作"wa"。',
    category: '助詞',
  },
  {
    id: '2',
    title: 'が (ga) - 主语标记',
    titleCn: '主语标记助词',
    level: 'N5',
    explanation: '「が」用于标记句子的主语，特别用于新信息或强调。',
    examples: [
      { jp: '猫がいます。', cn: '有猫。', romaji: 'Neko ga imasu.' },
      { jp: '誰が来ましたか？', cn: '谁来了？', romaji: 'Dare ga kimashita ka?' },
      { jp: '水がほしいです。', cn: '想要水。', romaji: 'Mizu ga hoshii desu.' },
    ],
    tips: '「が」常用于存在动词（いる/ある）和愿望表达（ほしい/たい）。',
    category: '助詞',
  },
  {
    id: '3',
    title: 'を (wo) - 宾语标记',
    titleCn: '宾语标记助词',
    level: 'N5',
    explanation: '「を」用于标记动作的对象（宾语）。',
    examples: [
      { jp: 'ご飯を食べます。', cn: '吃饭。', romaji: 'Gohan wo tabemasu.' },
      { jp: '本を読みます。', cn: '读书。', romaji: 'Hon wo yomimasu.' },
      { jp: '音楽を聞きます。', cn: '听音乐。', romaji: 'Ongaku wo kikimasu.' },
    ],
    tips: '「を」读作"o"，但写作"wo"。',
    category: '助詞',
  },
  {
    id: '4',
    title: 'に (ni) - 时间/地点标记',
    titleCn: '时间/地点标记助词',
    level: 'N5',
    explanation: '「に」用于标记时间点、目的地、存在的地点。',
    examples: [
      { jp: '7時に起きます。', cn: '7点起床。', romaji: 'Shichi-ji ni okimasu.' },
      { jp: '学校に行きます。', cn: '去学校。', romaji: 'Gakkou ni ikimasu.' },
      { jp: '机の上にあります。', cn: '在桌子上。', romaji: 'Tsukue no ue ni arimasu.' },
    ],
    tips: '「に」表示"在..."或"到..."。',
    category: '助詞',
  },
  {
    id: '5',
    title: 'で (de) - 场所/手段标记',
    titleCn: '场所/手段标记助词',
    level: 'N5',
    explanation: '「で」用于标记动作发生的场所、使用的手段或材料。',
    examples: [
      { jp: '食堂で食べます。', cn: '在食堂吃。', romaji: 'Shokudou de tabemasu.' },
      { jp: 'バスで行きます。', cn: '坐公交去。', romaji: 'Basu de ikimasu.' },
      { jp: '日本語で話します。', cn: '用日语说。', romaji: 'Nihongo de hanashimasu.' },
    ],
    tips: '「で」表示"在...（做）"或"用...（做）"。',
    category: '助詞',
  },
];

export default function GrammarPage() {
  const [selectedGrammar, setSelectedGrammar] = useState<typeof grammarData[0] | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);

  const handleGrammarClick = (grammar: typeof grammarData[0]) => {
    setSelectedGrammar(grammar);
    setShowExplanation(false);
    setCurrentExample(0);
  };

  const handleNextExample = () => {
    if (selectedGrammar && currentExample < selectedGrammar.examples.length - 1) {
      setCurrentExample(prev => prev + 1);
    }
  };

  const handlePrevExample = () => {
    if (currentExample > 0) {
      setCurrentExample(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E1] pixel-grid">
      {/* Header */}
      <header className="border-b-4 border-black bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF1C1C] border-3 border-black flex items-center justify-center">
                <span className="text-white text-lg">あ</span>
              </div>
              <h1 className="text-sm text-[#2D2D2D]">kanaAI</h1>
            </Link>
          </div>
          <Link href="/dashboard">
            <PixelButton variant="ghost" size="sm">← 返回仪表板</PixelButton>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg text-[#2D2D2D] mb-2">语法入门</h2>
          <p className="text-[10px] text-[#666666]">
            轻松学习日语基础语法，AI用通俗易懂的方式讲解！
          </p>
        </div>

        {/* Progress Overview */}
        <PixelCard className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xs mb-2">学习进度</h3>
              <PixelProgress
                value={1}
                max={grammarData.length}
                label="1/5 已掌握"
                variant="exp"
                showLabel
              />
            </div>
            <div className="flex gap-4">
              <PixelBadge variant="level">N5</PixelBadge>
              <PixelBadge variant="exp">基本助詞</PixelBadge>
            </div>
          </div>
        </PixelCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grammar List */}
          <div>
            <h3 className="text-xs mb-4">语法列表</h3>
            <div className="flex flex-col gap-3">
              {grammarData.map((grammar) => (
                <button
                  key={grammar.id}
                  onClick={() => handleGrammarClick(grammar)}
                  className={`
                    p-4 border-3 border-black text-left transition-all
                    ${selectedGrammar?.id === grammar.id
                      ? 'bg-[#3B82F6] text-white'
                      : 'bg-white hover:bg-[#FFD700]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs">{grammar.title}</div>
                      <div className={`text-[10px] ${selectedGrammar?.id === grammar.id ? 'text-white' : 'text-[#666666]'}`}>
                        {grammar.titleCn}
                      </div>
                    </div>
                    <PixelBadge variant="default" size="sm">{grammar.level}</PixelBadge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Grammar Detail */}
          <div className="lg:col-span-2">
            {selectedGrammar ? (
              <PixelCard variant="elevated">
                {/* Title */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#FFD700] border-3 border-black flex items-center justify-center">
                    <span className="text-lg">📝</span>
                  </div>
                  <div>
                    <h3 className="text-sm">{selectedGrammar.title}</h3>
                    <p className="text-[10px] text-[#666666]">{selectedGrammar.titleCn}</p>
                  </div>
                  <PixelBadge variant="level" className="ml-auto">{selectedGrammar.level}</PixelBadge>
                </div>

                {/* Explanation */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between p-4 bg-[#FFD700] border-3 border-black">
                      <span className="text-xs">📖 解释{showExplanation ? '收起' : '展开'}</span>
                      <span className="text-xs">{showExplanation ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {showExplanation && (
                    <div className="p-4 bg-white border-3 border-t-0 border-black">
                      <p className="text-xs leading-relaxed">{selectedGrammar.explanation}</p>
                    </div>
                  )}
                </div>

                {/* Examples */}
                <div className="mb-6">
                  <h4 className="text-xs mb-3">📝 例句</h4>
                  <div className="p-4 bg-white border-3 border-black">
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg">
                          {selectedGrammar.examples[currentExample].jp}
                        </span>
                        <PlayButton text={selectedGrammar.examples[currentExample].jp} size="sm" />
                      </div>
                      <div className="text-xs text-[#666666] mb-1">
                        {selectedGrammar.examples[currentExample].romaji}
                      </div>
                      <div className="text-xs">
                        {selectedGrammar.examples[currentExample].cn}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <PixelButton
                        size="sm"
                        variant="ghost"
                        onClick={handlePrevExample}
                        disabled={currentExample === 0}
                      >
                        ← 上一个
                      </PixelButton>
                      <span className="text-[10px]">
                        {currentExample + 1}/{selectedGrammar.examples.length}
                      </span>
                      <PixelButton
                        size="sm"
                        variant="ghost"
                        onClick={handleNextExample}
                        disabled={currentExample === selectedGrammar.examples.length - 1}
                      >
                        下一个 →
                      </PixelButton>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="p-4 bg-[#87CEEB] border-3 border-black">
                  <h4 className="text-xs mb-2">💡 要点</h4>
                  <p className="text-[10px] leading-relaxed">{selectedGrammar.tips}</p>
                </div>

                {/* Practice Button */}
                <div className="mt-6">
                  <Link href="/practice">
                    <PixelButton className="w-full">
                      💬 练习这个语法
                    </PixelButton>
                  </Link>
                </div>
              </PixelCard>
            ) : (
              <PixelCard>
                <PixelDialog>
                  <p>请选择一个语法点</p>
                  <p className="text-[#666666] text-[10px] mt-2">
                    （请选择一个语法点）
                  </p>
                </PixelDialog>
              </PixelCard>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-[10px] text-[#666666]">
            © 2024 kanaAI - 每天进步一点点！
          </p>
        </div>
      </footer>
    </div>
  );
}
