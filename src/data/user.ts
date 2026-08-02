import type { ChildProfile, ParentSettings, TodayTask } from '@/types';
import { boardCells } from './board';

export const todayTasks: TodayTask[] = [
  { id: 't1', subject: 'english', unitId: 'eng-u4', lessonId: 'eng-tw-1', title: '英语 · 森林动物', detail: 'cat / dog / pig / fox', durationMin: 8, done: true,  kind: 'normal' },
  { id: 't2', subject: 'chinese', lessonId: 'ch-11', title: '语文 · 古诗《咏柳》', detail: '贺知章 · 碧玉妆成一树高', durationMin: 10, done: true, kind: 'normal' },
  { id: 't3', subject: 'rest',                              title: '伸展补给站',   detail: '跟原创角色做 60 秒肩颈操', durationMin: 1, done: false, kind: 'rest' },
  { id: 't4', subject: 'math',    unitId: 'math-u2', lessonId: 'math-3',   title: '数学 · 合起来 4+2', detail: '数一数，算一算', durationMin: 7, done: false, kind: 'normal' },
  { id: 't5', subject: 'english', unitId: 'eng-u5', lessonId: 'eng-sn-1', title: '英语 · 我会说 I can', detail: '拼句子 + 跟读', durationMin: 9, done: false, kind: 'normal' },
  { id: 't6', subject: 'chinese', lessonId: 'ch-21', title: '语文 · 成语「井底之蛙」', detail: '读成语故事', durationMin: 9, done: false, kind: 'normal' },
  { id: 't7', subject: 'math',    unitId: 'math-u3', lessonId: 'math-sh-1', title: '数学 · 认识形状', detail: '三角形 / 圆形 / 方形', durationMin: 8, done: false, kind: 'normal' },
  { id: 't8', subject: 'review',                            title: '复习小花园', detail: '浇水复习昨天的薄弱点', durationMin: 4, done: false, kind: 'review' },
];

export const initialKid: ChildProfile = {
  id: 'kid-leo',
  name: 'Leo',
  nickname: '小鹿 Leo',
  avatarKey: 'deer',
  level: 6,
  xp: 280,
  streakDays: 6,
  coins: 42,
  totalMinutes: 18 * 35,
  totalDays: 18,
  todayMinutes: 12,
  todayGoalMin: 35,
  todayLessonsDone: 2,
  todayLessonsGoal: 5,
  weeklySteps: 18,
  weeklyStepGoal: 30,
  englishMinutes: 246,
  mathMinutes: 108,
};

export const initialParent: ParentSettings = {
  pin: '1234',
  dailyMinutesGoal: 35,
  englishRatio: 0.7,
  mathRatio: 0.3,
  difficulty: 'challenge',
  reminderTime: '16:30',
  restReminderMin: 15,
  screenTimeLimitMin: 60,
  freePracticeLimitMin: 10,
  freePracticeEnabled: true,
  animationPref: 'auto',
  realityRewards: [
    { id: 'r1', title: '周末一起去公园', costCoins: 30, needsParentConfirm: true, shownToChild: true },
    { id: 'r2', title: '选一本新绘本',     costCoins: 25, needsParentConfirm: true, shownToChild: true },
    { id: 'r3', title: '和爸爸做蛋糕',     costCoins: 50, needsParentConfirm: true, shownToChild: false },
  ],
  devices: [
    { id: 'd1', name: 'iPad · 客厅', type: 'ipad',  lastActive: new Date().toISOString(), lastSyncAt: new Date().toISOString(), online: true  },
    { id: 'd2', name: 'iPhone · 妈妈', type: 'phone', lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(), lastSyncAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), online: false },
  ],
};

export const initialBoardCells = boardCells;
