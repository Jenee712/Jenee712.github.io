import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Mascot } from '@/components/characters/Mascot';
import type { TodayTask } from '@/types';
import { LearningStatusHeader } from '@/components/ui/LearningStatusHeader';
import { DailyTaskList } from '@/components/ui/DailyTaskList';
import { ContinueLearningButton } from '@/components/ui/ContinueLearningButton';
import { StretchReminder } from '@/components/ui/StretchReminder';
import { AnimalSticker } from '@/components/stickers/AnimalSticker';
import { Leaf, Berry } from '@/components/decor/ForestDecor';
import { dayOfSummer } from '@/data/plan60';

export function HomePage() {
  const navigate = useNavigate();
  const kid = useAppStore((s) => s.kid);
  const tasks = useAppStore((s) => s.tasks);
  const stickers = useAppStore((s) => s.stickers);
  const completedDays = useAppStore((s) => s.completedDays);
  const mission = useAppStore((s) => s.mission);
  const restMin = useAppStore((s) => s.parent.restReminderMin);
  const studyDay = useAppStore((s) => s.studyDay);
  const resetStudyDay = useAppStore((s) => s.resetStudyDay);
  const realToday = dayOfSummer();

  const [showStretch, setShowStretch] = useState(false);
  // 记录上次关闭伸展弹窗的时间戳；冷却期间不再自动弹起（避免用户关掉后 useEffect 又立刻拉起）
  const lastClosedRef = useRef<number>(0);
  const COOLDOWN_MS = 3 * 60 * 1000;
  const remaining = Math.max(0, kid.todayGoalMin - kid.todayMinutes);

  // 连续学习达提醒间隔 → 弹出伸展补给站（3 分钟内不重复弹）
  useEffect(() => {
    if (showStretch) return;
    if (kid.todayMinutes < restMin) return;
    const since = Date.now() - lastClosedRef.current;
    if (since < COOLDOWN_MS) return;
    setShowStretch(true);
  }, [kid.todayMinutes, restMin, showStretch]);

  const closeStretch = () => {
    lastClosedRef.current = Date.now();
    setShowStretch(false);
  };

  const openStretch = () => {
    if (showStretch) return;
    setShowStretch(true);
  };

  const primary = tasks.find((t) => !t.done && t.kind === 'normal') ?? tasks.find((t) => !t.done);

  const onStart = (t: TodayTask) => {
    if (t.kind === 'rest') { openStretch(); return; }
    if (t.kind === 'review') { navigate('/review'); return; }
    if (t.kind === 'book') { navigate(`/english/book/${t.lessonId ?? 'pb-1'}?task=${t.id}`); return; }
    if (t.subject === 'english') navigate(`/english/lesson/${t.lessonId ?? 'eng-ch-1'}`);
    else if (t.subject === 'math') navigate(`/math/lesson/${t.lessonId ?? 'math-ch-1'}`);
    else if (t.subject === 'chinese') navigate(`/chinese/lesson/${t.lessonId ?? 'ch-1'}`);
  };

  const recentSticker = stickers.filter((s) => s.owned).slice(-1)[0];

  return (
    <div className="container-forest pt-6">
      {/* 森系 hero 场景区（背景图已在外层，新图氛围下此处只做轻量欢迎语 + 飘叶装饰） */}
      <section className="relative overflow-hidden rounded-pebble bg-cream-50/55 backdrop-blur-sm ring-1 ring-forest-100/70 shadow-soft p-6 sm:p-7">
        {/* 飘动的几片小叶子，给 hero 一点"活气"，避免和背景图打架 */}
        <Leaf className="absolute top-4 right-12 w-7 opacity-50 animate-flutter" />
        <Leaf className="absolute bottom-6 right-1/3 w-5 opacity-40 animate-flutter" style={{ animationDelay: '2.6s' }} />
        <Berry className="absolute bottom-3 left-8 w-8 opacity-60 animate-bob" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-50/90 ring-1 ring-forest-200 text-sm font-display font-bold text-forest-700 mb-2">
              <span className="text-base">🐶</span> 小狗的森林学习站
            </div>
            <h1 className="type-h1">下午好，{kid.nickname}！</h1>
            <p className="type-body text-forest-700/80 mt-1">小鹿领航员在森林入口等你出发。</p>
          </div>
          <Mascot name="deer" size={96} animated className="animate-floaty shrink-0 hidden sm:block" />
        </div>
      </section>

      <div className="mt-5">
        <LearningStatusHeader kid={kid} />
      </div>

      <div className="mt-4">
        <button onClick={() => navigate('/roadmap')} className="btn-leaf tap w-full sm:w-auto">🗺 查看 60 天路线图 · 已完成 {completedDays.length} / 60 天</button>
      </div>

      {studyDay !== realToday && (
        <div className="mt-3 card-leaf px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-forest-700">📚 你正在学习：<b>暑期第 {studyDay} 天</b> 的内容（已记住，不是真实今天）</span>
          <button className="btn-ghost tap shrink-0" onClick={resetStudyDay}>回到今天（第 {realToday} 天）</button>
        </div>
      )}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 今日飞行计划 */}
        <section className="card p-5 lg:col-span-2" aria-labelledby="today-plan">
          <header className="flex items-end justify-between gap-3">
            <div>
              <h2 id="today-plan" className="type-h2">{studyDay === realToday ? '今天飞行计划' : `第 ${studyDay} 天 · 飞行计划`}</h2>
              <p className="type-meta mt-1">还需 {remaining} 分钟 · {tasks.filter((t) => !t.done).length} 项待完成</p>
            </div>
          </header>
          <div className="mt-4">
            <DailyTaskList tasks={tasks} onStart={onStart} />
          </div>
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            {primary ? (
              <ContinueLearningButton
                label={`继续：${primary.kind === 'rest' ? '伸展补给站' : primary.title.replace(/^.+?·\s?/, '')}`}
                onClick={() => onStart(primary)}
              />
            ) : (
              <ContinueLearningButton label="去森林棋盘 🌟" onClick={() => navigate('/board')} />
            )}
            <button onClick={openStretch} className="btn-ghost tap">休息一下 🦌</button>
          </div>
        </section>

        {/* 侧边：棋盘预览 / 亲子任务 / 最近贴纸 */}
        <aside className="flex flex-col gap-4">
          <section className="card p-5">
            <header className="flex items-center justify-between">
              <h2 className="type-h3">森林棋盘</h2>
              <span className="pill">本周 {kid.weeklySteps} / {kid.weeklyStepGoal} 步</span>
            </header>
            <MiniBoard />
            <button className="btn-secondary mt-3 w-full tap" onClick={() => navigate('/board')}>查看棋盘 →</button>
          </section>

          <section className="card-leaf p-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden>🧑‍🤝‍🧑</span>
              <h2 className="type-h3">本周亲子任务</h2>
            </div>
            <p className="type-body mt-2">{mission.title}</p>
            <p className="text-sm text-forest-500 mt-1">{mission.detail}</p>
            {mission.confirmedByParent
              ? <span className="pill pill-sun mt-2">✅ 家长已确认</span>
              : <span className="pill mt-2">由家长确认完成</span>}
          </section>

          <section className="card p-5">
            <header className="flex items-center justify-between">
              <h2 className="type-h3">最近获得的贴纸</h2>
              <button onClick={() => navigate('/rewards')} className="btn-ghost text-sm tap">奖励小屋 →</button>
            </header>
            {recentSticker ? (
              <div className="mt-3">
                <AnimalSticker sticker={recentSticker} size={122} onClick={() => navigate('/rewards')} />
              </div>
            ) : (
              <p className="text-sm text-forest-500 mt-2">完成今天的学习，就能收集第一张动物贴纸！</p>
            )}
          </section>
        </aside>
      </div>

      <StretchReminder open={showStretch} onClose={closeStretch} mascot="deer" />
    </div>
  );
}

function MiniBoard() {
  const board = useAppStore((s) => s.board);
  const preview = board.slice(0, 8);
  return (
    <div className="mt-3 grid grid-cols-4 gap-1.5" aria-label="棋盘预览">
      {preview.map((c) => (
        <div key={c.index} className={`aspect-square rounded-barn flex items-center justify-center text-lg
          ${c.status === 'done' ? 'bg-forest-500 text-cream-50' : ''}
          ${c.status === 'current' ? 'bg-sun-400 shadow-lift' : ''}
          ${c.status === 'available' || c.status === 'locked' ? 'bg-cream-200 text-forest-800' : ''}`} aria-hidden>
          {c.emoji}
        </div>
      ))}
    </div>
  );
}
