/**
 * 英語二年級 60 天題庫（程序化生成）。
 *
 * 設計原則（按家長/老師反饋，已徹底廢除自然拼讀路線）：
 *   - 不教 phonics / 不出現英標相關題
 *   - 每個詞都考英↔中翻譯，避免「找一樣的字」就能答對
 *   - 難度循序漸進：識詞 → 看中文選英文 → 看英文選中文 → 拼寫 → 讀句 → 閱讀理解
 *
 * 路線圖（取代舊的 phonics→sight→theme→sentence→reading）：
 *   vocab_basic(主題詞·生活) → vocab_ext(主題詞·世界) → sentences(句型·中翻英)
 *   → reading(閱讀理解)
 *
 * 全部為原創題面與教學結構。
 */
import type { Lesson, LessonStep } from '@/types';

// 簡單可重現洗牌（固定種子，避免每次載入順序漂移）
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
/** 從 pool 中挑 4 個選項（含正解），正解不排第一 */
function choicesFor(answer: string, pool: string[]): string[] {
  if (pool.length <= 4) return shuffle([...pool], answer.length * 7 + 3);
  const others = shuffle(pool.filter((w) => w !== answer), answer.length * 7 + 3).slice(0, 3);
  const out = shuffle([answer, ...others], answer.length * 13 + 5);
  if (out[0] === answer) [out[0], out[1]] = [out[1], out[0]];
  return out;
}
const letters = (w: string) => w.split('');

// ============================================================
// 1. 主題詞（vocab_basic）— 生活場景，英↔中翻譯
// ============================================================
type Pair = { en: string; cn: string };
const THEMES_BASIC: { id: string; title: string; pairs: Pair[]; sentence: { en: string; cn: string } }[] = [
  { id: 'animals',  title: '森林動物', pairs: [
      { en: 'cat', cn: '貓' }, { en: 'dog', cn: '狗' }, { en: 'pig', cn: '豬' },
      { en: 'fox', cn: '狐狸' }, { en: 'cow', cn: '牛' }, { en: 'duck', cn: '鴨' },
    ], sentence: { en: 'I see a cat and a dog.', cn: '我看見一隻貓和一隻狗。' } },
  { id: 'colors',   title: '顏色', pairs: [
      { en: 'red', cn: '紅色' }, { en: 'blue', cn: '藍色' }, { en: 'green', cn: '綠色' },
      { en: 'yellow', cn: '黃色' }, { en: 'black', cn: '黑色' }, { en: 'white', cn: '白色' },
    ], sentence: { en: 'The sun is yellow.', cn: '太陽是黃色的。' } },
  { id: 'numbers',  title: '數字 1–10', pairs: [
      { en: 'one', cn: '一' }, { en: 'two', cn: '二' }, { en: 'three', cn: '三' },
      { en: 'four', cn: '四' }, { en: 'five', cn: '五' }, { en: 'ten', cn: '十' },
    ], sentence: { en: 'I have two apples.', cn: '我有兩個蘋果。' } },
  { id: 'body',     title: '身體', pairs: [
      { en: 'hand', cn: '手' }, { en: 'foot', cn: '腳' }, { en: 'eye', cn: '眼睛' },
      { en: 'ear', cn: '耳朵' }, { en: 'nose', cn: '鼻子' }, { en: 'mouth', cn: '嘴巴' },
    ], sentence: { en: 'I have two hands.', cn: '我有兩隻手。' } },
  { id: 'food',     title: '食物', pairs: [
      { en: 'apple', cn: '蘋果' }, { en: 'egg', cn: '雞蛋' }, { en: 'milk', cn: '牛奶' },
      { en: 'rice', cn: '米飯' }, { en: 'cake', cn: '蛋糕' }, { en: 'meat', cn: '肉' },
    ], sentence: { en: 'I eat an apple.', cn: '我吃一個蘋果。' } },
  { id: 'school',   title: '學校用品', pairs: [
      { en: 'book', cn: '書' }, { en: 'bag', cn: '書包' }, { en: 'pen', cn: '筆' },
      { en: 'desk', cn: '書桌' }, { en: 'ruler', cn: '尺子' }, { en: 'pencil', cn: '鉛筆' },
    ], sentence: { en: 'I have a book.', cn: '我有一本書。' } },
  { id: 'family',   title: '家人', pairs: [
      { en: 'mum', cn: '媽媽' }, { en: 'dad', cn: '爸爸' }, { en: 'brother', cn: '兄弟' },
      { en: 'sister', cn: '姐妹' }, { en: 'baby', cn: '寶寶' }, { en: 'grandma', cn: '奶奶' },
    ], sentence: { en: 'I like my mum.', cn: '我喜歡媽媽。' } },
];

// ============================================================
// 2. 主題詞（vocab_ext）— 世界場景，英↔中翻譯
// ============================================================
const THEMES_EXT: { id: string; title: string; pairs: Pair[]; sentence: { en: string; cn: string } }[] = [
  { id: 'clothes',  title: '衣物', pairs: [
      { en: 'hat', cn: '帽子' }, { en: 'shirt', cn: '襯衫' }, { en: 'sock', cn: '襪子' },
      { en: 'shoe', cn: '鞋子' }, { en: 'coat', cn: '外套' }, { en: 'dress', cn: '裙子' },
    ], sentence: { en: 'Put on your hat.', cn: '戴上你的帽子。' } },
  { id: 'actions',  title: '動作', pairs: [
      { en: 'run', cn: '跑' }, { en: 'jump', cn: '跳' }, { en: 'sing', cn: '唱' },
      { en: 'swim', cn: '游泳' }, { en: 'read', cn: '讀' }, { en: 'write', cn: '寫' },
    ], sentence: { en: 'I can run and jump.', cn: '我會跑也會跳。' } },
  { id: 'weather',  title: '天氣', pairs: [
      { en: 'sun', cn: '太陽' }, { en: 'rain', cn: '雨' }, { en: 'snow', cn: '雪' },
      { en: 'wind', cn: '風' }, { en: 'cloud', cn: '雲' }, { en: 'storm', cn: '暴風雨' },
    ], sentence: { en: 'The sun is hot.', cn: '太陽很熱。' } },
  { id: 'nature',   title: '大自然', pairs: [
      { en: 'tree', cn: '樹' }, { en: 'flower', cn: '花' }, { en: 'leaf', cn: '葉子' },
      { en: 'grass', cn: '草' }, { en: 'star', cn: '星星' }, { en: 'moon', cn: '月亮' },
    ], sentence: { en: 'I see a red flower.', cn: '我看見一朵紅花。' } },
  { id: 'transport', title: '交通工具', pairs: [
      { en: 'car', cn: '汽車' }, { en: 'bus', cn: '公交車' }, { en: 'boat', cn: '船' },
      { en: 'bike', cn: '自行車' }, { en: 'train', cn: '火車' }, { en: 'plane', cn: '飛機' },
    ], sentence: { en: 'I go by bus.', cn: '我坐公交車去。' } },
  { id: 'home',     title: '家裡', pairs: [
      { en: 'bed', cn: '床' }, { en: 'door', cn: '門' }, { en: 'chair', cn: '椅子' },
      { en: 'table', cn: '桌子' }, { en: 'lamp', cn: '燈' }, { en: 'room', cn: '房間' },
    ], sentence: { en: 'The cat is on the chair.', cn: '貓在椅子上。' } },
  { id: 'opp',      title: '反義詞', pairs: [
      { en: 'big', cn: '大' }, { en: 'small', cn: '小' }, { en: 'hot', cn: '熱' },
      { en: 'cold', cn: '冷' }, { en: 'fast', cn: '快' }, { en: 'slow', cn: '慢' },
    ], sentence: { en: 'The cat is big.', cn: '貓很大。' } },
];

/**
 * 構造一個主題詞課：每課 4 關，難度遞進。
 *   1) 看英文選中文（英→中）
 *   2) 看中文選英文（中→英，更難）
 *   3) 看中文拼寫出英文（拼寫，最難）
 *   4) 中英對照朗讀
 */
function makeVocabLesson(prefix: string, i: number, t: { id: string; title: string; pairs: Pair[]; sentence: { en: string; cn: string } }): Lesson {
  const p0 = t.pairs[0];
  const p1 = t.pairs[1];
  const cnPool = t.pairs.map((x) => x.cn);
  const enPool = t.pairs.map((x) => x.en);
  const steps: LessonStep[] = [
    { id: `${prefix}-${t.id}-1`, ui: 'tap_choice',
      prompt: `"${p0.en}" 的中文是什麼？`,
      answer: p0.cn,
      choices: choicesFor(p0.cn, cnPool),
      hint: `聽一聽 ${p0.en}，再想對應的中文` },
    { id: `${prefix}-${t.id}-2`, ui: 'tap_choice',
      prompt: `"${p1.cn}" 的英文是哪個？`,
      answer: p1.en,
      choices: choicesFor(p1.en, enPool),
      hint: `看到中文，先想它的英文` },
    { id: `${prefix}-${t.id}-3`, ui: 'blend',
      prompt: `拼寫出 "${t.pairs[2].cn}" 的英文`,
      answer: letters(t.pairs[2].en),
      decoys: ['b', 'p', 'q'] },
    { id: `${prefix}-${t.id}-4`, ui: 'read_along',
      prompt: `中英對照：${t.sentence.cn}  ·  ${t.sentence.en}`,
      answer: t.sentence.en },
  ];
  return { id: `eng-${prefix}-${t.id}`, index: i + 1, title: `主題詞 · ${t.title}`, durationMin: 8, kind: 'theme_words', steps };
}

const vocabBasic: Lesson[] = THEMES_BASIC.map((t, i) => makeVocabLesson('vb1', i, t));
const vocabExt:   Lesson[] = THEMES_EXT.map((t, i) => makeVocabLesson('vb2', i, t));

// ============================================================
// 3. 句型（sentences）— 中翻英 + 英翻中 + 排句
// ============================================================
const SENT: { id: string; title: string; en: string; cn: string; blank: { position: number; answer: string; choices: string[] } }[] = [
  { id: 'ican',   title: 'I can …',   en: 'I can run',     cn: '我會跑',
    blank: { position: 2, answer: 'run',    choices: ['run', 'swim', 'sing', 'jump'] } },
  { id: 'ilike',  title: 'I like …',  en: 'I like the sun', cn: '我喜歡太陽',
    blank: { position: 2, answer: 'the',   choices: ['the', 'my', 'a', 'cat'] } },
  { id: 'isee',   title: 'I see …',   en: 'I see a cow',    cn: '我看見一頭牛',
    blank: { position: 1, answer: 'see',    choices: ['see', 'am', 'have', 'like'] } },
  { id: 'thisis', title: 'This is …', en: 'This is my book', cn: '這是我的書',
    blank: { position: 0, answer: 'This',   choices: ['This', 'That', 'It', 'I'] } },
  { id: 'the',    title: 'The … is …', en: 'The cat is big', cn: '這隻貓很大',
    blank: { position: 2, answer: 'is',     choices: ['is', 'am', 'are', 'has'] } },
  { id: 'we',     title: 'We …',      en: 'We go to school', cn: '我們去學校',
    blank: { position: 1, answer: 'go',     choices: ['go', 'see', 'can', 'like'] } },
  { id: 'there',  title: 'There is …', en: 'There is a book', cn: '這裡有一本書',
    blank: { position: 0, answer: 'There',  choices: ['There', 'Here', 'Where', 'This'] } },
  { id: 'have',   title: 'I have …',  en: 'I have two cats', cn: '我有兩隻貓',
    blank: { position: 0, answer: 'I',      choices: ['I', 'You', 'He', 'We'] } },
];

/** 構造句型課：4 關
 *   1) 看中文整句，選英文句首詞（最簡單）
 *   2) 看英文句子挖空，選正確詞補上（中→英填空）
 *   3) 排句（給打散的單詞排成完整句子）
 *   4) 整句中英對照朗讀
 */
function makeSentenceLesson(s: typeof SENT[number], i: number): Lesson {
  const enWords = s.en.split(' ');
  const cnWords = s.cn.split('');
  const steps: LessonStep[] = [
    { id: `sn-${s.id}-1`, ui: 'tap_choice',
      prompt: `中文：「${s.cn}」 — 對應的英文句是？`,
      answer: s.en,
      choices: choicesFor(s.en, SENT.flatMap((x) => [x.en]).filter((x) => x !== s.en)),
      hint: `先在腦中把中文翻成英文` },
    { id: `sn-${s.id}-2`, ui: 'tap_choice',
      prompt: `填空：「${enWords.map((w, idx) => (idx === s.blank.position ? '____' : w)).join(' ')}」`,
      answer: s.blank.answer,
      choices: s.blank.choices,
      hint: `中文是「${s.cn}」` },
    { id: `sn-${s.id}-3`, ui: 'order_words',
      prompt: `排成英文句：${enWords.slice().reverse().join(' / ')}`,
      answer: s.en },
    { id: `sn-${s.id}-4`, ui: 'read_along',
      prompt: `中英對照：${s.cn}  ·  ${s.en}`,
      answer: s.en },
  ];
  return { id: `eng-sn-${s.id}`, index: i + 1, title: `句型 · ${s.title}`, durationMin: 9, kind: 'sentence_build', steps };
}
const sentenceLessons: Lesson[] = SENT.map((s, i) => makeSentenceLesson(s, i));

// ============================================================
// 4. 閱讀（reading）— 中英對照短文 + 中英對照理解題
// ============================================================
const READ: { passageEn: string; passageCn: string; q: string; qEn: string; a: string; options: string[] }[] = [
  { passageEn: 'I have a cat. The cat is big. I like my cat.',
    passageCn: '我有一隻貓。這隻貓很大。我喜歡我的貓。',
    q: '誰是大的？', qEn: 'Who is big?',
    a: 'the cat', options: ['the cat', 'the dog', 'the book'] },
  { passageEn: 'The sun is red. The sky is blue. We play outside.',
    passageCn: '太陽是紅的。天空是藍的。我們在外面玩。',
    q: '天空是什麼顏色？', qEn: 'What colour is the sky?',
    a: 'blue', options: ['blue', 'red', 'green'] },
  { passageEn: 'Tom can run. Tom can jump. Tom is happy.',
    passageCn: '湯姆會跑。湯姆會跳。湯姆很開心。',
    q: 'Tom 會做什麼？', qEn: 'What can Tom do?',
    a: 'run and jump', options: ['run and jump', 'sing and swim', 'read and write'] },
  { passageEn: 'I see a cow. The cow is on the grass.',
    passageCn: '我看見一頭牛。牛在草地上。',
    q: '牛在哪裡？', qEn: 'Where is the cow?',
    a: 'on the grass', options: ['on the grass', 'in the tree', 'under the bed'] },
  { passageEn: 'Mum has a book. I have a pen. We read.',
    passageCn: '媽媽有一本書。我有一支筆。我們一起讀書。',
    q: '誰有書？', qEn: 'Who has a book?',
    a: 'Mum', options: ['Mum', 'I', 'the cat'] },
  { passageEn: 'A dog and a cat. The dog is small. The cat is big.',
    passageCn: '一隻狗和一隻貓。狗很小。貓很大。',
    q: '誰比較小？', qEn: 'Who is smaller?',
    a: 'the dog', options: ['the dog', 'the cat', 'the boy'] },
  { passageEn: 'The rain is cold. We stay at home.',
    passageCn: '雨很冷。我們待在家裡。',
    q: '為什麼留在家？', qEn: 'Why stay at home?',
    a: 'the rain is cold', options: ['the rain is cold', 'the sun is hot', 'the dog is big'] },
  { passageEn: 'I like the red apple. The apple is sweet.',
    passageCn: '我喜歡紅蘋果。蘋果很甜。',
    q: '蘋果是什麼味道？', qEn: 'How is the apple?',
    a: 'sweet', options: ['sweet', 'cold', 'small'] },
  { passageEn: 'Ben can swim. He swims in the lake.',
    passageCn: 'Ben 會游泳。他在湖裡游。',
    q: 'Ben 在哪裡游泳？', qEn: 'Where does Ben swim?',
    a: 'in the lake', options: ['in the lake', 'on the bed', 'at school'] },
  { passageEn: 'We go to school. We see the tree and the flower.',
    passageCn: '我們去學校。我們看見樹和花。',
    q: '我們看到什麼？', qEn: 'What do we see?',
    a: 'a tree and a flower', options: ['a tree and a flower', 'a cat and a dog', 'a book and a pen'] },
];

function makeReadingLesson(r: typeof READ[number], i: number): Lesson {
  const steps: LessonStep[] = [
    { id: `rd-${i + 1}-1`, ui: 'read_along',
      prompt: `中英對照：${r.passageCn}\n\n${r.passageEn}`,
      answer: r.passageEn },
    { id: `rd-${i + 1}-2`, ui: 'tap_choice',
      prompt: `${r.q}  (${r.qEn})`,
      answer: r.a,
      choices: choicesFor(r.a, r.options),
      hint: '回到故事裡找答案' },
  ];
  return { id: `eng-rd-${i + 1}`, index: i + 1, title: `閱讀 · 第 ${i + 1} 篇`, durationMin: 10, kind: 'read_along', steps };
}
const readingLessons: Lesson[] = READ.map((r, i) => makeReadingLesson(r, i));

// ============================================================
// 合併與分類（徹底刪除 phonics 路線）
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