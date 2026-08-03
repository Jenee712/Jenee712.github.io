// ============================================================================
// gradeContent —— 年級感知的內容覆蓋層
// 頁面本來直接從 @/data/curriculum 取 englishUnits / mathUnits / getEnglishLesson ...
// 改成從這裡取，呼叫簽名完全不變；內部按「當前年級」返回內容：
//   - L2：原樣委託給現有 curriculum（孩子目前的 P1A 體驗零回退）
//   - 其餘級：返回帶年級標籤、難度遞增、可玩的「佔位內容」
//     真實 K–G6 題庫由家長提供後，只需替換這裡的 ENG_PAIRS / MATH_PROBLEMS。
// ============================================================================

import type { Lesson, LessonStep, Unit, SkillTrack, MathTopic } from '@/types';
import {
  englishUnits as curEnglishUnits,
  mathUnits as curMathUnits,
  getEnglishLesson as curGetEnglishLesson,
  getMathLesson as curGetMathLesson,
  englishContinue as curEnglishContinue,
  mathContinue as curMathContinue,
} from '@/data/curriculum';
import { GRADES, GradeKey, DEFAULT_GRADE, gradeDef } from './grades';

// ----------------------------------------------------------------- 工具
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ----------------------------------------------------------------- 英文佔位題庫（L1, L3–L7；L2 用真實內容）
interface Pair { en: string; cn: string; }
const ENG_PAIRS: Record<GradeKey, Pair[]> = {
  L1: [
    { en: 'I see a cat.', cn: '我看見一隻貓。' },
    { en: 'Red ball.', cn: '紅色的球。' },
    { en: 'A big dog.', cn: '一隻大狗。' },
    { en: 'Hello, bird!', cn: '你好，小鳥！' },
    { en: 'One apple.', cn: '一個蘋果。' },
  ],
  L2: [], // 委託真實 curriculum
  L3: [
    { en: 'We go to school.', cn: '我們去上學。' },
    { en: 'The dog is big.', cn: '這隻狗很大。' },
    { en: 'I like the sun.', cn: '我喜歡太陽。' },
    { en: 'She can run.', cn: '她會跑。' },
    { en: 'They play outside.', cn: '他們在外面玩。' },
  ],
  L4: [
    { en: 'He likes the red car.', cn: '他喜歡紅色的車。' },
    { en: 'We see a green tree.', cn: '我們看見一棵綠樹。' },
    { en: 'The cat is on the box.', cn: '貓在盒子上面。' },
    { en: 'They go to the park.', cn: '他們去公園。' },
    { en: 'She has a blue pen.', cn: '她有一支藍色的筆。' },
  ],
  L5: [
    { en: 'The children read books.', cn: '孩子們讀書。' },
    { en: 'We eat lunch at school.', cn: '我們在學校吃午餐。' },
    { en: 'My friend likes music.', cn: '我的朋友喜歡音樂。' },
    { en: 'The small bird sings.', cn: '小鳥唱歌。' },
    { en: 'They walk to the lake.', cn: '他們走到湖邊。' },
  ],
  L6: [
    { en: 'The students finish their homework.', cn: '學生們寫完作業。' },
    { en: 'Our teacher opens the window.', cn: '我們的老師打開窗戶。' },
    { en: 'These flowers are beautiful.', cn: '這些花很漂亮。' },
    { en: 'He writes a long letter.', cn: '他寫了一封長信。' },
    { en: 'We visit the old museum.', cn: '我們參觀古老的博物館。' },
  ],
  L7: [
    { en: 'Although it rained, we played outside.', cn: '雖然下雨，我們還是去外面玩。' },
    { en: 'The library is quieter than the playground.', cn: '圖書館比操場安靜。' },
    { en: 'She decided to join the club.', cn: '她決定加入社團。' },
    { en: 'They have lived here for years.', cn: '他們在這裡住了很多年。' },
    { en: 'We should protect the forest.', cn: '我們應該保護森林。' },
  ],
};

const ENG_TRACKS: { key: SkillTrack; title: string }[] = [
  { key: 'letter_sound', title: '字母認讀' },
  { key: 'phonics', title: '自然拼讀' },
  { key: 'sight_words', title: '視覺詞' },
  { key: 'theme_words', title: '主題詞彙' },
  { key: 'sentences', title: '簡單句型' },
  { key: 'reading', title: '繪本閱讀' },
];

// ----------------------------------------------------------------- 數學佔位題庫（L1, L3–L7；L2 用真實內容）
interface MathQ { q: string; a: string; opts: string[]; }
const MATH_PROBLEMS: Record<GradeKey, MathQ[]> = {
  L1: [
    { q: '數一數：🍎🍎🍎 有幾個？', a: '3', opts: ['2', '3', '4'] },
    { q: '哪個是圓形？', a: '●', opts: ['■', '●', '▲'] },
    { q: '1 和 2 合起來是？', a: '3', opts: ['2', '3', '4'] },
    { q: '數一數：🐟🐟 有幾條？', a: '2', opts: ['1', '2', '3'] },
  ],
  L2: [], // 委託真實 curriculum
  L3: [
    { q: '23 + 15 = ?', a: '38', opts: ['37', '38', '39'] },
    { q: '47 − 12 = ?', a: '35', opts: ['34', '35', '36'] },
    { q: '哪一個比較大？ 56 還是 45', a: '56', opts: ['45', '56'] },
    { q: '30 + 20 = ?', a: '50', opts: ['40', '50', '60'] },
  ],
  L4: [
    { q: '6 × 7 = ?', a: '42', opts: ['40', '42', '44'] },
    { q: '24 ÷ 4 = ?', a: '6', opts: ['5', '6', '7'] },
    { q: '8 × 9 = ?', a: '72', opts: ['71', '72', '73'] },
    { q: '把 10 平均分成 2 份，每份？', a: '5', opts: ['4', '5', '6'] },
  ],
  L5: [
    { q: '1/2 + 1/2 = ?', a: '1', opts: ['0', '1', '2'] },
    { q: '3/4 是幾分之幾？', a: '四分之三', opts: ['四分之一', '四分之三', '四分之二'] },
    { q: '0.3 + 0.4 = ?', a: '0.7', opts: ['0.6', '0.7', '0.8'] },
    { q: '12 ÷ 3 = ?', a: '4', opts: ['3', '4', '5'] },
  ],
  L6: [
    { q: '2.5 + 1.5 = ?', a: '4', opts: ['3', '4', '5'] },
    { q: '長方形面積 = 長 × ?', a: '寬', opts: ['高', '寬', '周長'] },
    { q: '0.6 − 0.2 = ?', a: '0.4', opts: ['0.3', '0.4', '0.5'] },
    { q: '求 25 的一半？', a: '12.5', opts: ['12', '12.5', '13'] },
  ],
  L7: [
    { q: '3 : 4 的比值約等於？', a: '0.75', opts: ['0.5', '0.75', '1'] },
    { q: '圓的面積公式用？', a: 'πr²', opts: ['πr²', '2πr', 'πd'] },
    { q: '把 1/2 化成小數？', a: '0.5', opts: ['0.25', '0.5', '0.75'] },
    { q: '三角形的內角和＝？', a: '180°', opts: ['90°', '180°', '360°'] },
  ],
};

const MATH_TOPICS: { key: MathTopic; title: string }[] = [
  { key: 'counting', title: '數數與數感' },
  { key: 'add_sub', title: '加減法' },
  { key: 'shapes', title: '圖形與空間' },
  { key: 'compare', title: '量的比較' },
  { key: 'clock', title: '時間' },
  { key: 'chart', title: '資料與圖表' },
];

// ----------------------------------------------------------------- 建構器
function buildEnglishUnits(grade: GradeKey): Unit[] {
  if (grade === 'L2') return curEnglishUnits;
  const def = gradeDef(grade);
  return ENG_TRACKS.map((t, i) => ({
    id: `u-${grade}-eng-${t.key}`,
    subject: 'english',
    title: `${def.label} · ${t.title}`,
    subtitle: def.tagline,
    storyTask: `在森林裡練習「${t.title}」，幫小鹿收集星星`,
    goals: [
      `認識 ${def.label} 程度的${t.title}內容`,
      '聽音辨形，開口跟讀',
      '完成 3 關挑戰',
    ],
    progress: 0,
    current: i === 0,
    done: false,
    lessons: 3,
    trackKey: t.key,
  }));
}

function buildEnglishLessons(grade: GradeKey): Lesson[] {
  if (grade === 'L2') return []; // 委託 curriculum
  const def = gradeDef(grade);
  const pairs = ENG_PAIRS[grade];
  const lessons: Lesson[] = [];
  let idx = 0;
  ENG_TRACKS.forEach((t, ti) => {
    for (let li = 0; li < 3; li++) {
      idx += 1;
      const target = pairs[(ti * 3 + li) % pairs.length];
      const others = shuffle(pairs.filter((p) => p.en !== target.en)).slice(0, 3);
      const choices = shuffle([target, ...others]);
      const step: LessonStep = {
        id: `g-${grade}-eng-${t.key}-${li}-s1`,
        prompt: `聽一聽，選出正確的句子（${t.title}）`,
        answer: target.en,
        choices: choices.map((c) => c.en),
        choicesCn: choices.map((c) => c.cn),
        ui: 'tap_choice',
        hint: '先聽清楚，再選出正確的句子',
      };
      lessons.push({
        id: `g-${grade}-eng-${t.key}-${li}`,
        index: idx,
        title: `${def.label} · ${t.title} ${li + 1}`,
        durationMin: 5,
        kind: 'theme_words',
        steps: [step],
      });
    }
  });
  return lessons;
}

function buildMathUnits(grade: GradeKey): Unit[] {
  if (grade === 'L2') return curMathUnits;
  const def = gradeDef(grade);
  return MATH_TOPICS.map((t, i) => ({
    id: `u-${grade}-math-${t.key}`,
    subject: 'math',
    title: `${def.label} · ${t.title}`,
    subtitle: def.tagline,
    storyTask: `用${t.title}幫農場動物解決難題`,
    goals: [
      `掌握 ${def.label} 程度的${t.title}`,
      '動手操作，理解算理',
      '完成 3 關挑戰',
    ],
    progress: 0,
    current: i === 0,
    done: false,
    lessons: 3,
    trackKey: t.key,
  }));
}

function buildMathLessons(grade: GradeKey): Lesson[] {
  if (grade === 'L2') return [];
  const def = gradeDef(grade);
  const problems = MATH_PROBLEMS[grade];
  const lessons: Lesson[] = [];
  let idx = 0;
  MATH_TOPICS.forEach((t, ti) => {
    for (let li = 0; li < 3; li++) {
      idx += 1;
      const p = problems[(ti * 3 + li) % problems.length];
      const step: LessonStep = {
        id: `g-${grade}-math-${t.key}-${li}-s1`,
        prompt: p.q,
        answer: p.a,
        choices: shuffle(p.opts),
        ui: 'tap_choice',
        hint: '想一想，再選答案',
      };
      lessons.push({
        id: `g-${grade}-math-${t.key}-${li}`,
        index: idx,
        title: `${def.label} · ${t.title} ${li + 1}`,
        durationMin: 5,
        kind: 'add_sub',
        steps: [step],
      });
    }
  });
  return lessons;
}

// ----------------------------------------------------------------- 快取 + 年級狀態
let currentGrade: GradeKey = DEFAULT_GRADE;
const engUnitsCache = new Map<GradeKey, Unit[]>();
const mathUnitsCache = new Map<GradeKey, Unit[]>();
const engLessonsCache = new Map<GradeKey, Lesson[]>();
const mathLessonsCache = new Map<GradeKey, Lesson[]>();

function getEngUnits(grade: GradeKey): Unit[] {
  if (!engUnitsCache.has(grade)) engUnitsCache.set(grade, buildEnglishUnits(grade));
  return engUnitsCache.get(grade)!;
}
function getEngLessons(grade: GradeKey): Lesson[] {
  if (!engLessonsCache.has(grade)) engLessonsCache.set(grade, buildEnglishLessons(grade));
  return engLessonsCache.get(grade)!;
}
function getMathUnits(grade: GradeKey): Unit[] {
  if (!mathUnitsCache.has(grade)) mathUnitsCache.set(grade, buildMathUnits(grade));
  return mathUnitsCache.get(grade)!;
}
function getMathLessons(grade: GradeKey): Lesson[] {
  if (!mathLessonsCache.has(grade)) mathLessonsCache.set(grade, buildMathLessons(grade));
  return mathLessonsCache.get(grade)!;
}

// 頁面以 `import { englishUnits }` 直接取用；用 live binding 在切年級時換內容。
export let englishUnits: Unit[] = getEngUnits(DEFAULT_GRADE);
export let mathUnits: Unit[] = getMathUnits(DEFAULT_GRADE);

/** 切換年級：更新內部狀態並替換匯出的 englishUnits / mathUnits。 */
export function refreshGrade(grade: GradeKey) {
  currentGrade = grade;
  englishUnits = getEngUnits(grade);
  mathUnits = getMathUnits(grade);
}

export function getCurrentGrade(): GradeKey {
  return currentGrade;
}

// ----------------------------------------------------------------- 對外函式（簽名與 curriculum 一致）
export function getEnglishLesson(id: string, difficulty: 'easy' | 'normal' | 'challenge'): Lesson {
  if (currentGrade === 'L2') return curGetEnglishLesson(id, difficulty) ?? curEnglishContinue(difficulty);
  return getEngLessons(currentGrade).find((l) => l.id === id) ?? englishContinue(difficulty);
}

export function getMathLesson(id: string, difficulty: 'easy' | 'normal' | 'challenge'): Lesson {
  if (currentGrade === 'L2') return curGetMathLesson(id, difficulty) ?? curMathContinue(difficulty);
  return getMathLessons(currentGrade).find((l) => l.id === id) ?? mathContinue(difficulty);
}

export function englishContinue(difficulty: 'easy' | 'normal' | 'challenge'): Lesson {
  if (currentGrade === 'L2') return curEnglishContinue(difficulty);
  return getEngLessons(currentGrade)[0];
}

export function mathContinue(difficulty: 'easy' | 'normal' | 'challenge'): Lesson {
  if (currentGrade === 'L2') return curMathContinue(difficulty);
  return getMathLessons(currentGrade)[0];
}

// 方便年級選擇器顯示每級單元數量
export function gradeUnitCounts(): Record<GradeKey, number> {
  return GRADES.reduce((acc, g) => {
    acc[g.key] = getEngUnits(g.key).length;
    return acc;
  }, {} as Record<GradeKey, number>);
}
