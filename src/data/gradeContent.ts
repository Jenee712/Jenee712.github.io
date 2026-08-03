// ============================================================================
// gradeContent —— 年级感知的内容覆盖层
// 页面本来直接从 @/data/curriculum 取 englishUnits / mathUnits / getEnglishLesson ...
// 改成从这里取，调用签名完全不变；内部按「当前年级」返回内容：
//   - L2：原样委托给现有 curriculum（孩子目前的 P1A 体验零回退）
//   - 其余级：返回带年级标签、难度递增、可玩的「占位内容」
//     真实 K–G6 题库由家长提供后，只需替换这里的 ENG_PAIRS / MATH_PROBLEMS。
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

// ----------------------------------------------------------------- 英文占位题库（L1, L3–L7；L2 用真实内容）
interface Pair { en: string; cn: string; }
const ENG_PAIRS: Record<GradeKey, Pair[]> = {
  L1: [
    { en: 'I see a cat.', cn: '我看见一只猫。' },
    { en: 'Red ball.', cn: '红色的球。' },
    { en: 'A big dog.', cn: '一只大狗。' },
    { en: 'Hello, bird!', cn: '你好，小鸟！' },
    { en: 'One apple.', cn: '一个苹果。' },
  ],
  L2: [], // 委托真实 curriculum
  L3: [
    { en: 'We go to school.', cn: '我们去上学。' },
    { en: 'The dog is big.', cn: '这只狗很大。' },
    { en: 'I like the sun.', cn: '我喜欢太阳。' },
    { en: 'She can run.', cn: '她会跑。' },
    { en: 'They play outside.', cn: '他们在外面玩。' },
  ],
  L4: [
    { en: 'He likes the red car.', cn: '他喜欢红色的车。' },
    { en: 'We see a green tree.', cn: '我们看见一棵绿树。' },
    { en: 'The cat is on the box.', cn: '猫在盒子上面。' },
    { en: 'They go to the park.', cn: '他们去公园。' },
    { en: 'She has a blue pen.', cn: '她有一支蓝色的笔。' },
  ],
  L5: [
    { en: 'The children read books.', cn: '孩子们读书。' },
    { en: 'We eat lunch at school.', cn: '我们在学校吃午餐。' },
    { en: 'My friend likes music.', cn: '我的朋友喜欢音乐。' },
    { en: 'The small bird sings.', cn: '小鸟唱歌。' },
    { en: 'They walk to the lake.', cn: '他们走到湖边。' },
  ],
  L6: [
    { en: 'The students finish their homework.', cn: '学生们写完作业。' },
    { en: 'Our teacher opens the window.', cn: '我们的老师打开窗户。' },
    { en: 'These flowers are beautiful.', cn: '这些花很漂亮。' },
    { en: 'He writes a long letter.', cn: '他写了一封长信。' },
    { en: 'We visit the old museum.', cn: '我们参观古老的博物馆。' },
  ],
  L7: [
    { en: 'Although it rained, we played outside.', cn: '虽然下雨，我们还是去外面玩。' },
    { en: 'The library is quieter than the playground.', cn: '图书馆比操场安静。' },
    { en: 'She decided to join the club.', cn: '她决定加入社团。' },
    { en: 'They have lived here for years.', cn: '他们在这里住了很多年。' },
    { en: 'We should protect the forest.', cn: '我们应该保护森林。' },
  ],
};

const ENG_TRACKS: { key: SkillTrack; title: string }[] = [
  { key: 'letter_sound', title: '字母认读' },
  { key: 'phonics', title: '自然拼读' },
  { key: 'sight_words', title: '视觉词' },
  { key: 'theme_words', title: '主题词汇' },
  { key: 'sentences', title: '简单句型' },
  { key: 'reading', title: '绘本阅读' },
];

// ----------------------------------------------------------------- 数学占位题库（L1, L3–L7；L2 用真实内容）
interface MathQ { q: string; a: string; opts: string[]; }
const MATH_PROBLEMS: Record<GradeKey, MathQ[]> = {
  L1: [
    { q: '数一数：🍎🍎🍎 有几个？', a: '3', opts: ['2', '3', '4'] },
    { q: '哪个是圆形？', a: '●', opts: ['■', '●', '▲'] },
    { q: '1 和 2 合起来是？', a: '3', opts: ['2', '3', '4'] },
    { q: '数一数：🐟🐟 有几条？', a: '2', opts: ['1', '2', '3'] },
  ],
  L2: [], // 委托真实 curriculum
  L3: [
    { q: '23 + 15 = ?', a: '38', opts: ['37', '38', '39'] },
    { q: '47 − 12 = ?', a: '35', opts: ['34', '35', '36'] },
    { q: '哪一个比较大？ 56 还是 45', a: '56', opts: ['45', '56'] },
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
    { q: '3/4 是几分之几？', a: '四分之三', opts: ['四分之一', '四分之三', '四分之二'] },
    { q: '0.3 + 0.4 = ?', a: '0.7', opts: ['0.6', '0.7', '0.8'] },
    { q: '12 ÷ 3 = ?', a: '4', opts: ['3', '4', '5'] },
  ],
  L6: [
    { q: '2.5 + 1.5 = ?', a: '4', opts: ['3', '4', '5'] },
    { q: '长方形面积 = 长 × ?', a: '宽', opts: ['高', '宽', '周长'] },
    { q: '0.6 − 0.2 = ?', a: '0.4', opts: ['0.3', '0.4', '0.5'] },
    { q: '求 25 的一半？', a: '12.5', opts: ['12', '12.5', '13'] },
  ],
  L7: [
    { q: '3 : 4 的比值约等于？', a: '0.75', opts: ['0.5', '0.75', '1'] },
    { q: '圆的面积公式用？', a: 'πr²', opts: ['πr²', '2πr', 'πd'] },
    { q: '把 1/2 化成小数？', a: '0.5', opts: ['0.25', '0.5', '0.75'] },
    { q: '三角形的内角和＝？', a: '180°', opts: ['90°', '180°', '360°'] },
  ],
};

const MATH_TOPICS: { key: MathTopic; title: string }[] = [
  { key: 'counting', title: '数数与数感' },
  { key: 'add_sub', title: '加减法' },
  { key: 'shapes', title: '图形与空间' },
  { key: 'compare', title: '量的比较' },
  { key: 'clock', title: '时间' },
  { key: 'chart', title: '资料与图表' },
];

// ----------------------------------------------------------------- 建构器
function buildEnglishUnits(grade: GradeKey): Unit[] {
  if (grade === 'L2') return curEnglishUnits;
  const def = gradeDef(grade);
  return ENG_TRACKS.map((t, i) => {
    const isAbcStart = grade === 'L1' && t.key === 'letter_sound';
    return {
      id: `u-${grade}-eng-${t.key}`,
      subject: 'english',
      title: isAbcStart ? `${def.label} · ABC 字母启蒙` : `${def.label} · ${t.title}`,
      subtitle: def.tagline,
      storyTask: isAbcStart ? '和小鹿一起找到 A、B、C 字母果实' : `在森林里练习「${t.title}」，帮小鹿收集星星`,
      goals: isAbcStart ? [
        '认识大小写 A a、B b、C c',
        '跟读 apple、bear、cat',
        '完成字母描红',
      ] : [
        `认识 ${def.label} 程度的${t.title}内容`,
        '听音辨形，开口跟读',
        '完成 3 关挑战',
      ],
      progress: 0,
      current: i === 0,
      done: false,
      lessons: 3,
      trackKey: t.key,
    };
  });
}

function buildEnglishLessons(grade: GradeKey): Lesson[] {
  if (grade === 'L2') return []; // 委托 curriculum
  const def = gradeDef(grade);
  const pairs = ENG_PAIRS[grade];
  const lessons: Lesson[] = [];
  let idx = 0;
  ENG_TRACKS.forEach((t, ti) => {
    if (grade === 'L1' && t.key === 'letter_sound') {
      const abc = [
        { upper: 'A', lower: 'a', word: 'apple', cn: '苹果' },
        { upper: 'B', lower: 'b', word: 'bear', cn: '小熊' },
        { upper: 'C', lower: 'c', word: 'cat', cn: '小猫' },
      ];
      abc.forEach((item, letterIndex) => {
        idx += 1;
        lessons.push({
          id: `g-L1-eng-letter_sound-${letterIndex}`,
          index: idx,
          title: `认识字母 ${item.upper} ${item.lower}`,
          durationMin: 5,
          kind: 'letter_trace',
          steps: [
            {
              id: `g-L1-eng-letter_sound-${letterIndex}-choose`,
              prompt: `找到大写字母 ${item.upper}`,
              answer: item.upper,
              choices: ['A', 'B', 'C'],
              ui: 'tap_choice',
              hint: `看看字母卡上的 ${item.upper}`,
            },
            {
              id: `g-L1-eng-letter_sound-${letterIndex}-trace`,
              prompt: `用手指描一描 ${item.upper}`,
              answer: item.upper,
              ui: 'trace_letter',
            },
            {
              id: `g-L1-eng-letter_sound-${letterIndex}-read`,
              prompt: `跟读：${item.upper}, ${item.word}.`,
              answer: `${item.upper}, ${item.word}.`,
              choicesCn: [item.cn],
              ui: 'read_along',
            },
          ],
        });
      });
      return;
    }
    for (let li = 0; li < 3; li++) {
      idx += 1;
      const target = pairs[(ti * 3 + li) % pairs.length];
      const others = shuffle(pairs.filter((p) => p.en !== target.en)).slice(0, 3);
      const choices = shuffle([target, ...others]);
      const step: LessonStep = {
        id: `g-${grade}-eng-${t.key}-${li}-s1`,
        prompt: `听一听，选出正确的句子（${t.title}）`,
        answer: target.en,
        choices: choices.map((c) => c.en),
        choicesCn: choices.map((c) => c.cn),
        ui: 'tap_choice',
        hint: '先听清楚，再选出正确的句子',
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
    storyTask: `用${t.title}帮农场动物解决难题`,
    goals: [
      `掌握 ${def.label} 程度的${t.title}`,
      '动手操作，理解算理',
      '完成 3 关挑战',
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
        hint: '想一想，再选答案',
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

// ----------------------------------------------------------------- 缓存 + 年级状态
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

// 页面以 `import { englishUnits }` 直接取用；用 live binding 在切年级时换内容。
export let englishUnits: Unit[] = getEngUnits(DEFAULT_GRADE);
export let mathUnits: Unit[] = getMathUnits(DEFAULT_GRADE);

/** 切换年级：更新内部状态并替换汇出的 englishUnits / mathUnits。 */
export function refreshGrade(grade: GradeKey) {
  currentGrade = grade;
  englishUnits = getEngUnits(grade);
  mathUnits = getMathUnits(grade);
}

export function getCurrentGrade(): GradeKey {
  return currentGrade;
}

// ----------------------------------------------------------------- 对外函数（签名与 curriculum 一致）
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

// 方便年级选择器显示每级单元数量
export function gradeUnitCounts(): Record<GradeKey, number> {
  return GRADES.reduce((acc, g) => {
    acc[g.key] = getEngUnits(g.key).length;
    return acc;
  }, {} as Record<GradeKey, number>);
}
