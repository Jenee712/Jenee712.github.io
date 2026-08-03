/**
 * 英语二年级 60 天题库（进程化生成）。
 *
 * 设计原则（按家长/老师反馈，已彻底废除自然拼读路线）：
 *   - 不教 phonics / 不出现英标相关题
 *   - 每个词都考英↔中翻译，避免「找一样的字」就能答对
 *   - 难度循序渐进：识词 → 看中文选英文 → 看英文选中文 → 拼写 → 读句 → 阅读理解
 *
 * 路线图（取代旧的 phonics→sight→theme→sentence→reading）：
 *   vocab_basic(主题词·生活) → vocab_ext(主题词·世界) → sentences(句型·中翻英)
 *   → reading(阅读理解)
 *
 * 全部为原创题面与教学结构。
 */
import type { Lesson, LessonStep } from '@/types';

// 简单可重现洗牌（固定种子，避免每次载入顺序漂移）
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(arr: T[], seed: number): T[] {
  const r = rng(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// choicesFor 已重构为下方的 pickChoices（回传 choices + 与之一一对齐的 choicesCn）
const letters = (w: string) => w.split('');

// ============================================================
// 1. 主题词（vocab_basic）— 生活场景，英↔中翻译
// ============================================================
type Pair = { en: string; cn: string };
const THEMES_BASIC: { id: string; title: string; pairs: Pair[]; sentence: { en: string; cn: string } }[] = [
  { id: 'animals',  title: '森林动物', pairs: [
      { en: 'cat', cn: '猫' }, { en: 'dog', cn: '狗' }, { en: 'pig', cn: '猪' },
      { en: 'fox', cn: '狐狸' }, { en: 'cow', cn: '牛' }, { en: 'duck', cn: '鸭' },
    ], sentence: { en: 'I see a cat and a dog.', cn: '我看见一只猫和一只狗。' } },
  { id: 'colors',   title: '颜色', pairs: [
      { en: 'red', cn: '红色' }, { en: 'blue', cn: '蓝色' }, { en: 'green', cn: '绿色' },
      { en: 'yellow', cn: '黄色' }, { en: 'black', cn: '黑色' }, { en: 'white', cn: '白色' },
    ], sentence: { en: 'The sun is yellow.', cn: '太阳是黄色的。' } },
  { id: 'numbers',  title: '数字 1–10', pairs: [
      { en: 'one', cn: '一' }, { en: 'two', cn: '二' }, { en: 'three', cn: '三' },
      { en: 'four', cn: '四' }, { en: 'five', cn: '五' }, { en: 'ten', cn: '十' },
    ], sentence: { en: 'I have two apples.', cn: '我有两个苹果。' } },
  { id: 'body',     title: '身体', pairs: [
      { en: 'hand', cn: '手' }, { en: 'foot', cn: '脚' }, { en: 'eye', cn: '眼睛' },
      { en: 'ear', cn: '耳朵' }, { en: 'nose', cn: '鼻子' }, { en: 'mouth', cn: '嘴巴' },
    ], sentence: { en: 'I have two hands.', cn: '我有两只手。' } },
  { id: 'food',     title: '食物', pairs: [
      { en: 'apple', cn: '苹果' }, { en: 'egg', cn: '鸡蛋' }, { en: 'milk', cn: '牛奶' },
      { en: 'rice', cn: '米饭' }, { en: 'cake', cn: '蛋糕' }, { en: 'meat', cn: '肉' },
    ], sentence: { en: 'I eat an apple.', cn: '我吃一个苹果。' } },
  { id: 'school',   title: '学校用品', pairs: [
      { en: 'book', cn: '书' }, { en: 'bag', cn: '书包' }, { en: 'pen', cn: '笔' },
      { en: 'desk', cn: '书桌' }, { en: 'ruler', cn: '尺子' }, { en: 'pencil', cn: '铅笔' },
    ], sentence: { en: 'I have a book.', cn: '我有一本书。' } },
  { id: 'family',   title: '家人', pairs: [
      { en: 'mum', cn: '妈妈' }, { en: 'dad', cn: '爸爸' }, { en: 'brother', cn: '兄弟' },
      { en: 'sister', cn: '姐妹' }, { en: 'baby', cn: '宝宝' }, { en: 'grandma', cn: '奶奶' },
    ], sentence: { en: 'I like my mum.', cn: '我喜欢妈妈。' } },
];

// ============================================================
// 2. 主题词（vocab_ext）— 世界场景，英↔中翻译
// ============================================================
const THEMES_EXT: { id: string; title: string; pairs: Pair[]; sentence: { en: string; cn: string } }[] = [
  { id: 'clothes',  title: '衣物', pairs: [
      { en: 'hat', cn: '帽子' }, { en: 'shirt', cn: '衬衫' }, { en: 'sock', cn: '袜子' },
      { en: 'shoe', cn: '鞋子' }, { en: 'coat', cn: '外套' }, { en: 'dress', cn: '裙子' },
    ], sentence: { en: 'Put on your hat.', cn: '戴上你的帽子。' } },
  { id: 'actions',  title: '动作', pairs: [
      { en: 'run', cn: '跑' }, { en: 'jump', cn: '跳' }, { en: 'sing', cn: '唱' },
      { en: 'swim', cn: '游泳' }, { en: 'read', cn: '读' }, { en: 'write', cn: '写' },
    ], sentence: { en: 'I can run and jump.', cn: '我会跑也会跳。' } },
  { id: 'weather',  title: '天气', pairs: [
      { en: 'sun', cn: '太阳' }, { en: 'rain', cn: '雨' }, { en: 'snow', cn: '雪' },
      { en: 'wind', cn: '风' }, { en: 'cloud', cn: '云' }, { en: 'storm', cn: '暴风雨' },
    ], sentence: { en: 'The sun is hot.', cn: '太阳很热。' } },
  { id: 'nature',   title: '大自然', pairs: [
      { en: 'tree', cn: '树' }, { en: 'flower', cn: '花' }, { en: 'leaf', cn: '叶子' },
      { en: 'grass', cn: '草' }, { en: 'star', cn: '星星' }, { en: 'moon', cn: '月亮' },
    ], sentence: { en: 'I see a red flower.', cn: '我看见一朵红花。' } },
  { id: 'transport', title: '交通工具', pairs: [
      { en: 'car', cn: '汽车' }, { en: 'bus', cn: '公交车' }, { en: 'boat', cn: '船' },
      { en: 'bike', cn: '自行车' }, { en: 'train', cn: '火车' }, { en: 'plane', cn: '飞机' },
    ], sentence: { en: 'I go by bus.', cn: '我坐公交车去。' } },
  { id: 'home',     title: '家里', pairs: [
      { en: 'bed', cn: '床' }, { en: 'door', cn: '门' }, { en: 'chair', cn: '椅子' },
      { en: 'table', cn: '桌子' }, { en: 'lamp', cn: '灯' }, { en: 'room', cn: '房间' },
    ], sentence: { en: 'The cat is on the chair.', cn: '猫在椅子上。' } },
  { id: 'opp',      title: '反义词', pairs: [
      { en: 'big', cn: '大' }, { en: 'small', cn: '小' }, { en: 'hot', cn: '热' },
      { en: 'cold', cn: '冷' }, { en: 'fast', cn: '快' }, { en: 'slow', cn: '慢' },
    ], sentence: { en: 'The cat is big.', cn: '猫很大。' } },
];

// 单字/短语 英→中 翻译字典（覆盖题库所有出现过的英文词；句型填空选项、阅读理解选项都靠它补中文）
const WORD_CN: Record<string, string> = {};
[...THEMES_BASIC, ...THEMES_EXT].forEach((t) =>
  t.pairs.forEach((p) => { WORD_CN[p.en] = p.cn; })
);
Object.assign(WORD_CN, {
  see: '看', am: '是', are: '是', is: '是', have: '有', like: '喜欢', can: '会',
  go: '去', we: '我们', you: '你', he: '他', i: '我', this: '这', that: '那',
  it: '它', here: '这里', where: '哪里', there: '那里', two: '两', big: '大',
  small: '小', book: '书', dog: '狗', cow: '牛', cat: '猫', tree: '树',
  flower: '花', grass: '草', rain: '雨', sun: '太阳', apple: '苹果',
  sweet: '甜', lake: '湖', school: '学校', mum: '妈妈',
});

interface ChoiceItem { en: string; cn: string }

/** 从 pool（含正解）中挑 3~4 个选项，正解不排第一；同时回传与 choices 一一对齐的 choicesCn（中文翻译，无则 ''）。
 *  - 选项本身是英文（看中文选英文 / 句型整句 / 阅读理解）：choicesCn 给中文，朗读时「英文 + 中文」成对念。
 *  - 选项本身是中文（看英文选中文）：调用方把 cn 当 en、cn 栏留空，朗读时只念中文。 */
function pickChoices(answer: string, pool: ChoiceItem[]): { choices: string[]; choicesCn: string[] } {
  const list = pool.filter((p) => p.en !== answer);
  if (list.length <= 3) {
    const items = shuffle([...pool], answer.length * 7 + 3);
    if (items[0]?.en === answer && items.length > 1) [items[0], items[1]] = [items[1], items[0]];
    return { choices: items.map((i) => i.en), choicesCn: items.map((i) => i.cn) };
  }
  const others = shuffle(list, answer.length * 7 + 3).slice(0, 3);
  const ans = pool.find((p) => p.en === answer)!;
  const items = shuffle([ans, ...others], answer.length * 13 + 5);
  if (items[0]?.en === answer) [items[0], items[1]] = [items[1], items[0]];
  return { choices: items.map((i) => i.en), choicesCn: items.map((i) => i.cn) };
}

/**
 * 构造一个主题词课：每课 4 关，难度递进。
 *   1) 看英文选中文（英→中）
 *   2) 看中文选英文（中→英，更难）
 *   3) 看中文拼写出英文（拼写，最难）
 *   4) 中英对照朗读
 */
function makeVocabLesson(prefix: string, i: number, t: { id: string; title: string; pairs: Pair[]; sentence: { en: string; cn: string } }): Lesson {
  const p0 = t.pairs[0];
  const p1 = t.pairs[1];
  const c1 = pickChoices(p0.cn, t.pairs.map((p) => ({ en: p.cn, cn: '' })));
  const c2 = pickChoices(p1.en, t.pairs.map((p) => ({ en: p.en, cn: p.cn })));
  const steps: LessonStep[] = [
    { id: `${prefix}-${t.id}-1`, ui: 'tap_choice',
      prompt: `"${p0.en}" 的中文是什幺？`,
      answer: p0.cn,
      choices: c1.choices, choicesCn: c1.choicesCn,
      hint: `听一听 ${p0.en}，再想对应的中文` },
    { id: `${prefix}-${t.id}-2`, ui: 'tap_choice',
      prompt: `"${p1.cn}" 的英文是哪个？`,
      answer: p1.en,
      choices: c2.choices, choicesCn: c2.choicesCn,
      hint: `看到中文，先想它的英文` },
    { id: `${prefix}-${t.id}-3`, ui: 'blend',
      prompt: `拼写出 "${t.pairs[2].cn}" 的英文`,
      answer: letters(t.pairs[2].en),
      decoys: ['b', 'p', 'q'] },
    { id: `${prefix}-${t.id}-4`, ui: 'read_along',
      prompt: `中英对照：${t.sentence.cn}  ·  ${t.sentence.en}`,
      answer: t.sentence.en },
  ];
  return { id: `eng-${prefix}-${t.id}`, index: i + 1, title: `主题词 · ${t.title}`, durationMin: 8, kind: 'theme_words', steps };
}

const vocabBasic: Lesson[] = THEMES_BASIC.map((t, i) => makeVocabLesson('vb1', i, t));
const vocabExt:   Lesson[] = THEMES_EXT.map((t, i) => makeVocabLesson('vb2', i, t));

// ============================================================
// 3. 句型（sentences）— 中翻英 + 英翻中 + 排句
// ============================================================
const SENT: { id: string; title: string; en: string; cn: string; blank: { position: number; answer: string; choices: string[] } }[] = [
  { id: 'ican',   title: 'I can …',   en: 'I can run',     cn: '我会跑',
    blank: { position: 2, answer: 'run',    choices: ['run', 'swim', 'sing', 'jump'] } },
  { id: 'ilike',  title: 'I like …',  en: 'I like the sun', cn: '我喜欢太阳',
    blank: { position: 2, answer: 'the',   choices: ['the', 'my', 'a', 'cat'] } },
  { id: 'isee',   title: 'I see …',   en: 'I see a cow',    cn: '我看见一头牛',
    blank: { position: 1, answer: 'see',    choices: ['see', 'am', 'have', 'like'] } },
  { id: 'thisis', title: 'This is …', en: 'This is my book', cn: '这是我的书',
    blank: { position: 0, answer: 'This',   choices: ['This', 'That', 'It', 'I'] } },
  { id: 'the',    title: 'The … is …', en: 'The cat is big', cn: '这只猫很大',
    blank: { position: 2, answer: 'is',     choices: ['is', 'am', 'are', 'has'] } },
  { id: 'we',     title: 'We …',      en: 'We go to school', cn: '我们去学校',
    blank: { position: 1, answer: 'go',     choices: ['go', 'see', 'can', 'like'] } },
  { id: 'there',  title: 'There is …', en: 'There is a book', cn: '这里有一本书',
    blank: { position: 0, answer: 'There',  choices: ['There', 'Here', 'Where', 'This'] } },
  { id: 'have',   title: 'I have …',  en: 'I have two cats', cn: '我有两只猫',
    blank: { position: 0, answer: 'I',      choices: ['I', 'You', 'He', 'We'] } },
];

/** 构造句型课：4 关
 *   1) 看中文整句，选英文句首词（最简单）
 *   2) 看英文句子挖空，选正确词补上（中→英填空）
 *   3) 排句（给打散的单词排成完整句子）
 *   4) 整句中英对照朗读
 */
function makeSentenceLesson(s: typeof SENT[number], i: number): Lesson {
  const enWords = s.en.split(' ');
  const cnWords = s.cn.split('');
  const c1 = pickChoices(s.en, SENT.map((x) => ({ en: x.en, cn: x.cn })));
  const c2 = pickChoices(s.blank.answer, s.blank.choices.map((en) => ({ en, cn: WORD_CN[en] ?? '' })));
  const steps: LessonStep[] = [
    { id: `sn-${s.id}-1`, ui: 'tap_choice',
      prompt: `中文：「${s.cn}」 — 对应的英文句是？`,
      answer: s.en,
      choices: c1.choices, choicesCn: c1.choicesCn,
      hint: `先在脑中把中文翻成英文` },
    { id: `sn-${s.id}-2`, ui: 'tap_choice',
      prompt: `填空：「${enWords.map((w, idx) => (idx === s.blank.position ? '____' : w)).join(' ')}」`,
      answer: s.blank.answer,
      choices: c2.choices, choicesCn: c2.choicesCn,
      hint: `中文是「${s.cn}」` },
    { id: `sn-${s.id}-3`, ui: 'order_words',
      prompt: `排成英文句：${enWords.slice().reverse().join(' / ')}`,
      answer: s.en },
    { id: `sn-${s.id}-4`, ui: 'read_along',
      prompt: `中英对照：${s.cn}  ·  ${s.en}`,
      answer: s.en },
  ];
  return { id: `eng-sn-${s.id}`, index: i + 1, title: `句型 · ${s.title}`, durationMin: 9, kind: 'sentence_build', steps };
}
const sentenceLessons: Lesson[] = SENT.map((s, i) => makeSentenceLesson(s, i));

// ============================================================
// 4. 阅读（reading）— 中英对照短文 + 中英对照理解题
// ============================================================
const READ: { passageEn: string; passageCn: string; q: string; qEn: string; a: string; options: string[]; optionsCn: string[] }[] = [
  { passageEn: 'I have a cat. The cat is big. I like my cat.',
    passageCn: '我有一只猫。这只猫很大。我喜欢我的猫。',
    q: '谁是大的？', qEn: 'Who is big?',
    a: 'the cat', options: ['the cat', 'the dog', 'the book'], optionsCn: ['这只猫', '这只狗', '这本书'] },
  { passageEn: 'The sun is red. The sky is blue. We play outside.',
    passageCn: '太阳是红的。天空是蓝的。我们在外面玩。',
    q: '天空是什幺颜色？', qEn: 'What colour is the sky?',
    a: 'blue', options: ['blue', 'red', 'green'], optionsCn: ['蓝色', '红色', '绿色'] },
  { passageEn: 'Tom can run. Tom can jump. Tom is happy.',
    passageCn: '汤姆会跑。汤姆会跳。汤姆很开心。',
    q: 'Tom 会做什幺？', qEn: 'What can Tom do?',
    a: 'run and jump', options: ['run and jump', 'sing and swim', 'read and write'], optionsCn: ['跑和跳', '唱和游', '读和写'] },
  { passageEn: 'I see a cow. The cow is on the grass.',
    passageCn: '我看见一头牛。牛在草地上。',
    q: '牛在哪里？', qEn: 'Where is the cow?',
    a: 'on the grass', options: ['on the grass', 'in the tree', 'under the bed'], optionsCn: ['在草地上', '在树上', '在床下'] },
  { passageEn: 'Mum has a book. I have a pen. We read.',
    passageCn: '妈妈有一本书。我有一支笔。我们一起读书。',
    q: '谁有书？', qEn: 'Who has a book?',
    a: 'Mum', options: ['Mum', 'I', 'the cat'], optionsCn: ['妈妈', '我', '这只猫'] },
  { passageEn: 'A dog and a cat. The dog is small. The cat is big.',
    passageCn: '一只狗和一只猫。狗很小。猫很大。',
    q: '谁比较小？', qEn: 'Who is smaller?',
    a: 'the dog', options: ['the dog', 'the cat', 'the boy'], optionsCn: ['这只狗', '这只猫', '这个男孩'] },
  { passageEn: 'The rain is cold. We stay at home.',
    passageCn: '雨很冷。我们待在家里。',
    q: '为什幺留在家？', qEn: 'Why stay at home?',
    a: 'the rain is cold', options: ['the rain is cold', 'the sun is hot', 'the dog is big'], optionsCn: ['雨很冷', '太阳很热', '狗很大'] },
  { passageEn: 'I like the red apple. The apple is sweet.',
    passageCn: '我喜欢红苹果。苹果很甜。',
    q: '苹果是什幺味道？', qEn: 'How is the apple?',
    a: 'sweet', options: ['sweet', 'cold', 'small'], optionsCn: ['甜', '冷', '小'] },
  { passageEn: 'Ben can swim. He swims in the lake.',
    passageCn: 'Ben 会游泳。他在湖里游。',
    q: 'Ben 在哪里游泳？', qEn: 'Where does Ben swim?',
    a: 'in the lake', options: ['in the lake', 'on the bed', 'at school'], optionsCn: ['在湖里', '在床上', '在学校'] },
  { passageEn: 'We go to school. We see the tree and the flower.',
    passageCn: '我们去学校。我们看见树和花。',
    q: '我们看到什幺？', qEn: 'What do we see?',
    a: 'a tree and a flower', options: ['a tree and a flower', 'a cat and a dog', 'a book and a pen'], optionsCn: ['一棵树和一朵花', '一只猫和一只狗', '一本书和一枝笔'] },
];

function makeReadingLesson(r: typeof READ[number], i: number): Lesson {
  const c2 = pickChoices(r.a, r.options.map((en, k) => ({ en, cn: r.optionsCn[k] })));
  const steps: LessonStep[] = [
    { id: `rd-${i + 1}-1`, ui: 'read_along',
      prompt: `中英对照：${r.passageCn}\n\n${r.passageEn}`,
      answer: r.passageEn },
    { id: `rd-${i + 1}-2`, ui: 'tap_choice',
      prompt: `${r.q}  (${r.qEn})`,
      answer: r.a,
      choices: c2.choices, choicesCn: c2.choicesCn,
      hint: '回到故事里找答案' },
  ];
  return { id: `eng-rd-${i + 1}`, index: i + 1, title: `阅读 · 第 ${i + 1} 篇`, durationMin: 10, kind: 'read_along', steps };
}
const readingLessons: Lesson[] = READ.map((r, i) => makeReadingLesson(r, i));

// ============================================================
// 合并与分类（彻底删除 phonics 路线）
// ============================================================
import { pictureBookIds } from './pictureBooks';

export const englishBank: Lesson[] = [
  ...vocabBasic,
  ...vocabExt,
  ...sentenceLessons,
  ...readingLessons,
];

export const englishBankByTopic: Record<string, string[]> = {
  vocabBasic: vocabBasic.map((l) => l.id),
  vocabExt:   vocabExt.map((l) => l.id),
  sentences:  sentenceLessons.map((l) => l.id),
  reading:    readingLessons.map((l) => l.id),
  picture_book: pictureBookIds,
};