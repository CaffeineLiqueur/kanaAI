'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, PixelDialog } from '@/components/ui';

// 示例题目
const sampleQuestions = [
  {
    id: 1,
    type: 'choice',
    question: '「あ」のローマ字は？',
    questionCn: '「あ」的罗马音是？',
    options: ['a', 'i', 'u', 'e'],
    correct: 0,
    explanation: '「あ」は「a」です。（「あ」是「a」。）',
  },
  {
    id: 2,
    type: 'choice',
    question: '「ありがとう」の意味は？',
    questionCn: '「ありがとう」的意思是？',
    options: ['你好', '谢谢', '对不起', '再见'],
    correct: 1,
    explanation: '「ありがとう」は「谢谢」です。（「ありがとう」是「谢谢」。）',
  },
  {
    id: 3,
    type: 'choice',
    question: '「水」は何ですか？',
    questionCn: '「水」是什么？',
    options: ['みず', 'みつ', 'みち', 'みと'],
    correct: 0,
    explanation: '「水」は「みず」(mizu)です。（「水」是「みず」。）',
  },
  {
    id: 4,
    type: 'input',
    question: '「一」のローマ字を入力してください',
    questionCn: '请输入「一」的罗马音',
    correct: 'ichi',
    explanation: '「一」は「ichi」です。（「一」是「ichi」。）',
  },
  {
    id: 5,
    type: 'choice',
    question: '「お父さん」の意味は？',
    questionCn: '「お父さん」的意思是？',
    options: ['妈妈', '爸爸', '哥哥', '姐姐'],
    correct: 1,
    explanation: '「お父さん」は「爸爸」です。（「お父さん」是「爸爸」。）',
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [inputAnswer, setInputAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = sampleQuestions[currentQuestion];

  const handleAnswer = () => {
    if (question.type === 'choice' && selectedAnswer === null) return;
    if (question.type === 'input' && !inputAnswer.trim()) return;

    setShowResult(true);

    const isCorrect = question.type === 'choice'
      ? selectedAnswer === question.correct
      : inputAnswer.toLowerCase() === question.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setInputAnswer('');
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setInputAnswer('');
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  };

  const scorePercentage = Math.round((score / sampleQuestions.length) * 100);

  // Save quiz result when finished
  const saveQuizResult = async () => {
    try {
      await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'kana-vocab',
          score,
          total: sampleQuestions.length,
          details: {
            questions: sampleQuestions.map((q, i) => ({
              question: q.questionCn,
              correct: q.correct,
            })),
            scorePercentage,
          },
        }),
      });
    } catch {
      // Failed to save quiz result
    }
  };

  // Save when quiz finishes
  if (isFinished && score > 0) {
    saveQuizResult();
  }

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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg text-[#2D2D2D] mb-2">智能测验</h2>
          <p className="text-[10px] text-[#666666]">
            测试你学到的内容！
          </p>
        </div>

        {!isFinished ? (
          <>
            {/* Progress */}
            <PixelCard className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs">题目 {currentQuestion + 1}/{sampleQuestions.length}</span>
                <PixelBadge variant="exp">得分: {score}</PixelBadge>
              </div>
              <PixelProgress
                value={currentQuestion + 1}
                max={sampleQuestions.length}
                variant="exp"
              />
            </PixelCard>

            {/* Question */}
            <PixelCard variant="elevated">
              <div className="mb-6">
                <PixelBadge variant="level" className="mb-3">
                  {question.type === 'choice' ? '選択题目' : '入力题目'}
                </PixelBadge>
                <h3 className="text-sm mb-2">{question.question}</h3>
                <p className="text-[10px] text-[#666666]">{question.questionCn}</p>
              </div>

              {/* Answer Options */}
              {question.type === 'choice' ? (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {question.options?.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === question.correct;
                    const showCorrect = showResult && isCorrect;
                    const showIncorrect = showResult && isSelected && !isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => !showResult && setSelectedAnswer(index)}
                        disabled={showResult}
                        className={`
                          p-4 border-3 border-black text-left transition-all
                          ${showCorrect ? 'bg-[#4ADE80]' : ''}
                          ${showIncorrect ? 'bg-[#EF4444] text-white' : ''}
                          ${!showResult && isSelected ? 'bg-[#3B82F6] text-white' : ''}
                          ${!showResult && !isSelected ? 'bg-white hover:bg-[#FFD700]' : ''}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-8 h-8 border-2 border-black flex items-center justify-center
                            ${isSelected ? 'bg-white' : 'bg-transparent'}
                          `}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-xs">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mb-6">
                  <input
                    type="text"
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    disabled={showResult}
                    placeholder="ローマ字を入力..."
                    className={`
                      w-full px-4 py-3 border-3 border-black font-pixel text-xs
                      ${showResult
                        ? inputAnswer.toLowerCase() === question.correct
                          ? 'bg-[#4ADE80]'
                          : 'bg-[#EF4444] text-white'
                        : ''
                      }
                    `}
                  />
                </div>
              )}

              {/* Result */}
              {showResult && (
                <div className={`
                  p-4 border-3 border-black mb-6
                  ${(question.type === 'choice' && selectedAnswer === question.correct) ||
                    (question.type === 'input' && inputAnswer.toLowerCase() === question.correct)
                    ? 'bg-[#4ADE80]'
                    : 'bg-[#EF4444] text-white'
                  }
                `}>
                  <p className="text-xs mb-2">
                    {(question.type === 'choice' && selectedAnswer === question.correct) ||
                     (question.type === 'input' && inputAnswer.toLowerCase() === question.correct)
                      ? '🎉 正解！'
                      : '❌ 不正解'
                    }
                  </p>
                  <p className="text-[10px]">{question.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                {!showResult ? (
                  <PixelButton onClick={handleAnswer}>
                    回答
                  </PixelButton>
                ) : (
                  <PixelButton onClick={handleNext}>
                    {currentQuestion < sampleQuestions.length - 1 ? '次の题目' : '查看结果'}
                  </PixelButton>
                )}
              </div>
            </PixelCard>
          </>
        ) : (
          /* Result Screen */
          <PixelCard variant="elevated">
            <div className="text-center py-8">
              <h3 className="text-lg mb-4">测验结果</h3>

              <div className="w-32 h-32 mx-auto mb-6 border-4 border-black flex items-center justify-center bg-white">
                <span className="text-4xl">
                  {scorePercentage >= 80 ? '🎉' : scorePercentage >= 60 ? '👍' : '📚'}
                </span>
              </div>

              <div className="text-3xl mb-2">{scorePercentage}点</div>
              <p className="text-xs text-[#666666] mb-6">
                {sampleQuestions.length}题中{score}题正确
              </p>

              <PixelProgress
                value={score}
                max={sampleQuestions.length}
                variant={scorePercentage >= 80 ? 'exp' : scorePercentage >= 60 ? 'default' : 'hp'}
                className="mb-6"
              />

              <div className="flex flex-col gap-3">
                {scorePercentage >= 80 ? (
                  <PixelDialog>
                    <p>太棒了！做得很好！</p>
                    <p className="text-[#666666] text-[10px] mt-2">
                      （太棒了！做得很好！）
                    </p>
                  </PixelDialog>
                ) : scorePercentage >= 60 ? (
                  <PixelDialog>
                    <p>再努力一点吧！</p>
                    <p className="text-[#666666] text-[10px] mt-2">
                      （再努力一点吧！）
                    </p>
                  </PixelDialog>
                ) : (
                  <PixelDialog>
                    <p>复习后再挑战一次吧！</p>
                    <p className="text-[#666666] text-[10px] mt-2">
                      （复习后再挑战一次吧！）
                    </p>
                  </PixelDialog>
                )}

                <div className="flex justify-center gap-4">
                  <PixelButton onClick={handleRestart}>
                    もう一度
                  </PixelButton>
                  <Link href="/dashboard">
                    <PixelButton variant="secondary">
                      返回仪表板
                    </PixelButton>
                  </Link>
                </div>
              </div>
            </div>
          </PixelCard>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-[10px] text-[#666666]">
            © 2026 kanaAI - 每天进步一点点！
          </p>
        </div>
      </footer>
    </div>
  );
}
