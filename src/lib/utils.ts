import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 计算等级所需经验值
export function getExpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// 计算宠物进化阶段
export function getEvolutionStage(level: number): 1 | 2 | 3 {
  if (level >= 26) return 3;
  if (level >= 11) return 2;
  return 1;
}

// 艾宾浩斯复习间隔（天数）
export function getReviewInterval(level: number): number {
  const intervals = [1, 2, 4, 7, 15, 30];
  return intervals[Math.min(level, intervals.length - 1)];
}

// 格式化日期
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// 随机数生成
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 打乱数组
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
