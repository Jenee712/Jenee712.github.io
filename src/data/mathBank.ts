/**
 * 二年级数学题库（进程化生成，全为原创题面）。
 * 涵盖：100 以内进/退位加减、表内乘法 2–9、比较大小、认识钟表、认识人民币。
 */
import type { Lesson, LessonStep } from '@/types';

let _seq = 0;
const sid = () => `s${++_seq}`;
const np = (prompt: string, answer: number, hint?: string): LessonStep => ({ id: sid(), ui: 'number_pad', prompt, answer, hint });
const tc = (prompt: string, answer: string, choices: string[]): LessonStep => ({ id: sid(), ui: 'tap_choice', prompt, answer, choices });
const drA = (prompt: string, answer: number, b1: number, b2: number): LessonStep => ({ id: sid(), ui: 'drag_count', prompt, answer, bagCount: b1, bagCount2: b2, bagOp: 'add' });
const drR = (prompt: string, answer: number, total: number, sub: number): LessonStep => ({ id: sid(), ui: 'drag_count', prompt, answer, bagCount: total, bagCount2: sub, bagOp: 'remove' });

const ls = (id: string, title: string, duration: number, kind: Lesson['kind'], steps: LessonStep[], index: number): Lesson => ({
  id, index, title, durationMin: duration, kind, steps: steps.map((s, i) => ({ ...s, id: `${id}-${i + 1}` })),
});

// ─────────────── 20 以内加法（拖拽复习）───────────────
const add20: Lesson[] = [
  [3, 1], [2, 3], [4, 2], [3, 2], [5, 1], [4, 3], [2, 2], [3, 3], [5, 4], [4, 4],
].map(([a, b], i) => ls(`math-g2-a20-${i + 1}`, `加法复习：${a} + ${b}`, 5, 'add_sub', [
  drA('把两堆合到托盘里', a + b, a, b),
  np(`${a} + ${b} = ?`, a + b),
], i + 1));

// ─────────────── 100 以内不进位加 ───────────────
const addNC: Lesson[] = [
  [23, 14], [35, 22], [46, 31], [52, 25], [61, 27], [34, 43], [70, 18], [55, 24], [41, 37], [63, 26],
].map(([a, b], i) => ls(`math-g2-anc-${i + 1}`, `加法（不进位）：${a} + ${b}`, 6, 'add_sub', [
  np(`${a} + ${b} = ?`, a + b),
  tc(`${a} + ${b} 比 50 大还是小？`, a + b >= 50 ? '大' : '小', ['大', '小']),
], i + 1));

// ─────────────── 100 以内进位加 ───────────────
const addC: Lesson[] = [
  [24, 18], [35, 27], [46, 35], [52, 39], [61, 29], [37, 34], [45, 28], [56, 27], [68, 23], [29, 35],
].map(([a, b], i) => ls(`math-g2-ac-${i + 1}`, `加法（进位）：${a} + ${b}`, 7, 'add_sub', [
  np(`${a} + ${b} = ?`, a + b),
  np(`加难一点：${a} + ${b + 10} = ?`, a + b + 10),
], i + 1));

// ─────────────── 100 以内不退位减 ───────────────
const subNB: Lesson[] = [
  [56, 23], [78, 34], [89, 45], [67, 32], [98, 56], [75, 43], [86, 51], [69, 37],
].map(([a, b], i) => ls(`math-g2-snb-${i + 1}`, `减法（不退位）：${a} − ${b}`, 6, 'add_sub', [
  np(`${a} − ${b} = ?`, a - b),
  tc(`${a} − ${b} 比 50 大还是小？`, a - b >= 50 ? '大' : '小', ['大', '小']),
], i + 1));

// ─────────────── 100 以内退位减 ───────────────
const subB: Lesson[] = [
  [52, 27], [63, 38], [74, 39], [81, 35], [93, 48], [65, 27], [76, 49], [84, 37], [92, 58], [53, 26],
].map(([a, b], i) => ls(`math-g2-sb-${i + 1}`, `减法（退位）：${a} − ${b}`, 7, 'add_sub', [
  np(`${a} − ${b} = ?`, a - b),
  np(`加难一点：${a} − ${b - 10} = ?`, a - (b - 10)),
], i + 1));

// ─────────────── 表内乘法 2–5 ───────────────
const mulLow: Lesson[] = [];
let mulLowIdx = 0;
for (let a = 2; a <= 5; a++) {
  for (let b = 1; b <= 9; b++) {
    mulLowIdx++;
    mulLow.push(ls(`math-g2-mul-${a}-${b}`, `${a} × ${b}`, 5, 'add_sub', [
      np(`${a} × ${b} = ?`, a * b),
      tc(`${a} × ${b} 等于多少？`, String(a * b), [String(a * b - 2), String(a * b), String(a * b + 2)].sort(() => Math.random() - 0.5)),
    ], mulLowIdx));
  }
}

// ─────────────── 表内乘法 6–9 ───────────────
const mulHigh: Lesson[] = [];
let mulHighIdx = 0;
for (let a = 6; a <= 9; a++) {
  for (let b = 1; b <= 9; b++) {
    mulHighIdx++;
    mulHigh.push(ls(`math-g2-mul-${a}-${b}`, `${a} × ${b}`, 5, 'add_sub', [
      np(`${a} × ${b} = ?`, a * b),
      tc(`${a} × ${b} 等于多少？`, String(a * b), [String(a * b - 3), String(a * b), String(a * b + 3)].sort(() => Math.random() - 0.5)),
    ], mulHighIdx));
  }
}

// ─────────────── 比较大小 ───────────────
const cmp: Lesson[] = [
  { a: 34, b: 43 }, { a: 67, b: 76 }, { a: 55, b: 65 }, { a: 89, b: 98 }, { a: 47, b: 39 }, { a: 100, b: 99 },
].map((p, i) => ls(`math-g2-cmp-${i + 1}`, `比大小：${p.a} ○ ${p.b}`, 5, 'compare', [
  tc(`${p.a} 和 ${p.b} 谁大？填 ${'>'} / ${'<'} / ${'='}`, p.a > p.b ? '>' : p.a < p.b ? '<' : '=', ['>', '<', '=']),
  np(`${p.a} 和 ${p.b} 相差多少？`, Math.abs(p.a - p.b)),
], i + 1));

// ─────────────── 认识钟表 ───────────────
const clk: Lesson[] = [
  { h: 3 }, { h: 7 }, { h: 10 }, { h: 12 },
].map((p, i) => ls(`math-g2-clk-${i + 1}`, `认整点：${p.h} 时`, 6, 'clock_set', [
  tc(`现在是 ${p.h} 时，分针指向？`, '12', ['3', '6', '12']),
  np(`${p.h} 时再过 1 小时是几时？`, (p.h % 12) + 1),
], i + 1));

// ─────────────── 认识人民币 ───────────────
const money: Lesson[] = [
  { a: 5, b: 2 }, { a: 10, b: 3 }, { a: 20, b: 5 }, { a: 50, b: 1 },
].map((p, i) => ls(`math-g2-mon-${i + 1}`, `人民币：${p.a}元 + ${p.b}元`, 6, 'add_sub', [
  np(`${p.a} + ${p.b} = ?`, p.a + p.b),
  tc(`${p.a + p.b} 元能买什幺？`, '都可以', ['一支笔', '一个书包', '都可以']),
], i + 1));

export const mathBank: Lesson[] = [
  ...add20,
  ...addNC,
  ...addC,
  ...subNB,
  ...subB,
  ...mulLow,
  ...mulHigh,
  ...cmp,
  ...clk,
  ...money,
];

export const mathBankByTopic = {
  add20: add20.map((l) => l.id),
  addNC: addNC.map((l) => l.id),
  addC: addC.map((l) => l.id),
  subNB: subNB.map((l) => l.id),
  subB: subB.map((l) => l.id),
  mulLow: mulLow.map((l) => l.id),
  mulHigh: mulHigh.map((l) => l.id),
  cmp: cmp.map((l) => l.id),
  clk: clk.map((l) => l.id),
  mon: money.map((l) => l.id),
};