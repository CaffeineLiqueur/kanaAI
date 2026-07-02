'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PixelButton, PixelCard, PixelProgress, PixelBadge, Logo } from '@/components/ui';

const sampleQuestions = [
  {
    id: 1, type: 'choice',
    question: '「あ」のローマ字は?',
    questionCn: '「あ」的罗马音是?',
    options: ['a', 'i', 'u', 'e'],
    correct: 0,
    explanation: '「あ」は「a」です。',
  },
  {
    id: 2, type: 'choice',
    question: '「ありがとう」の意味は?',
    questionCn: '「ありがとう」的意思是?',
    options: ['你好', '谢谢', '对不起', '再见'],
    correct: 1,
    explanation: '「ありがとう」は「谢谢」です。',
  },
  {
    id: 3, type: 'choice',
    question: '「水」は何ですか?',
    questionCn: '「水」是什么?',
    options: ['みず', 'みつ', 'みち', 'みと'],
    correct: 0,
    explanation: '「水」は「みず」(mizu)です。',
  },
  {
    id: 4, type: 'input',
    question: '「一」のローマ字を入力してください',
    questionCn: '请输入「一」的罗马音',
    correct: 'ichi',
    explanation: '「一」は「ichi」です。',
  },
  {
    id: 5, type: 'choice',
    question: '「お父さん」の意味は?',
    questionCn: '「お父さん」的意思是?',
    options: ['妈妈', '爸爸', '哥哥', '姐姐'],
    correct: 1,
    explanation: '「お父さん」は「爸爸」です。',
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [inputAnswer, setInputAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [savedResult, setSavedResult] = useState(false);

  const question = sampleQuestions[currentQuestion];
  const scorePercentage = Math.round((score / sampleQuestions.length) * 100);

  const handleAnswer = () => {
    if (question.type === 'choice' && selectedAnswer === null) return;
    if (question.type === 'input' && !inputAnswer.trim()) return;

    setShowResult(true);

    const isCorrect = question.type === 'choice'
      ? selectedAnswer === question.correct
      : inputAnswer.toLowerCase() === question.correct;

    if (isCorrect) setScore(prev => prev + 1);
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
    setSavedResult(false);
  };

  // Save result when finished
  if (isFinished && !savedResult) {
    setSavedResult(true);
    fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'kana-vocab',
        score,
        total: sampleQuestions.length,
        details: { scorePercentage },
      }),
    }).catch(() => {});
  }

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b-[1.5px] border-[var(--ink)] bg-[var(--paper)]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <Link href="/dashboard">
            <PixelButton variant="ghost" size="sm">← 戻る</PixelButton>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {!isFinished ? (
          <>
            {/* Title */}
            <section className="mb-8 fade-up">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="label-text mb-2">第 04 章 — 試験</div>
                  <h1 className="heading-lg">確認テスト</h1>
                </div>
                <div className="text-right">
                  <div className="label-text opacity-50">問題</div>
                  <div className="font-mono text-2xl tabular-nums">
                    {String(currentQuestion + 1).padStart(2, '0')}<span className="opacity-30">/</span>{String(sampleQuestions.length).padStart(2, '0')}
                  </div>
                </div>
              </div>
              <div className="mt-4 progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
                />
              </div>
            </section>

            {/* Question */}
            <PixelCard className="fade-up" >
              <div className="flex items-baseline justify-between mb-4">
                <PixelBadge variant="ink">
                  {question.type === 'choice' ? '選択' : '入力'}
                </PixelBadge>
                <div className="font-mono text-[0.7rem] opacity-50 tracking-wider">
                  Q. {String(currentQuestion + 1).padStart(2, '0')}
                </div>
              </div>

              <h2 className="font-display text-2xl font-medium mb-2">{question.question}</h2>
              <p className="body-text opacity-70 mb-6">{question.questionCn}</p>

              <div className="divider-line mb-6"></div>

              {question.type === 'choice' ? (
                <div className="space-y-2 mb-6">
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
                        className={`w-full p-4 border-[1.5px] text-left transition-all duration-200 flex items-center gap-4 ${
                          showCorrect
                            ? 'border-[var(--sage)] bg-[var(--sage)] bg-opacity-10'
                            : showIncorrect
                            ? 'border-[var(--vermillion)] bg-[var(--vermillion)] bg-opacity-10'
                            : isSelected
                            ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                            : 'border-[var(--ink)] border-opacity-20 hover:border-opacity-80 bg-[var(--paper)]'
                        }`}
                      >
                        <span className={`font-mono text-[0.7rem] w-6 ${isSelected && !showResult ? 'opacity-80' : 'opacity-50'}`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="font-display text-base flex-1">{option}</span>
                        {showCorrect && <span className="font-display" style={{ color: 'var(--sage)' }}>✓</span>}
                        {showIncorrect && <span className="font-display" style={{ color: 'var(--vermillion)' }}>✗</span>}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mb-6">
                  <label className="input-label">あなたの答え</label>
                  <input
                    type="text"
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    disabled={showResult}
                    placeholder="ローマ字を入力..."
                    className={`input-field ${
                      showResult
                        ? inputAnswer.toLowerCase() === question.correct
                          ? 'border-[var(--sage)] text-[var(--sage)]'
                          : 'border-[var(--vermillion)] text-[var(--vermillion)]'
                        : ''
                    }`}
                    autoFocus
                  />
                  {showResult && inputAnswer.toLowerCase() !== question.correct && (
                    <p className="mt-2 text-[0.8rem] font-mono opacity-60">
                      正解: <span style={{ color: 'var(--sage)' }}>{question.correct}</span>
                    </p>
                  )}
                </div>
              )}

              {showResult && (
                <div className={`mb-6 p-4 border-l-[3px] fade-up ${
                  (question.type === 'choice' && selectedAnswer === question.correct) ||
                  (question.type === 'input' && inputAnswer.toLowerCase() === question.correct)
                    ? 'border-[var(--sage)] bg-[var(--sage)] bg-opacity-5'
                    : 'border-[var(--vermillion)] bg-[var(--vermillion)] bg-opacity-5'
                }`}>
                  <div className="label-text mb-1" style={{ color: (question.type === 'choice' && selectedAnswer === question.correct) || (question.type === 'input' && inputAnswer.toLowerCase() === question.correct) ? 'var(--sage)' : 'var(--vermillion)' }}>
                    {(question.type === 'choice' && selectedAnswer === question.correct) ||
                     (question.type === 'input' && inputAnswer.toLowerCase() === question.correct)
                      ? '正解'
                      : '不正解'}
                  </div>
                  <p className="body-text">{question.explanation}</p>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t-[1px] border-[var(--ink)] border-opacity-15">
                {!showResult ? (
                  <PixelButton onClick={handleAnswer} variant="primary">
                    回答する →
                  </PixelButton>
                ) : (
                  <PixelButton onClick={handleNext} variant="primary">
                    {currentQuestion < sampleQuestions.length - 1 ? '次の問題 →' : '結果を見る →'}
                  </PixelButton>
                )}
              </div>
            </PixelCard>
          </>
        ) : (
          /* Result */
          <section className="fade-up">
            <div className="mb-8 text-center">
              <div className="label-text mb-2" style={{ color: 'var(--vermillion)' }}>結果発表</div>
              <h1 className="heading-xl mb-3">
                {scorePercentage} <span className="text-[0.5em] opacity-50">点</span>
              </h1>
              <p className="body-text opacity-70">
                {sampleQuestions.length} 問中 {score} 問正解
              </p>
            </div>

            <PixelCard className="mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 halftone-red w-40 h-40 opacity-15 pointer-events-none"></div>
              <div className="relative">
                <div className="mb-6">
                  <PixelProgress value={score} max={sampleQuestions.length} variant="vermillion" showLabel label="正解率" />
                </div>

                <div className="divider-line mb-6"></div>

                <div className="text-center py-4">
                  {scorePercentage >= 80 ? (
                    <>
                      <div className="font-display text-2xl mb-2" style={{ color: 'var(--vermillion)' }}>素晴らしい!</div>
                      <p className="body-text opacity-70">とても良い調子です。このまま頑張りましょう。</p>
                    </>
                  ) : scorePercentage >= 60 ? (
                    <>
                      <div className="font-display text-2xl mb-2" style={{ color: 'var(--cobalt)' }}>いい感じです</div>
                      <p className="body-text opacity-70">あと少し!間違えた問題を復習しましょう。</p>
                    </>
                  ) : (
                    <>
                      <div className="font-display text-2xl mb-2" style={{ color: 'var(--mustard-dark)' }}>もう一度!</div>
                      <p className="body-text opacity-70">基礎から復習して、もう一度挑戦してみましょう。</p>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <PixelButton onClick={handleRestart} variant="primary" className="flex-1">
                    もう一度挑戦
                  </PixelButton>
                  <Link href="/dashboard" className="flex-1">
                    <PixelButton variant="secondary" className="w-full">
                      ダッシュボードへ
                    </PixelButton>
                  </Link>
                </div>
              </div>
            </PixelCard>
          </section>
        )}
      </main>
    </div>
  );
}
