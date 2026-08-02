// ============================================================================
// 小狗的森林学习站 · 领域类型（Backend-agnostic，可直接映射 REST / WebSocket 载荷）
// 命名与【二十、核心数据模型】对齐；贴纸严格遵循【十九、贴纸数据结构】。
// ============================================================================

import type { MonoCardDef } from '@/data/monopoly';

export type Subject = 'english' | 'math' | 'chinese' | 'rest' | 'review';

// ---- 英语六类技能路线 / 数学六类知识地图 ----
export type SkillTrack =
  | 'letter_sound' // 字母认读与书写
  | 'phonics'      // Phonics 入门
  | 'sight_words'  // Sight words
  | 'theme_words'  // 主题词汇
  | 'sentences'    // 简单句型
  | 'reading';     // 绘本与口语表达

export type MathTopic =
  | 'counting'   // 数字 1–20
  | 'add_sub'    // 10 以内加减法
  | 'shapes'     // 基本形状
  | 'compare'    // 长度重量容量比较
  | 'clock'      // 整点时钟
  | 'chart';     // 分类与简单图表

// ---------------------------------------------------------------- 课程内容
export interface Unit {
  id: string;
  subject: Subject;
  title: string;
  subtitle: string;
  storyTask: string;          // 故事任务线包装文案
  goals: string[];
  progress: number;           // 0..1
  current?: boolean;
  done?: boolean;
  lessons: number;
  trackKey?: SkillTrack | MathTopic;
}

export interface Lesson {
  id: string;
  index: number;
  title: string;
  durationMin: number;
  kind: LessonKind;
  steps: LessonStep[];
}

export type LessonKind =
  | 'phonics_blend' | 'sight_word' | 'theme_words' | 'sentence_build' | 'read_along'
  | 'count_objects' | 'add_sub' | 'shape_match' | 'shapes' | 'compare' | 'clock_set' | 'chart_sort'
  | 'letter_trace' | 'word_trace'
  | 'poem' | 'idiom' | 'character';

export interface LessonStep {
  id: string;
  prompt: string;
  hint?: string;              // 第一次错误提示（口型/首音/图片）
  answer: string | number | string[];
  choices?: string[];
  ui:
    | 'tap_choice' | 'blend' | 'order_words' | 'read_along'
    | 'drag_count' | 'number_pad' | 'shape_tap' | 'clock_set' | 'bucket_sort'
    | 'trace_letter' | 'trace_word';
  decoys?: string[];          // blend 拖拽拼词的干扰字母（默认 ['b','d','m']）
  bagCount?: number;          // drag_count 第一袋数量（默认 5）
  bagCount2?: number;
  bagOp?: 'add' | 'remove';         // drag_count 第二袋数量（提供则显示两组"合起来"）
}

// ---------------------------------------------------------------- 英語绘本
/** 绘本里的一个角色站位（用原創森林角色，不碰任何商业 IP）。 */
export interface BookSceneCharacter {
  name: AvatarKey;          // corgi / cat / rabbit / bear / deer / penguin / lop / bird
  x: number;                // 0..100 横向百分比
  y: number;                // 0..100 纵向百分比（角色底部对齐点）
  size: number;             // 像素
}
/** 一页插画的场景定义：背景 + 天空道具 + 角色。 */
export interface BookScene {
  bg: string;               // tailwind 渐变类，如 'from-sky-200 to-sun-100'
  sky?: 'day' | 'night' | 'rain' | 'snow';
  characters: BookSceneCharacter[];
  props?: ('sun' | 'moon' | 'cloud' | 'rain' | 'star' | 'tree' | 'flower' | 'snow' | 'lake')[];
}
export interface PictureBookPage {
  en: string;               // 英文句子（简单、可朗读）
  cn: string;               // 中文翻译
  scene: BookScene;
}
export interface PictureBook {
  id: string;               // 如 'pb-1'
  titleCn: string;          // 中文书名
  titleEn?: string;         // 英文书名（可选）
  level: string;            // 难度标签，如 '★ 起步'
  coverBg: string;          // 封面渐变
  coverChar: AvatarKey;     // 封面角色
  pages: PictureBookPage[];
  durationMin: number;
}

// ---------------------------------------------------------------- 计划 / 任务
export interface TodayTask {
  id: string;
  subject: Exclude<Subject, 'rest' | 'review'> | 'rest' | 'review';
  title: string;
  detail: string;
  durationMin: number;
  done: boolean;
  kind: 'normal' | 'rest' | 'review' | 'book';
  unitId?: string;
  lessonId?: string;
}

export interface DailyLearningPlan {
  id: string;
  date: string;               // YYYY-MM-DD
  goalMin: number;
  englishMin: number;
  mathMin: number;
  tasks: TodayTask[];
}

/** 薄弱点：孩子某次答错后记录，次日计划会置顶复习，做对后移除。 */
export interface WeakLesson {
  lessonId: string;
  subject: 'english' | 'math' | 'chinese';
  title: string;              // 用于计划标题的干净课名（去掉学科前缀）
  lastWrong: string;          // YYYY-MM-DD
}

// ---------------------------------------------------------------- 进度
export interface SubjectProgress {
  subject: 'english' | 'math';
  minutes: number;            // 累计分钟
  accuracy: number;           // 0..1
  masteredCount: number;
  weeklyMinutes: number;
}

export interface SkillProgress {
  key: string;                // SkillTrack | MathTopic
  label: string;
  mastery: number;            // 0..1
  attempts: number;
  correct: number;
}

export interface QuestionAttempt {
  id: string;
  taskId: string;
  lessonId: string;
  stepId: string;
  correct: boolean;
  usedHint: boolean;
  ts: string;
}

// ---------------------------------------------------------------- 复习小花园
export interface ReviewItem {
  itemId: string;
  kind: 'letter' | 'word' | 'sentence' | 'math';
  payload: string;            // 题目内容，如 "cat" / "3+2"
  prompt: string;             // 给孩子的引导语
  hint?: string;
  answer: string | number | string[];
  choices?: string[];
  dueAt: string;              // ISO
  intervalDays: number;       // 间隔复习天数
  lastResult: 'ok' | 'retry' | 'new';
  attempts: number;
  source: string;             // 来源：哪次任务的哪一步
}

// ---------------------------------------------------------------- 连续打卡
export interface LearningStreak {
  current: number;
  longest: number;
  lastActiveDate: string;     // YYYY-MM-DD
  weekDays: boolean[];        // 本周 7 天是否学习
}

// ---------------------------------------------------------------- 森林棋盘
export type BoardCellKind =
  | 'start' | 'normal' | 'english' | 'math' | 'treasure' | 'sticker'
  | 'rest' | 'review' | 'story' | 'works' | 'parent' | 'coin' | 'weekend';

export interface BoardCell {
  index: number;
  kind: BoardCellKind;
  label: string;
  emoji: string;              // 仅作占位/无障碍文本，正式贴纸用 SVG 角色
  status: 'done' | 'current' | 'locked' | 'available';
  stepReward: number;
  title?: string;             // 点击后事件标题
  desc?: string;              // 事件说明
  rewardText?: string;        // 奖励内容文案
}

/* ============================================================
 * 大富翁（森林棋盘 80% 重做）—— MonopolyCell
 * 矩形外圈 8×8 = 28 格。保留森林皮肤：GO=森林邮局、监狱=树洞休息、机会=森林奇遇、命运=森林考验、收租=付给森林动物金币。
 * 单人领地经营模式：玩家用「大富翁金币」买彩色产权地，拥有后经过自己地收租；动物领地属于小熊/小兔/小猫，路过付租。
 * ============================================================ */
export type MonoOwner = 'player' | 'bear' | 'rabbit' | 'cat' | null;
export type MonoCard = 'chance' | 'fortune'; // 森林奇遇 / 森林考验

export interface MonopolyCell {
  index: number;
  kind: 'go' | 'property' | 'animal' | 'chance' | 'fortune' | 'jail' | 'park' | 'fountain';
  label: string;
  emoji: string;
  colorGroup?: string;        // 产权颜色组 key（forest/sky/sun/soil/berry/moss）
  price?: number;            // 地价（大富翁金币）
  rent?: number;             // 基础租金
  owner?: MonoOwner;         // 地主（animal 固定为对应动物；property 可转为 player）
  npc?: 'bear' | 'rabbit' | 'cat'; // animal 领地归属的动物
  card?: MonoCard;           // chance/fortune 卡牌格
  desc?: string;             // 落格说明
}

export interface MonopolyState {
  pos: number;               // 当前格 index (0-27)
  monoCoins: number;         // 大富翁专用金币（与学习金币 kid.coins 独立）
  dice: number;              // 剩余骰子点数（每次打开棋盘补 20）
  owned: number[];           // 玩家拥有的产权地 index
  inTreeHole: number;        // 剩余停赛回合（>0 时不能掷骰）
  lastRoll: [number, number] | null; // 上一回合掷出的点数
  extraRoll: boolean;        // 本回合可再掷一次（奇遇卡）
  pendingCard: MonoCardDef | null;   // 当前抽到的待查看卡牌
  needsStudy: boolean;       // 20 个骰子已用完且尚未学习；true 时打开棋盘不会补发，需学习一轮再来兑换
  animating: boolean;        // 走棋动画进行中（逐步前进时锁定，避免重复掷骰）
  log: string[];             // 事件日志（最新在前）
}

/** 棋盘事件领取记录 —— 用于幂等去重，避免重复发放 */
export interface BoardEvent {
  id: string;
  cellIndex: number;
  type: BoardCellKind;
  rewardType: 'coin' | 'sticker' | 'step' | 'parent' | 'none';
  rewardValue: number;        // 金币数 / 步数
  stickerId?: string;
  claimed: boolean;
  txnId?: string;             // 关联 CoinTransaction
  completedAt?: string;
}

export interface BoardProgress {
  steps: number;              // 本周累计步数
  stepGoal: number;
  position: number;           // 当前格子 index
  completedDaysThisWeek: number;
  weekendRewardUnlocked: boolean;
}

// ---------------------------------------------------------------- 金币（幂等核心）
export type CoinSource =
  | 'lesson' | 'review' | 'board' | 'streak'
  | 'weekly_goal' | 'exchange' | 'parent_confirm' | 'adjust';

export interface CoinTransaction {
  transactionId: string;      // 服务端生成的全局唯一
  idempotencyKey: string;     // 业务幂等键（如 task:${id} / sticker:${id} / board:${cellIndex}）
  userId: string;
  source: CoinSource;
  amount: number;             // 可正可负（兑换时为负）
  balanceBefore: number;
  balanceAfter: number;
  relatedTaskId?: string;
  createdAt: string;
}

// ---------------------------------------------------------------- 动物表情包贴纸（严格按规格【十九】）
export type StickerUnlockType =
  | 'daily_task' | 'streak' | 'unit_complete' | 'review'
  | 'board' | 'weekly_goal' | 'coins';

export interface AnimalSticker {
  id: string;
  character: AvatarKey;       // 角色 key：corgi / cat / rabbit / bear / deer / penguin / lop / bird
  emotion: string;            // 情绪：cheer / smug / happy-cry / wow / shine / dizzy
  title: string;              // 中文名：太棒啦
  description: string;
  animatedSrc: string;        // /assets/stickers/corgi-cheer.gif
  staticSrc: string;          // /assets/stickers/corgi-cheer.png
  altText: string;
  unlockType: StickerUnlockType;
  unlockValue?: number;
  coinCost?: number;          // 仅 unlockType==='coins' 时有效
  owned: boolean;
  unlockedAt?: string;
  unlockReason?: string;
}

// ---------------------------------------------------------------- 成长图鉴
export interface KnowledgeItem {
  id: string;
  label: string;              // "A" / "cat" / "3+2" / "circle"
  type: 'letter' | 'word' | 'sentence' | 'math';
  mastered: boolean;
  unlockedAt?: string;
  /** 解锁时赠送的田园元素 */
  rewardDecor?: 'plant' | 'animal' | 'building';
}

export interface KnowledgeCollection {
  letters: KnowledgeItem[];
  words: KnowledgeItem[];
  sentences: KnowledgeItem[];
  math: KnowledgeItem[];
  learning: KnowledgeItem[];  // 正在学习
  upcoming: KnowledgeItem[];  // 即将解锁
}

export type PortfolioType =
  | 'recording' | 'tracing_letter' | 'tracing_word' | 'math_drawing' | 'drawing';

export interface PortfolioItem {
  id: string;
  type: PortfolioType;
  subject: 'english' | 'math';
  title: string;
  date: string;               // YYYY-MM-DD
  thumbnail?: string;         // dataURL 或资源路径
  url?: string;               // 录音/作品资源
  note?: string;
}

// ---------------------------------------------------------------- 亲子 / 周奖励
export interface ParentChildMission {
  id: string;
  week: string;               // 如 "2026-W31"
  title: string;
  detail: string;
  confirmedByParent: boolean;
  completedAt?: string;
  rewardText?: string;        // 完成后的贴纸/步数/家长现实奖励
}

export interface WeeklyReward {
  id: string;
  title: string;
  condition: string;
  stickerId?: string;
  stepReward?: number;
  parentRewardId?: string;
  achieved: boolean;
}

// ---------------------------------------------------------------- 档案 / 账号
export type AvatarKey = 'deer' | 'bear' | 'rabbit' | 'bird' | 'corgi' | 'cat' | 'lop' | 'penguin';

export interface ChildProfile {
  id: string;
  name: string;
  nickname: string;
  avatarKey: AvatarKey;
  level: number;
  xp: number;
  streakDays: number;
  coins: number;
  totalMinutes: number;
  totalDays: number;
  todayMinutes: number;
  todayGoalMin: number;
  todayLessonsDone: number;
  todayLessonsGoal: number;
  weeklySteps: number;
  weeklyStepGoal: number;
  englishMinutes: number;
  mathMinutes: number;
}

export interface ParentProfile {
  id: string;
  name: string;
}

export interface User {
  id: string;
  child: ChildProfile;
  parent: ParentProfile;
}

// ---------------------------------------------------------------- 家长设置
export type Difficulty = 'easy' | 'normal' | 'challenge';
export type AnimationPref = 'auto' | 'always' | 'reduced';

export interface RealityReward {
  id: string;
  title: string;
  costCoins: number;          // 仅作展示进度，不可金币兑换（家长确认）
  needsParentConfirm: boolean;
  redeemed?: boolean;
  shownToChild: boolean;
}

export interface DeviceSession {
  id: string;
  name: string;
  type: 'ipad' | 'phone' | 'web';
  lastActive: string;         // ISO
  lastSyncAt: string;         // ISO
  online: boolean;
}

export interface ParentSettings {
  pin: string;                // 默认 1234
  dailyMinutesGoal: number;   // 默认 35，家长 30–40
  englishRatio: number;       // 0.7
  mathRatio: number;          // 0.3
  difficulty: Difficulty;
  reminderTime: string;       // HH:mm
  restReminderMin: number;    // 默认 15
  screenTimeLimitMin: number;
  freePracticeLimitMin: number;
  freePracticeEnabled: boolean;
  animationPref: AnimationPref;
  realityRewards: RealityReward[];
  devices: DeviceSession[];
}

// ---------------------------------------------------------------- 同步
export type SyncEventType =
  | 'task.completed' | 'coin.changed' | 'step.advanced'
  | 'sticker.earned' | 'parent.settings.changed'
  | 'review.updated' | 'portfolio.added' | 'board.event.claimed'
  | 'weekly.reward' | 'sync.request' | 'sync.response';

export interface SyncEvent {
  type: SyncEventType;
  payload: Record<string, unknown>;
  senderId?: string;
  ts?: string;
}

export interface SyncMeta {
  online: boolean;
  lastSyncAt?: string;
  pendingCount: number;
}

// ---------------------------------------------------------------- 陀螺對戰
export interface BattleRecord {
  id: string;
  date: string;               // YYYY-MM-DD HH:mm
  playerTop: string;          // 玩家陀螺名
  playerChar: AvatarKey;      // 玩家角色
  enemyName: string;          // 對手名
  enemyChar: AvatarKey;       // 對手角色
  result: 'win' | 'lose';
  coins: number;              // 獲得金幣
  rounds: number;             // 對戰回合數
  skillUsed: boolean;         // 是否使用了技能
}

// ---------------------------------------------------------------- 关卡结算
export interface LessonResultSummary {
  taskId: string;
  correct: number;
  total: number;
  minutes: number;
  coins?: number;             // 本次获得金币
  steps?: number;             // 本次前进步数（森林棋盘）
  stickerId?: string;         // 本次结算展示的唯一主贴纸
  newKnowledge?: string;      // 新掌握的知识点文案
  mode: 'normal' | 'streak' | 'unit' | 'review';
}
