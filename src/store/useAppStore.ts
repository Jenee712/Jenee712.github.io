import { create } from 'zustand';
import type {
  ChildProfile, ParentSettings, TodayTask, BoardCell, BoardEvent, AnimalSticker,
  ReviewItem, KnowledgeCollection, PortfolioItem, WeeklyReward, ParentChildMission,
  SubjectProgress, SkillProgress, LearningStreak, SyncEvent, SyncMeta, StickerUnlockType,
  LessonResultSummary, BattleRecord, WeakLesson,
} from '@/types';
import {
  initialKid, initialParent,
} from '@/data/user';
import { generateDailyPlan } from '@/data/curriculum';
import { GradeKey, DEFAULT_GRADE, isGradeKey } from '@/data/grades';
import { refreshGrade } from '@/data/gradeContent';
import { getDayPlan, dayOfSummer, PLAN_TOTAL_DAYS } from '@/data/plan60';
import { boardCells, initialStickers } from '@/data/board';
import { monoCells, drawMonoCard, MONO_COLOR_GROUPS, type MonoCardDef } from '@/data/monopoly';
import type { MonopolyState } from '@/types';
import {
  seedReviewItems, seedKnowledge, seedPortfolio, seedWeeklyRewards, seedMission,
  seedSubjectProgress, seedSkillProgress, seedStreak, seedBoardEvents,
} from '@/data/learning';
import { api } from '@/lib/api';
import { sync } from '@/lib/sync';

const todayKey = () => new Date().toISOString().slice(0, 10);
// 用户「选哪天学哪天」的覆盖日：持久化，下次打开仍生效（不会跳回今天）。
const STUDY_DAY_KEY = 'ff_study_day_v1';
function loadStudyDay(): number {
  try {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem(STUDY_DAY_KEY) : null;
    if (v) {
      const n = parseInt(v, 10);
      if (n >= 1 && n <= 60) return n;
    }
  } catch { /* ignore */ }
  return dayOfSummer();
}
function saveStudyDay(d: number) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(STUDY_DAY_KEY, String(d)); } catch { /* ignore */ }
}
// 简体字·ABC 版使用独立年级记忆，不影响旧版选择。
const GRADE_KEY = import.meta.env.BASE_URL.includes('/simplified-abc/') ? 'ff_grade_simplified_abc_v1' : 'ff_grade_v1';
function loadGrade(): GradeKey {
  try {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem(GRADE_KEY) : null;
    if (v && isGradeKey(v)) return v;
  } catch { /* ignore */ }
  return DEFAULT_GRADE;
}
function saveGrade(g: GradeKey) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(GRADE_KEY, g); } catch { /* ignore */ }
}
const regenTasks = (day: number): TodayTask[] => {
  const weak = api.getWeakLessons ? api.getWeakLessons() : [];
  return getDayPlan(day, weak);
};

export type { LessonResultSummary };

interface State {
  kid: ChildProfile;
  parent: ParentSettings;
  tasks: TodayTask[];
  board: BoardCell[];
  boardEvents: BoardEvent[];
  stickers: AnimalSticker[];
  reviewItems: ReviewItem[];
  knowledge: KnowledgeCollection;
  portfolio: PortfolioItem[];
  weeklyRewards: WeeklyReward[];
  mission: ParentChildMission;
  subjectProgress: SubjectProgress[];
  skillProgress: SkillProgress[];
  streak: LearningStreak;
  parentUnlocked: boolean;
  syncMeta: SyncMeta;
  lastResult: LessonResultSummary | null;
  battleRecords: BattleRecord[];
  completedDays: number[];
  studyDay: number;
  grade: GradeKey;
  setGrade: (g: GradeKey) => void;
  setStudyDay: (day: number) => void;
  resetStudyDay: () => void;
  markDayDone: (day: number) => Promise<void>;
  unmarkDayDone: (day: number) => Promise<void>;
  loadDayPlan: (day: number) => Promise<TodayTask[]>;

  refresh: () => Promise<void>;
  completeTask: (id: string, payload: { correct: number; total: number; minutes: number }) => Promise<{ stickerId?: string; coins?: number; steps?: number }>;
  claimBoardEvent: (cellIndex: number) => Promise<void>;
  awardSticker: (stickerId: string, reason: string, unlockType: StickerUnlockType) => Promise<void>;
  exchangeSticker: (stickerId: string) => Promise<boolean>;
  saveReviewResult: (itemId: string, result: 'ok' | 'retry') => Promise<void>;
  savePortfolio: (item: PortfolioItem) => Promise<void>;
  completeWeeklyGoal: (id: string) => Promise<void>;
  confirmMission: (id: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  lockParent: () => void;
  patchParent: (p: Partial<ParentSettings>) => void;
  setOnline: (v: boolean) => void;
  setLastResult: (r: LessonResultSummary | null) => void;
  addBattleRecord: (r: BattleRecord) => void;

  // 大富翁（森林棋盘 80% 重做）
  monopoly: MonopolyState;
  monoRoll: () => void;
  monoBuy: (index: number) => void;
  monoReset: () => void;
  monoClearCard: () => void;
  monoGrantAllowance: () => void;
}

const initialMonopoly: MonopolyState = {
  pos: 0,
  monoCoins: 50,
  dice: 0,
  owned: [],
  inTreeHole: 0,
  lastRoll: null,
  extraRoll: false,
  pendingCard: null,
  needsStudy: false,
  animating: false,
  log: ['🌳 欢迎来到森林大富翁！每次打开棋盘会发 20 个骰子，掷骰子沿森林走一圈，买下喜欢的领地吧～'],
};

const advanceBoard = (board: BoardCell[]): BoardCell[] => {
  const cur = board.findIndex((c) => c.status === 'current');
  if (cur < 0 || cur >= board.length - 1) return board;
  return board.map((c, i) => {
    if (i === cur) return { ...c, status: 'done' };
    if (i === cur + 1) return { ...c, status: 'current' };
    return c;
  });
};

export const useAppStore = create<State>((set, get) => {
  const applyRemote = (e: SyncEvent) => {
    const p = e.payload as Record<string, unknown>;
    switch (e.type) {
      case 'task.completed':
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === p.taskId ? { ...t, done: true } : t)),
          kid: { ...s.kid, todayMinutes: s.kid.todayMinutes + (p.minutes as number), todayLessonsDone: s.kid.todayLessonsDone + 1 },
          board: advanceBoard(s.board),
        }));
        break;
      case 'coin.changed':
        set((s) => ({ kid: { ...s.kid, coins: p.total as number } }));
        break;
      case 'step.advanced':
        set((s) => ({ board: advanceBoard(s.board) }));
        break;
      case 'sticker.earned':
        set((s) => ({ stickers: s.stickers.map((x) => (x.id === p.stickerId ? { ...x, owned: true, unlockedAt: x.unlockedAt ?? todayKey() } : x)) }));
        break;
      case 'board.event.claimed': {
        const cellIndex = p.cellIndex as number;
        const ev: BoardEvent = {
          id: `be-remote-${cellIndex}`, cellIndex, type: p.cellType as BoardEvent['type'],
          rewardType: (p.rewardType as BoardEvent['rewardType']) ?? 'none', rewardValue: (p.rewardValue as number) ?? 0,
          stickerId: p.stickerId as string | undefined, claimed: true, completedAt: new Date().toISOString(),
        };
        set((s) => ({
          boardEvents: s.boardEvents.find((b) => b.cellIndex === cellIndex) ? s.boardEvents : [...s.boardEvents, ev],
          stickers: p.stickerId ? s.stickers.map((x) => (x.id === p.stickerId ? { ...x, owned: true, unlockedAt: x.unlockedAt ?? todayKey() } : x)) : s.stickers,
          kid: p.txnAmount ? { ...s.kid, coins: (p.txnAmount as number) } : s.kid,
          board: advanceBoard(s.board),
        }));
        break;
      }
      case 'parent.settings.changed':
        set((s) => ({ parent: { ...s.parent, ...(p.patch as Partial<ParentSettings>) } }));
        break;
      default:
        break;
    }
  };

  if (typeof window !== 'undefined') {
    sync.subscribe((e) => {
      applyRemote(e);
    });
  }

  // 依持久化年级同步内容层（G1 原样；其余级载入占位内容）
  refreshGrade(loadGrade());

  return {
    kid: { ...initialKid },
    parent: { ...initialParent },
    tasks: regenTasks(loadStudyDay()),
    completedDays: api.getCompletedDays(),
    studyDay: loadStudyDay(),
    grade: loadGrade(),
    board: [...boardCells],
    boardEvents: [...seedBoardEvents],
    stickers: [...initialStickers],
    reviewItems: [...seedReviewItems],
    knowledge: JSON.parse(JSON.stringify(seedKnowledge)),
    portfolio: [...seedPortfolio],
    weeklyRewards: [...seedWeeklyRewards],
    mission: { ...seedMission },
    subjectProgress: [...seedSubjectProgress],
    skillProgress: [...seedSkillProgress],
    streak: { ...seedStreak },
    parentUnlocked: false,
    syncMeta: sync.getMeta(),
    lastResult: null,
    battleRecords: [],

    monopoly: { ...initialMonopoly },

    addBattleRecord(r) {
      set((s) => ({ battleRecords: [r, ...s.battleRecords].slice(0, 50) }));
    },

    // ------- 年级切换（7 套学习工作台的核心开关）-------
    setGrade(grade) {
      refreshGrade(grade);
      saveGrade(grade);
      set({ grade, tasks: regenTasks(get().studyDay) });
    },

    // ------- 大富翁（森林棋盘 80% 重做）-------
    monoRoll() {
      const s = get();
      const m = s.monopoly;
      if (m.animating) return;
      if (m.inTreeHole > 0) {
        set({ monopoly: { ...m, inTreeHole: m.inTreeHole - 1, log: [`🌳 在树洞休息中…（还剩 ${m.inTreeHole - 1} 回合）`, ...m.log].slice(0, 30) } });
        return;
      }
      if (m.dice <= 0 && !m.extraRoll) {
        set({ monopoly: { ...m, needsStudy: true, log: ['🎲 没有骰子了！去学习一轮，再回来兑换 20 个骰子吧～', ...m.log].slice(0, 30) } });
        return;
      }
      const d = 1 + Math.floor(Math.random() * 6);
      const useExtra = m.extraRoll;
      const newDice = useExtra ? m.dice : m.dice - 1;
      const start = m.pos;
      const len = monoCells.length;
      const log: string[] = [`🎲 掷出 ${d} 步，小鹿出发啦～`];
      let coins = m.monoCoins;
      let pendingCard: MonoCardDef | null = null;
      let inTreeHole = 0;
      let extraRoll = false;
      const owned = [...m.owned];
      let endPos = (start + d) % len;

      // 经过森林邮局（绕圈）领 20 金币
      if (endPos < start || (endPos === 0 && d > 0)) {
        coins += 20;
        log.unshift('🏡 经过森林邮局，领取 20 金币！');
      }

      const cell = monoCells[endPos];
      if (cell.kind === 'property') {
        if (owned.includes(endPos)) {
          coins += cell.rent ?? 0;
          log.unshift(`🏠 收租 +${cell.rent} 金币（你的领地）`);
        } else if (cell.owner === null) {
          log.unshift(`💡 这是空地，可以花 ${cell.price} 金币买下它！`);
        }
      } else if (cell.kind === 'animal') {
        coins -= cell.rent ?? 0;
        log.unshift(`🐾 踩到 ${cell.label}，付 ${cell.rent} 金币给森林动物～`);
      } else if (cell.kind === 'go') {
        coins += 20;
        log.unshift('🏡 停在森林邮局，领取 20 金币！');
      } else if (cell.kind === 'jail') {
        inTreeHole = 1;
        log.unshift('🌳 在树洞休息 1 回合，下一回合不能掷骰。');
      } else if (cell.kind === 'chance' || cell.kind === 'fortune' || cell.kind === 'fountain') {
        const type: 'chance' | 'fortune' = cell.kind === 'fortune' || cell.kind === 'fountain' ? 'fortune' : 'chance';
        const card = drawMonoCard(type);
        pendingCard = card;
        const label = cell.kind === 'chance' ? '森林奇遇' : cell.kind === 'fortune' ? '森林考验' : '命运之泉';
        log.unshift(`🃏 ${label}：${card.text}`);
        if (card.effect === 'coins' && card.value) coins += card.value;
        else if (card.effect === 'toGo') { endPos = 0; coins += 20; }
        else if (card.effect === 'treeHole') inTreeHole = 1;
        else if (card.effect === 'extraRoll') extraRoll = true;
        else if (card.effect === 'move' && card.value) {
          endPos = (endPos + card.value + len) % len;
          const mc = monoCells[endPos];
          if (owned.includes(endPos)) { coins += mc.rent ?? 0; log.unshift(`🏠 收租 +${mc.rent} 金币`); }
          else if (mc.kind === 'animal') { coins -= mc.rent ?? 0; log.unshift(`🐾 付 ${mc.rent} 金币给森林动物`); }
          else if (mc.kind === 'go') { coins += 20; log.unshift('🏡 到森林邮局 +20'); }
        }
      } else if (cell.kind === 'park') {
        log.unshift('🏞️ 在森林湖安全歇脚。');
      }

      // 进入走棋动画：逐格前进，每步约 340ms 跳一格，落定后再结算全部效果
      set({ monopoly: { ...m, animating: true, lastRoll: [d, d] } });

      let step = 0;
      const STEP_MS = 340;
      const tick = () => {
        step += 1;
        const p = (start + step) % len;
        set((st) => ({ monopoly: { ...st.monopoly, pos: p, animating: true } }));
        if (step < d) {
          setTimeout(tick, STEP_MS);
        } else {
          setTimeout(() => {
            set((st) => ({
              monopoly: {
                ...st.monopoly,
                pos: endPos,
                monoCoins: Math.max(0, coins),
                dice: newDice,
                needsStudy: newDice <= 0 ? true : st.monopoly.needsStudy,
                owned, inTreeHole, extraRoll, pendingCard,
                animating: false,
                log: [...log, ...st.monopoly.log].slice(0, 30),
              },
            }));
          }, STEP_MS);
        }
      };
      setTimeout(tick, STEP_MS);
    },

    monoBuy(index) {
      const s = get();
      const m = s.monopoly;
      if (m.pos !== index) return;
      const cell = monoCells[index];
      if (cell.kind !== 'property' || cell.owner !== null) return;
      if (m.monoCoins < (cell.price ?? 0)) {
        set({ monopoly: { ...m, log: [`💸 金币不够买「${cell.label}」（需要 ${cell.price}）`, ...m.log].slice(0, 30) } });
        return;
      }
      const colorName = cell.colorGroup ? MONO_COLOR_GROUPS[cell.colorGroup]?.name ?? '' : '';
      set({
        monopoly: {
          ...m,
          monoCoins: m.monoCoins - (cell.price ?? 0),
          owned: [...m.owned, index],
          log: [`🏠 买下「${cell.label}」！${colorName ? `（${colorName}组）` : ''}`, ...m.log].slice(0, 30),
        },
      });
    },

    monoReset() {
      set({ monopoly: { ...initialMonopoly, needsStudy: get().monopoly.needsStudy } });
    },

    // 每次打开棋盘调用：未欠学习时，补满 20 个骰子。
    // needsStudy=true 代表上一次 20 个已用完且还没学习，需先学习一轮才会在下次打开补发。
    monoGrantAllowance() {
      const m = get().monopoly;
      if (m.needsStudy) return;            // 用完未学习 → 不补发，强制先去学习
      set({ monopoly: { ...m, dice: 20, animating: false } });
    },

    monoClearCard() {
      const m = get().monopoly;
      set({ monopoly: { ...m, pendingCard: null } });
    },

    async refresh() {
      const [kid, parent, tasks, board, boardEvents, stickers, reviewItems, knowledge, portfolio, weekly, mission, sp, sk, streak] = await Promise.all([
        api.getKid(), api.getParentSettings(), api.getTodayTasks(), api.getBoard(), api.getBoardEvents(),
        api.getStickers(), api.getReviewItems(), api.getKnowledge(), api.getPortfolio(),
        api.getWeeklyRewards(), api.getMission(), api.getSubjectProgress(), api.getSkillProgress(), api.getStreak(),
      ]);
      set({ kid, parent, tasks: regenTasks(get().studyDay), board, boardEvents, stickers, reviewItems, knowledge, portfolio, weeklyRewards: weekly, mission, subjectProgress: sp, skillProgress: sk, streak });
    },

    async completeTask(id, payload) {
      const key = `task:${id}:${todayKey()}`;
      const res = await api.completeTask(id, payload, key);
      // 薄弱点追踪：答错 → 记录；全对 → 解除
      const t = get().tasks.find((x) => x.id === id);
      if (t && t.lessonId && t.kind === 'normal' &&
          (t.subject === 'english' || t.subject === 'math' || t.subject === 'chinese')) {
        const clean = t.title.replace(/^🔁\s*复习\s*·\s*/, '').replace(/^[^·]*·\s*/, '');
        if (payload.correct < payload.total) {
          await api.addWeakLesson({ lessonId: t.lessonId, subject: t.subject, title: clean } as WeakLesson);
        } else {
          await api.resolveWeakLesson(t.lessonId);
        }
      }
      const s = get();
      // 若今天所有任务都完成了，自动标记「暑期第 N 天」完成
      const allDone = s.tasks.every((t) => t.id === id || t.done);
      if (allDone) {
        const today = get().studyDay;
        if (!s.completedDays.includes(today)) {
          await api.markDayDone(today);
          set({ completedDays: api.getCompletedDays() });
        }
      }
      const newCoins = res.txn ? res.txn.balanceAfter : s.kid.coins;
      set({
        tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: true } : t)),
        kid: { ...s.kid, coins: newCoins, todayMinutes: s.kid.todayMinutes + payload.minutes, todayLessonsDone: s.kid.todayLessonsDone + 1, xp: s.kid.xp + Math.max(1, Math.round(payload.minutes / 2)) },
        board: advanceBoard(s.board),
        monopoly: { ...s.monopoly, needsStudy: false },
      });
      sync.publish({ type: 'task.completed', payload: { taskId: id, minutes: payload.minutes, correct: payload.correct, total: payload.total } });
      if (res.txn) sync.publish({ type: 'coin.changed', payload: { delta: res.txn.amount, total: newCoins } });
      sync.publish({ type: 'step.advanced', payload: { from: 0, to: 1 } });
      return { coins: res.txn?.amount, steps: 1 };
    },

    async claimBoardEvent(cellIndex) {
      const key = `board:${cellIndex}:${todayKey()}`;
      const res = await api.claimBoardEvent(cellIndex, key);
      const s = get();
      set({
        boardEvents: [...s.boardEvents.filter((b) => b.cellIndex !== cellIndex), res.event],
        board: advanceBoard(s.board),
        kid: res.txn ? { ...s.kid, coins: res.txn.balanceAfter } : s.kid,
        stickers: res.stickerId ? s.stickers.map((x) => (x.id === res.stickerId ? { ...x, owned: true, unlockedAt: todayKey(), unlockReason: '森林棋盘动物贴纸格' } : x)) : s.stickers,
      });
      sync.publish({ type: 'board.event.claimed', payload: { cellIndex, cellType: res.event.type, rewardType: res.event.rewardType, rewardValue: res.event.rewardValue, stickerId: res.stickerId, txnAmount: res.txn?.balanceAfter } });
      if (res.txn) sync.publish({ type: 'coin.changed', payload: { total: res.txn.balanceAfter } });
    },

    async awardSticker(stickerId, reason, _unlockType) {
      const s = get();
      const def = s.stickers.find((x) => x.id === stickerId);
      if (!def || def.owned) return;
      const toEarn: AnimalSticker = { ...def, owned: true, unlockedAt: todayKey(), unlockReason: reason };
      const list = await api.earnSticker(toEarn, `sticker:${stickerId}`);
      set({ stickers: list });
      sync.publish({ type: 'sticker.earned', payload: { stickerId } });
    },

    async exchangeSticker(stickerId) {
      const s = get();
      const def = s.stickers.find((x) => x.id === stickerId);
      if (!def || def.owned) return false;
      if (s.kid.coins < (def.coinCost ?? 0)) return false;
      const key = `exchange:${stickerId}`;
      try {
        const res = await api.exchangeSticker(stickerId, key);
        set({ stickers: res.stickers, kid: { ...get().kid, coins: res.balance } });
        sync.publish({ type: 'coin.changed', payload: { total: res.balance } });
        sync.publish({ type: 'sticker.earned', payload: { stickerId } });
        return true;
      } catch {
        return false;
      }
    },

    async saveReviewResult(itemId, result) {
      const list = await api.saveReviewResult(itemId, result);
      set({ reviewItems: list });
      sync.publish({ type: 'review.updated', payload: { itemId, result } });
    },

    async savePortfolio(item) {
      const list = await api.savePortfolio(item);
      set({ portfolio: list });
      sync.publish({ type: 'portfolio.added', payload: { id: item.id } });
    },

    async completeWeeklyGoal(id) {
      const res = await api.completeWeeklyGoal(id, `weekly:${id}`);
      set({ weeklyRewards: res.rewards });
      if (res.stickerId) {
        set((s) => ({ stickers: s.stickers.map((x) => (x.id === res.stickerId ? { ...x, owned: true, unlockedAt: todayKey(), unlockReason: '达成周目标' } : x)) }));
        sync.publish({ type: 'sticker.earned', payload: { stickerId: res.stickerId } });
      }
      sync.publish({ type: 'weekly.reward', payload: { id } });
    },

    async confirmMission(id) {
      const m = await api.confirmMission(id);
      set({ mission: m });
      sync.publish({ type: 'parent.settings.changed', payload: { patch: {} } });
    },

    async verifyPin(pin) {
      const ok = await api.verifyPin(pin);
      if (ok) set({ parentUnlocked: true });
      return ok;
    },
    lockParent() { set({ parentUnlocked: false }); },
    patchParent(p) {
      set((s) => ({ parent: { ...s.parent, ...p } }));
      api.patchParentSettings(p);
      sync.publish({ type: 'parent.settings.changed', payload: { patch: p as Record<string, unknown> } });
    },
    setOnline(v) {
      sync.setOnline(v);
      set({ syncMeta: sync.getMeta() });
    },
    async markDayDone(day: number) {
      await api.markDayDone(day);
      set({ completedDays: api.getCompletedDays() });
    },
    async unmarkDayDone(day: number) {
      await api.unmarkDayDone(day);
      set({ completedDays: api.getCompletedDays() });
    },
    setStudyDay(day: number) {
      const d = Math.max(1, Math.min(PLAN_TOTAL_DAYS, day));
      saveStudyDay(d);
      set({ studyDay: d, tasks: regenTasks(d) });
    },
    resetStudyDay() {
      const d = dayOfSummer();
      saveStudyDay(d);
      set({ studyDay: d, tasks: regenTasks(d) });
    },
    async loadDayPlan(day: number) {
      return api.getDayPlan(day);
    },
    setLastResult(r) { set({ lastResult: r }); },
  };
});
