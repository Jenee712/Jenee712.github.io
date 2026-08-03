/**
 * 60 天暑期教学路线图（二年级，每天约 1 小时）。
 * - Day 1–7：20 以内加法复习（拖拽）
 * - Day 8–14：100 以内不进位加法
 * - Day 15–21：100 以内进位加法
 * - Day 22–28：100 以内退位减法
 * - Day 29–35：表内乘法 2–5
 * - Day 36–42：表内乘法 6–9
 * - Day 43–49：比较大小 + 认识钟表
 * - Day 50–56：认识人民币 + 统计
 * - Day 57–60：综合复习
 */
import type { TodayTask, WeakLesson } from '@/types';
import { mathBank, mathBankByTopic } from './mathBank';
import { englishBank, englishBankByTopic } from './englishBank';
import { pictureBookMap } from './pictureBooks';
import {
  phonicsLessons, phonicsChallenge, englishThemeWordLessons, englishSentenceLessons, englishSightWordLessons,
  chineseLessons,
} from './curriculum';

const SUMMER_START = '2026-07-01';

export function dayOfSummer(date: Date = new Date()): number {
  const start = new Date(`${SUMMER_START}T00:00:00`);
  const today = new Date(date.toISOString().slice(0, 10) + 'T00:00:00');
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  return Math.max(1, Math.min(60, diff));
}

export interface DayDef {
  day: number;
  theme: string;
  mathIds: string[];
  /** 体量 ×2 后每天 2 个语文模块（古诗 / 成语 / 认字 / 阅读 按周轮换） */
  chineseIds: string[];
  /** 每天 4 个英语模块（按家长要求，英语前置且加量） */
  englishIds: string[];
}

const ALL_CHINESE = chineseLessons.map((l) => l.id);

// 每段主题对应：数学课池 + 英语课池（英语按周进阶，已彻底废除自然拼读）：
//   主题词·生活(vocabBasic) → 主题词·世界(vocabExt) → 句型翻译(sentences) → 阅读理解(reading)
const SEGMENT: { theme: string; pool: string[]; engPool: string[] }[] = [
  { theme: '第 1 周 · 20 以内加法复习',    pool: mathBankByTopic.add20,                 engPool: englishBankByTopic.vocabBasic },
  { theme: '第 2 周 · 100 以内不进位加法', pool: mathBankByTopic.addNC,                  engPool: englishBankByTopic.vocabBasic },
  { theme: '第 3 周 · 100 以内进位加法',   pool: mathBankByTopic.addC,                   engPool: englishBankByTopic.vocabExt },
  { theme: '第 4 周 · 100 以内退位减法',   pool: [...mathBankByTopic.subNB, ...mathBankByTopic.subB], engPool: englishBankByTopic.vocabExt },
  { theme: '第 5 周 · 表内乘法 2–5',     pool: mathBankByTopic.mulLow,                 engPool: englishBankByTopic.sentences },
  { theme: '第 6 周 · 表内乘法 6–9',     pool: mathBankByTopic.mulHigh,                engPool: englishBankByTopic.sentences },
  { theme: '第 7 周 · 比较大小与钟表',     pool: [...mathBankByTopic.cmp, ...mathBankByTopic.clk], engPool: englishBankByTopic.sentences },
  { theme: '第 8 周 · 人民币与统计',      pool: [...mathBankByTopic.mon, ...mathBankByTopic.cmp],  engPool: englishBankByTopic.picture_book },
  { theme: '第 9 周 · 综合复习',           pool: [...mathBankByTopic.addC, ...mathBankByTopic.subB, ...mathBankByTopic.mulHigh], engPool: englishBankByTopic.picture_book },
];

function buildDays(): DayDef[] {
  const days: DayDef[] = [];
  for (let d = 1; d <= 60; d++) {
    const segIdx = Math.min(SEGMENT.length - 1, Math.floor((d - 1) / 7));
    const seg = SEGMENT[segIdx];
    // 每天从该段题池里抽 6 题数学（按 day 偏移 + 步长 2，确保相邻天不重复；题库充裕）
    const mathOffset = ((d - 1) * 2) % Math.max(1, seg.pool.length);
    const mathIds: string[] = [];
    for (let k = 0; k < 6; k++) mathIds.push(seg.pool[(mathOffset + k) % seg.pool.length]);
    // 每天 4 个英语模块（按家长要求：英语前置、加量 — 体量 ×2）
    const enOffset = ((d - 1) * 2) % Math.max(1, seg.engPool.length);
    const englishIds: string[] = [];
    for (let k = 0; k < 4; k++) englishIds.push(seg.engPool[(enOffset + k) % seg.engPool.length]);
    // 每天 2 个语文模块（古诗 + 认字 / 成语 / 阅读，按天轮换）
    const chiOffset = ((d - 1) * 2) % Math.max(1, ALL_CHINESE.length);
    const chineseIds: string[] = [
      ALL_CHINESE[chiOffset % ALL_CHINESE.length],
      ALL_CHINESE[(chiOffset + 1) % ALL_CHINESE.length],
    ];
    days.push({
      day: d,
      theme: `${seg.theme} · 第 ${d} 天`,
      mathIds,
      chineseIds,
      englishIds,
    });
  }
  return days;
}

const DAYS = buildDays();
const MATH_MAP = new Map(mathBank.map((l) => [l.id, l]));
const CHI_MAP = new Map(chineseLessons.map((l) => [l.id, l]));
const ENG_MAP = new Map(
  [...phonicsLessons, ...phonicsChallenge, ...englishThemeWordLessons, ...englishSentenceLessons, ...englishSightWordLessons, ...englishBank]
    .map((l) => [l.id, l] as const),
);

function detailFor(kind: string): string {
  if (kind === 'poem') return '古诗朗诵与理解';
  if (kind === 'idiom') return '成语故事与运用';
  if (kind === 'character') return '认字与跟读';
  if (kind === 'theme_words') return '英↔中翻译 · 4 关';
  if (kind === 'sentence_build') return '中翻英 · 4 关';
  if (kind === 'read_along') return '中英对照阅读';
  return '听 · 读 · 说';
}

export function getDayDef(day: number): DayDef {
  return DAYS[Math.max(1, Math.min(60, day)) - 1];
}

/**
 * 生成第 N 天的「今日飞行计划」。
 * 顺序（按家长要求）：英语(4 模块) → 数学(6) → 语文(2) → 薄弱复习(≤2) → 伸展 → 复习
 * 体量按 ×2 加倍（英语 4 / 数学 6 / 语文 2，每天约 80-100 分钟）。
 */
export function getDayPlan(day: number, weak: WeakLesson[] = []): TodayTask[] {
  const def = getDayDef(day);
  const tasks: TodayTask[] = [];

  // 1) 英语 4 个模块（前置，按家长要求加大英语比重 & 体量 ×2）
  def.englishIds.forEach((eid, i) => {
    // 绘本任务：第 50–60 天阅读段会编排原创绘本
    if (eid.startsWith('pb-')) {
      const book = pictureBookMap.get(eid);
      if (!book) return;
      tasks.push({
        id: `d${day}-eb${i}`,
        subject: 'english',
        title: `绘本 · ${book.titleCn}`,
        detail: `${book.level} · 翻页读 ${book.pages.length} 页`,
        durationMin: book.durationMin,
        done: false,
        kind: 'book',
        lessonId: book.id,
      });
      return;
    }
    const lesson = ENG_MAP.get(eid);
    if (!lesson) return;
    tasks.push({
      id: `d${day}-e${i}`,
      subject: 'english',
      title: `英语 · ${lesson.title}`,
      detail: detailFor(lesson.kind),
      durationMin: lesson.durationMin,
      done: false,
      kind: 'normal',
      lessonId: lesson.id,
    });
  });

  // 2) 数学 6 题（体量 ×2）
  def.mathIds.forEach((mid, i) => {
    const lesson = MATH_MAP.get(mid);
    if (!lesson) return;
    tasks.push({
      id: `d${day}-m${i}`,
      subject: 'math',
      title: `数学 · ${lesson.title}`,
      detail: def.theme,
      durationMin: lesson.durationMin,
      done: false,
      kind: 'normal',
      lessonId: lesson.id,
    });
  });

  // 3) 语文 2 个模块（古诗 / 成语 / 认字 / 阅读，体量 ×2）
  def.chineseIds.forEach((cid, i) => {
    const lesson = CHI_MAP.get(cid);
    if (!lesson) return;
    tasks.push({
      id: `d${day}-c${i}`,
      subject: 'chinese',
      title: `语文 · ${lesson.title}`,
      detail: detailFor(lesson.kind),
      durationMin: 8,
      done: false,
      kind: 'normal',
      lessonId: lesson.id,
    });
  });

  // 4) 薄弱复习（自动加，移到学科之后）
  weak.slice(0, 2).forEach((w, i) => {
    tasks.push({
      id: `d${day}-w${i}`,
      subject: w.subject,
      title: `🔁 复习 · ${w.title}`,
      detail: '把之前不熟的地方再练一次',
      durationMin: 6,
      done: false,
      kind: 'normal',
      lessonId: w.lessonId,
    });
  });

  // 5) 伸展 + 复习小花园
  tasks.push({ id: `d${day}-rest`, subject: 'rest', title: '伸展补给站', detail: '跟原创角色做 60 秒肩颈操', durationMin: 1, done: false, kind: 'rest' });
  tasks.push({ id: `d${day}-rev`, subject: 'review', title: '复习小花园 · 薄弱点', detail: '巩固今天学过的', durationMin: 4, done: false, kind: 'review' });
  return tasks;
}

export const PLAN_TOTAL_DAYS = 60;