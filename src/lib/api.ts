/**
 * Backend API stub —— 模拟服务端（含幂等校验）。
 * 真实集成时把每个方法体替换为 fetch('/api/...') 即可，业务代码（store / 组件）不动。
 * 幂等键（idempotencyKey）由调用方生成，服务端保证「同一键只生效一次」：
 *   - 领取金币 / 兑换贴纸 / 领取棋盘奖励 / 完成周目标 / 家长确认奖励
 */

import type {
  ChildProfile, ParentSettings, TodayTask, Unit, Lesson, BoardCell, BoardEvent,
  AnimalSticker, ReviewItem, KnowledgeCollection, PortfolioItem, WeeklyReward, WeakLesson,
  ParentChildMission, SubjectProgress, SkillProgress, LearningStreak, CoinTransaction, CoinSource,
} from '@/types';

import { initialKid, initialParent, todayTasks as seedTasks, initialBoardCells } from '@/data/user';
import { boardCells, initialStickers } from '@/data/board';
import {
  seedReviewItems, seedKnowledge, seedPortfolio, seedWeeklyRewards, seedMission,
  seedBoardEvents, seedSubjectProgress, seedSkillProgress, seedStreak,
} from '@/data/learning';
import { englishUnits, mathUnits, phonicsLessons, mathAddSubLessons, englishThemeWordLessons, englishSentenceLessons, englishSightWordLessons, mathShapeLessons, mathCompareLessons, mathClockLessons, mathChartLessons, generateDailyPlan } from '@/data/curriculum';
import { getDayPlan, dayOfSummer, PLAN_TOTAL_DAYS } from '@/data/plan60';
import { englishBank, englishBankByTopic } from '@/data/englishBank';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const uid = (p = 'id') => `${p}-${Math.random().toString(36).slice(2, 10)}`;

// ---- 薄弱点持久化（localStorage，刷新后仍保留，跨天持续复习）----
const WEAK_KEY = 'ff_weak_lessons_v1';
function loadWeak(): WeakLesson[] {
  if (typeof window === 'undefined') return [];
  try { const r = window.localStorage.getItem(WEAK_KEY); return r ? (JSON.parse(r) as WeakLesson[]) : []; } catch { return []; }
}
function saveWeak(w: WeakLesson[]) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(WEAK_KEY, JSON.stringify(w)); } catch { /* ignore */ }
}
const DAYS_KEY = 'ff_completed_days_v1';
function loadDays(): number[] {
  if (typeof window === 'undefined') return [];
  try { const r = window.localStorage.getItem(DAYS_KEY); return r ? (JSON.parse(r) as number[]) : []; } catch { return []; }
}
function saveDays(d: number[]) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(DAYS_KEY, JSON.stringify(d)); } catch { /* ignore */ }
}

export interface CompleteTaskResult {
  task: TodayTask;
  txn?: CoinTransaction;
  stickerId?: string;
}
export interface ClaimBoardResult {
  event: BoardEvent;
  txn?: CoinTransaction;
  stickerId?: string;
}
export interface ExchangeResult {
  stickers: AnimalSticker[];
  txn: CoinTransaction;
  balance: number;
}

export interface ApiClient {
  getKid(): Promise<ChildProfile>;
  patchKid(p: Partial<ChildProfile>): Promise<ChildProfile>;
  getTodayTasks(): Promise<TodayTask[]>;
  getWeakLessons(): WeakLesson[];
  addWeakLesson(l: WeakLesson): Promise<void>;
  resolveWeakLesson(lessonId: string): Promise<void>;
  getDayPlan(day: number): Promise<TodayTask[]>;
  getCompletedDays(): number[];
  markDayDone(day: number): Promise<void>;
  unmarkDayDone(day: number): Promise<void>;
  totalPlanDays: number;
  completeTask(id: string, payload: { correct: number; total: number; minutes: number }, idempotencyKey: string): Promise<CompleteTaskResult>;

  getUnits(subject: 'english' | 'math'): Promise<Unit[]>;
  getLessons(unitId: string): Promise<Lesson[]>;

  getBoard(): Promise<BoardCell[]>;
  getBoardEvents(): Promise<BoardEvent[]>;
  claimBoardEvent(cellIndex: number, idempotencyKey: string): Promise<ClaimBoardResult>;

  getStickers(): Promise<AnimalSticker[]>;
  earnSticker(s: AnimalSticker, idempotencyKey: string): Promise<AnimalSticker[]>;
  exchangeSticker(stickerId: string, idempotencyKey: string): Promise<ExchangeResult>;

  getReviewItems(): Promise<ReviewItem[]>;
  saveReviewResult(itemId: string, result: 'ok' | 'retry'): Promise<ReviewItem[]>;

  getKnowledge(): Promise<KnowledgeCollection>;
  getPortfolio(): Promise<PortfolioItem[]>;
  savePortfolio(item: PortfolioItem): Promise<PortfolioItem[]>;

  getWeeklyRewards(): Promise<WeeklyReward[]>;
  completeWeeklyGoal(id: string, idempotencyKey: string): Promise<{ rewards: WeeklyReward[]; stickerId?: string }>;

  getMission(): Promise<ParentChildMission>;
  confirmMission(id: string): Promise<ParentChildMission>;

  getSubjectProgress(): Promise<SubjectProgress[]>;
  getSkillProgress(): Promise<SkillProgress[]>;
  getStreak(): Promise<LearningStreak>;

  verifyPin(pin: string): Promise<boolean>;
  getParentSettings(): Promise<ParentSettings>;
  patchParentSettings(p: Partial<ParentSettings>): Promise<ParentSettings>;
}

class MockApi implements ApiClient {
  private kid: ChildProfile = { ...initialKid };
  private parent: ParentSettings = { ...initialParent };
  private tasks: TodayTask[] = seedTasks.map((t) => ({ ...t }));
  private board: BoardCell[] = initialBoardCells.map((c) => ({ ...c }));
  private boardEvents: BoardEvent[] = seedBoardEvents.map((e) => ({ ...e }));
  private stickers: AnimalSticker[] = [...initialStickers];
  private reviewItems: ReviewItem[] = seedReviewItems.map((r) => ({ ...r }));
  private knowledge: KnowledgeCollection = JSON.parse(JSON.stringify(seedKnowledge));
  private portfolio: PortfolioItem[] = seedPortfolio.map((p) => ({ ...p }));
  private weekly: WeeklyReward[] = seedWeeklyRewards.map((w) => ({ ...w }));
  private mission: ParentChildMission = { ...seedMission };
  private weakLessons: WeakLesson[] = loadWeak();
  private completedDays: number[] = loadDays();
  totalPlanDays = PLAN_TOTAL_DAYS;

  // ---- 幂等键登记：保证同一键只生效一次 ----
  private coinKeys = new Map<string, CoinTransaction>();
  private stickerKeys = new Set<string>();
  private boardKeys = new Map<string, BoardEvent>();
  private weeklyKeys = new Set<string>();

  private submitCoin(source: CoinSource, amount: number, idempotencyKey: string, relatedTaskId?: string): CoinTransaction {
    const existing = this.coinKeys.get(idempotencyKey);
    if (existing) return existing; // 重复提交 → 返回原交易，不重复加减
    const txn: CoinTransaction = {
      transactionId: uid('txn'),
      idempotencyKey,
      userId: this.kid.id,
      source,
      amount,
      balanceBefore: this.kid.coins,
      balanceAfter: this.kid.coins + amount,
      relatedTaskId,
      createdAt: new Date().toISOString(),
    };
    this.kid = { ...this.kid, coins: txn.balanceAfter };
    this.coinKeys.set(idempotencyKey, txn);
    return txn;
  }

  async getKid() { await sleep(60); return { ...this.kid }; }
  async patchKid(p: Partial<ChildProfile>) { await sleep(60); this.kid = { ...this.kid, ...p }; return { ...this.kid }; }
  async getTodayTasks() {
    await sleep(20);
    return getDayPlan(dayOfSummer(), this.weakLessons).map((t) => ({ ...t }));
  }
  async getDayPlan(day: number) {
    await sleep(10);
    return getDayPlan(day, this.weakLessons).map((t) => ({ ...t }));
  }
  getCompletedDays(): number[] { return [...this.completedDays].sort((a,b)=>a-b); }
  async markDayDone(day: number) {
    if (!this.completedDays.includes(day)) {
      this.completedDays = [...this.completedDays, day];
      saveDays(this.completedDays);
    }
  }
  async unmarkDayDone(day: number) {
    this.completedDays = this.completedDays.filter((d) => d !== day);
    saveDays(this.completedDays);
  }
  getWeakLessons() { return this.weakLessons.map((w) => ({ ...w })); }
  async addWeakLesson(l: WeakLesson) {
    this.weakLessons = this.weakLessons.filter((x) => x.lessonId !== l.lessonId);
    this.weakLessons.unshift({ ...l, lastWrong: new Date().toISOString().slice(0, 10) });
    saveWeak(this.weakLessons);
  }
  async resolveWeakLesson(lessonId: string) {
    this.weakLessons = this.weakLessons.filter((x) => x.lessonId !== lessonId);
    saveWeak(this.weakLessons);
  }

  async completeTask(id: string, payload: { correct: number; total: number; minutes: number }, idempotencyKey: string) {
    await sleep(110);
    // 不校验任务 id 是否存在：studyDay 切换后 store 生成的 task id（d{N}-*）与这里的 seedTasks（t1-t8）不同，
    // 一旦校验就会抛错导致 LessonPlayer 的 onComplete 链中断、页面无法跳到结算页。
    // store 才是任务状态的权威来源；这里只负责：金币 + 贴纸（幂等）。
    const coins = Math.max(1, Math.round((payload.correct / Math.max(1, payload.total)) * 5));
    const txn = this.submitCoin('lesson', coins, idempotencyKey, id);
    this.kid = { ...this.kid, todayMinutes: this.kid.todayMinutes + payload.minutes, todayLessonsDone: this.kid.todayLessonsDone + 1 };
    const placeholder: TodayTask = {
      id, subject: 'english', title: '', detail: '', durationMin: payload.minutes, done: true, kind: 'normal',
    };
    return { task: placeholder, txn };
  }

  async getUnits(subject: 'english' | 'math') { await sleep(40); return (subject === 'english' ? englishUnits : mathUnits).map((u) => ({ ...u })); }
  async getLessons(unitId: string) {
    await sleep(40);
    const ENG_BANK_MAP = new Map(englishBank.map((l) => [l.id, l]));
    const topicLessons = (k: keyof typeof englishBankByTopic) =>
      englishBankByTopic[k].map((id) => ENG_BANK_MAP.get(id)!).filter(Boolean);
    const map: Record<string, Lesson[]> = {
      'eng-u3': topicLessons('vocabBasic'),
      'eng-u4': topicLessons('vocabExt'),
      'eng-u5': [...englishSentenceLessons, ...topicLessons('sentences')],
      'eng-u6': topicLessons('sentences'),
      'eng-u7': [...englishSightWordLessons, ...topicLessons('vocabBasic'), ...topicLessons('vocabExt')],
      'eng-u8': topicLessons('reading'),
      'math-u2': mathAddSubLessons,
      'math-u3': mathShapeLessons,
      'math-u4': mathCompareLessons,
      'math-u5': mathClockLessons,
      'math-u6': mathChartLessons,
    };
    return (map[unitId] ?? []).map((l) => ({ ...l }));
  }

  async getBoard() { await sleep(40); return this.board.map((c) => ({ ...c })); }
  async getBoardEvents() { await sleep(40); return this.boardEvents.map((e) => ({ ...e })); }

  async claimBoardEvent(cellIndex: number, idempotencyKey: string): Promise<ClaimBoardResult> {
    await sleep(110);
    const existing = this.boardKeys.get(idempotencyKey);
    if (existing) return { event: { ...existing }, txn: existing.txnId ? this.coinKeys.get(existing.txnId) : undefined, stickerId: existing.stickerId };
    const cell = this.board.find((c) => c.index === cellIndex);
    if (!cell) throw new Error('cell not found');
    let txn: CoinTransaction | undefined;
    let stickerId: string | undefined;
    const event: BoardEvent = { id: uid('be'), cellIndex, type: cell.kind, rewardType: 'none', rewardValue: cell.stepReward, claimed: true, completedAt: new Date().toISOString() };
    if (cell.kind === 'treasure' || cell.kind === 'coin') {
      txn = this.submitCoin('board', cell.stepReward === 0 ? 5 : 5 + cell.stepReward, `board:${cellIndex}`, undefined);
      event.rewardType = 'coin'; event.txnId = txn.transactionId; event.rewardValue = txn.amount;
    } else if (cell.kind === 'sticker') {
      const unowned = this.stickers.find((s) => !s.owned && s.unlockType !== 'coins');
      if (unowned) {
        this.stickers = this.stickers.map((s) => (s.id === unowned.id ? { ...s, owned: true, unlockedAt: new Date().toISOString().slice(0, 10), unlockReason: '森林棋盘动物贴纸格' } : s));
        stickerId = unowned.id; event.rewardType = 'sticker'; event.stickerId = unowned.id;
      }
    } else if (cell.kind === 'weekend' || cell.kind === 'normal' || cell.kind === 'rest' || cell.kind === 'english' || cell.kind === 'math' || cell.kind === 'story' || cell.kind === 'works' || cell.kind === 'review' || cell.kind === 'parent') {
      event.rewardType = 'step';
    }
    this.boardEvents = [...this.boardEvents, event];
    this.boardKeys.set(idempotencyKey, event);
    return { event, txn, stickerId };
  }

  async getStickers() { await sleep(40); return [...this.stickers]; }
  async earnSticker(s: AnimalSticker, idempotencyKey: string) {
    await sleep(60);
    if (this.stickerKeys.has(idempotencyKey)) return [...this.stickers];
    this.stickerKeys.add(idempotencyKey);
    if (!this.stickers.find((x) => x.id === s.id)) this.stickers = [...this.stickers, { ...s, owned: true, unlockedAt: new Date().toISOString().slice(0, 10) }];
    else this.stickers = this.stickers.map((x) => (x.id === s.id ? { ...x, owned: true, unlockedAt: x.unlockedAt ?? new Date().toISOString().slice(0, 10) } : x));
    return [...this.stickers];
  }
  async exchangeSticker(stickerId: string, idempotencyKey: string): Promise<ExchangeResult> {
    await sleep(100);
    const target = this.stickers.find((s) => s.id === stickerId);
    if (!target) throw new Error('sticker not found');
    if (target.owned) return { stickers: [...this.stickers], txn: this.coinKeys.get(idempotencyKey)!, balance: this.kid.coins };
    const cost = target.coinCost ?? 0;
    if (this.kid.coins < cost) throw new Error('not enough coins');
    const txn = this.submitCoin('exchange', -cost, idempotencyKey);
    this.stickers = this.stickers.map((s) => (s.id === stickerId ? { ...s, owned: true, unlockedAt: new Date().toISOString().slice(0, 10), unlockReason: `用 ${cost} 森林金币兑换` } : s));
    return { stickers: [...this.stickers], txn, balance: this.kid.coins };
  }

  async getReviewItems() { await sleep(40); return this.reviewItems.map((r) => ({ ...r })); }
  async saveReviewResult(itemId: string, result: 'ok' | 'retry') {
    await sleep(50);
    this.reviewItems = this.reviewItems.map((r) => {
      if (r.itemId !== itemId) return r;
      const intervalDays = result === 'ok' ? Math.min(7, r.intervalDays + 1) : 1;
      const due = new Date(Date.now() + intervalDays * 86400000).toISOString().slice(0, 10);
      return { ...r, lastResult: result, attempts: r.attempts + 1, intervalDays, dueAt: due };
    });
    return this.reviewItems.map((r) => ({ ...r }));
  }

  async getKnowledge() { await sleep(40); return JSON.parse(JSON.stringify(this.knowledge)); }
  async getPortfolio() { await sleep(40); return this.portfolio.map((p) => ({ ...p })); }
  async savePortfolio(item: PortfolioItem) { await sleep(50); this.portfolio = [...this.portfolio, { ...item }]; return this.portfolio.map((p) => ({ ...p })); }

  async getWeeklyRewards() { await sleep(40); return this.weekly.map((w) => ({ ...w })); }
  async completeWeeklyGoal(id: string, idempotencyKey: string) {
    await sleep(80);
    if (this.weeklyKeys.has(idempotencyKey)) return { rewards: this.weekly.map((w) => ({ ...w })) };
    this.weeklyKeys.add(idempotencyKey);
    this.weekly = this.weekly.map((w) => (w.id === id ? { ...w, achieved: true } : w));
    let stickerId: string | undefined;
    const wr = this.weekly.find((w) => w.id === id);
    if (wr?.stickerId && !this.stickers.find((s) => s.id === wr.stickerId && s.owned)) {
      this.stickers = this.stickers.map((s) => (s.id === wr.stickerId ? { ...s, owned: true, unlockedAt: new Date().toISOString().slice(0, 10), unlockReason: '达成周目标' } : s));
      stickerId = wr.stickerId;
    }
    return { rewards: this.weekly.map((w) => ({ ...w })), stickerId };
  }

  async getMission() { await sleep(40); return { ...this.mission }; }
  async confirmMission(id: string) { await sleep(60); this.mission = { ...this.mission, confirmedByParent: true, completedAt: new Date().toISOString() }; return { ...this.mission }; }

  async getSubjectProgress() { await sleep(40); return seedSubjectProgress.map((s) => ({ ...s })); }
  async getSkillProgress() { await sleep(40); return seedSkillProgress.map((s) => ({ ...s })); }
  async getStreak() { await sleep(40); return { ...seedStreak }; }

  async verifyPin(pin: string) { await sleep(80); return pin === this.parent.pin; }
  async getParentSettings() { await sleep(40); return { ...this.parent }; }
  async patchParentSettings(p: Partial<ParentSettings>) { await sleep(60); this.parent = { ...this.parent, ...p }; return { ...this.parent }; }
}

export const api: ApiClient = new MockApi();

/* 接真实后端：export const api: ApiClient = new HttpApi('/api'); */
