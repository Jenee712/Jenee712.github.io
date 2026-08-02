import type {
  ReviewItem, KnowledgeCollection, PortfolioItem, WeeklyReward,
  ParentChildMission, BoardEvent, SubjectProgress, SkillProgress, LearningStreak,
} from '@/types';

// ---------------------------------------------------------- 复习小花园（间隔复习）
export const seedReviewItems: ReviewItem[] = [
  { itemId: 'rv-cat', kind: 'word',   payload: 'cat', prompt: '听一听，选出你听到的那个单词', hint: '喵喵叫的小动物，就是这个单词', answer: 'cat', choices: ['cat', 'dog', 'pig'], dueAt: '2026-08-01', intervalDays: 1, lastResult: 'retry', attempts: 2, source: 'eng-u2 step-1' },
  { itemId: 'rv-sit', kind: 'word', payload: 'sit', prompt: '拼出单词 sit', answer: ['s', 'i', 't'], dueAt: '2026-08-01', intervalDays: 1, lastResult: 'retry', attempts: 1, source: 'eng-u3 step-1' },
  { itemId: 'rv-32', kind: 'math', payload: '3+2', prompt: '数一数积木：3 块再加 2 块', answer: 5, choices: ['4', '5', '6'], dueAt: '2026-08-01', intervalDays: 1, lastResult: 'retry', attempts: 1, source: 'math-u2 step-3' },
  { itemId: 'rv-dog', kind: 'word', payload: 'dog', prompt: '图里是 dog 吗？', answer: 'yes', choices: ['yes', 'no'], dueAt: '2026-08-02', intervalDays: 2, lastResult: 'new', attempts: 0, source: 'eng-u2' },
];

// ---------------------------------------------------------- 成长图鉴 · 知识收藏
export const seedKnowledge: KnowledgeCollection = {
  letters: [
    { id: 'k-a', label: 'A a', type: 'letter', mastered: true,  unlockedAt: '2026-07-20', rewardDecor: 'plant' },
    { id: 'k-s', label: 'S s', type: 'letter', mastered: true,  unlockedAt: '2026-07-22', rewardDecor: 'plant' },
    { id: 'k-b', label: 'B b', type: 'letter', mastered: false, rewardDecor: 'plant' },
    { id: 'k-t', label: 'T t', type: 'letter', mastered: false, rewardDecor: 'plant' },
  ],
  words: [
    { id: 'k-cat',  label: 'cat',  type: 'word', mastered: true,  unlockedAt: '2026-07-24', rewardDecor: 'animal' },
    { id: 'k-dog',  label: 'dog',  type: 'word', mastered: true,  unlockedAt: '2026-07-25', rewardDecor: 'animal' },
    { id: 'k-sun',  label: 'sun',  type: 'word', mastered: true,  unlockedAt: '2026-07-28', rewardDecor: 'animal' },
    { id: 'k-sit',  label: 'sit',  type: 'word', mastered: false, rewardDecor: 'animal' },
  ],
  sentences: [
    { id: 'k-iam',   label: 'I am ...',     type: 'sentence', mastered: true,  unlockedAt: '2026-07-26', rewardDecor: 'building' },
    { id: 'k-ilike', label: 'I like ...',   type: 'sentence', mastered: true,  unlockedAt: '2026-07-29', rewardDecor: 'building' },
    { id: 'k-this',  label: 'This is ...',  type: 'sentence', mastered: false, rewardDecor: 'building' },
  ],
  math: [
    { id: 'k-count', label: '数 1–20',   type: 'math', mastered: true,  unlockedAt: '2026-07-21', rewardDecor: 'plant' },
    { id: 'k-add',   label: '10 以内加法', type: 'math', mastered: true,  unlockedAt: '2026-07-27', rewardDecor: 'plant' },
    { id: 'k-shape', label: '圆形/方形',   type: 'math', mastered: false, rewardDecor: 'building' },
  ],
  learning: [
    { id: 'l-b',  label: '字母 B b', type: 'letter', mastered: false },
    { id: 'l-sit', label: '单词 sit', type: 'word', mastered: false },
    { id: 'l-shape', label: '基本形状', type: 'math', mastered: false },
  ],
  upcoming: [
    { id: 'u-c',   label: '字母 C c', type: 'letter', mastered: false },
    { id: 'u-can',  label: '句型 Can I ...?', type: 'sentence', mastered: false },
    { id: 'u-clock', label: '整点时钟', type: 'math', mastered: false },
  ],
};

// ---------------------------------------------------------- 我的作品袋
export const seedPortfolio: PortfolioItem[] = [
  { id: 'p1', type: 'recording', subject: 'english', title: '绘本跟读 · I like the sun.', date: '2026-07-31', note: '发音很清楚，跟上节奏啦' },
  { id: 'p2', type: 'tracing_letter', subject: 'english', title: '字母描红 · S s', date: '2026-07-30', note: '线条很稳' },
  { id: 'p3', type: 'math_drawing', subject: 'math', title: '加法画图 · 3 + 2', date: '2026-07-29', note: '用 5 个圆圈表示' },
];

// ---------------------------------------------------------- 周奖励 / 亲子任务
export const seedWeeklyRewards: WeeklyReward[] = [
  { id: 'wr1', title: '森林探险家', condition: '本周学习满 5 天', stickerId: 'deer-shine', achieved: false },
  { id: 'wr2', title: '周末大步向前', condition: '完成本周亲子任务', stepReward: 6, achieved: false },
];

export const seedMission: ParentChildMission = {
  id: 'm1',
  week: '2026-W31',
  title: '找出家里 3 个圆形物品',
  detail: '和爸爸一起在客厅找一找：盘子、钟表、水果……用英语说出它们的名字。',
  confirmedByParent: false,
  rewardText: '贴纸 + 步数 + 家长设置的现实奖励',
};

// ---------------------------------------------------------- 棋盘事件（已领取记录，用于幂等去重）
export const seedBoardEvents: BoardEvent[] = [
  { id: 'be0', cellIndex: 0, type: 'start',   rewardType: 'none',  rewardValue: 0, claimed: true, completedAt: '2026-07-31' },
  { id: 'be1', cellIndex: 1, type: 'english', rewardType: 'step',  rewardValue: 1, claimed: true, completedAt: '2026-07-31' },
  { id: 'be2', cellIndex: 2, type: 'treasure', rewardType: 'coin', rewardValue: 5, claimed: true, txnId: 'txn-seed-2', completedAt: '2026-07-31' },
  { id: 'be3', cellIndex: 3, type: 'math',    rewardType: 'step',  rewardValue: 1, claimed: true, completedAt: '2026-07-31' },
  { id: 'be4', cellIndex: 4, type: 'sticker', rewardType: 'sticker', rewardValue: 0, stickerId: 'corgi-cheer', claimed: true, completedAt: '2026-07-31' },
  { id: 'be5', cellIndex: 5, type: 'story',   rewardType: 'step',  rewardValue: 1, claimed: true, completedAt: '2026-07-31' },
];

// ---------------------------------------------------------- 学科 / 技能进度（家长端）
export const seedSubjectProgress: SubjectProgress[] = [
  { subject: 'english', minutes: 246, accuracy: 0.86, masteredCount: 9, weeklyMinutes: 84 },
  { subject: 'math',    minutes: 108, accuracy: 0.79, masteredCount: 4, weeklyMinutes: 36 },
];

export const seedSkillProgress: SkillProgress[] = [
  { key: 'letter_sound', label: '字母认读',   mastery: 0.8,  attempts: 22, correct: 19 },
  { key: 'phonics',      label: 'Phonics',    mastery: 0.7,  attempts: 18, correct: 13 },
  { key: 'sight_words',  label: 'Sight words', mastery: 0.6,  attempts: 15, correct: 10 },
  { key: 'theme_words',  label: '主题词汇',   mastery: 0.65, attempts: 20, correct: 14 },
  { key: 'sentences',    label: '简单句型',   mastery: 0.55, attempts: 12, correct: 8 },
  { key: 'reading',      label: '绘本表达',   mastery: 0.5,  attempts: 10, correct: 6 },
  { key: 'counting',     label: '数字 1–20',  mastery: 0.85, attempts: 16, correct: 14 },
  { key: 'add_sub',      label: '10 以内加减', mastery: 0.75, attempts: 18, correct: 14 },
  { key: 'shapes',       label: '基本形状',   mastery: 0.5,  attempts: 10, correct: 6 },
  { key: 'compare',      label: '直观比较',   mastery: 0.6,  attempts: 9,  correct: 6 },
  { key: 'clock',        label: '整点时钟',   mastery: 0.4,  attempts: 8,  correct: 4 },
  { key: 'chart',        label: '分类图表',   mastery: 0.45, attempts: 7,  correct: 4 },
];

export const seedStreak: LearningStreak = {
  current: 6,
  longest: 12,
  lastActiveDate: '2026-07-31',
  weekDays: [true, true, false, true, true, true, false],
};
