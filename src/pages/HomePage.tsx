import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import type { TodayTask } from '@/types';
import { StretchReminder } from '@/components/ui/StretchReminder';
import { GradePicker } from '@/components/GradePicker';
import { Cloud, Flower, GrassTuft, Sun, Tree } from '@/components/decor/ForestDecor';
import { dayOfSummer } from '@/data/plan60';
import { gradeDef } from '@/data/grades';
import { StickerCrop } from '@/components/ui/StickerCrop';

const SUBJECT = {
  english: { label: '英语', icon: '🔤', tone: 'bg-sky-200 text-sky-600' },
  math: { label: '数学', icon: '➗', tone: 'bg-sun-400/25 text-soil-500' },
  chinese: { label: '语文', icon: '📖', tone: 'bg-forest-100 text-forest-700' },
  rest: { label: '休息', icon: '🌿', tone: 'bg-forest-100 text-forest-700' },
  review: { label: '复习', icon: '✨', tone: 'bg-forest-100 text-forest-700' },
} as const;

export function HomePage() {
  const publicBase = import.meta.env.BASE_URL;
  const navigate = useNavigate();
  const kid = useAppStore((s) => s.kid);
  const grade = useAppStore((s) => s.grade);
  const tasks = useAppStore((s) => s.tasks);
  const completedDays = useAppStore((s) => s.completedDays);
  const mission = useAppStore((s) => s.mission);
  const restMin = useAppStore((s) => s.parent.restReminderMin);
  const studyDay = useAppStore((s) => s.studyDay);
  const resetStudyDay = useAppStore((s) => s.resetStudyDay);
  const realToday = dayOfSummer();
  const currentGrade = gradeDef(grade);
  const [showStretch, setShowStretch] = useState(false);
  const lastClosedRef = useRef(0);
  const remainingTasks = tasks.filter((task) => !task.done);
  const primary = remainingTasks.find((task) => task.kind === 'normal') ?? remainingTasks[0];
  const doneCount = tasks.length - remainingTasks.length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 100;
  const remainingMinutes = remainingTasks.reduce((sum, task) => sum + task.durationMin, 0);

  const groupedTasks = useMemo(() => {
    return (['english', 'math', 'chinese', 'review', 'rest'] as TodayTask['subject'][])
      .map((subject) => ({ subject, tasks: tasks.filter((task) => task.subject === subject) }))
      .filter((group) => group.tasks.length > 0);
  }, [tasks]);

  useEffect(() => {
    if (showStretch || kid.todayMinutes < restMin || Date.now() - lastClosedRef.current < 3 * 60 * 1000) return;
    setShowStretch(true);
  }, [kid.todayMinutes, restMin, showStretch]);

  const onStart = (task: TodayTask) => {
    if (task.kind === 'rest') { setShowStretch(true); return; }
    if (task.kind === 'review') { navigate('/review'); return; }
    if (task.kind === 'book') { navigate(`/english/book/${task.lessonId ?? 'pb-1'}?task=${task.id}`); return; }
    if (task.subject === 'english') navigate(`/english/lesson/${task.lessonId ?? 'eng-ch-1'}`);
    if (task.subject === 'math') navigate(`/math/lesson/${task.lessonId ?? 'math-ch-1'}`);
    if (task.subject === 'chinese') navigate(`/chinese/lesson/${task.lessonId ?? 'ch-1'}`);
  };

  return (
    <div className="container-forest py-5 md:py-8">
      <section className="sky-station" aria-labelledby="welcome-heading">
        <Sun className="absolute -right-5 -top-6 w-24 opacity-90" />
        <Cloud className="absolute left-[42%] top-5 w-24 opacity-90 animate-drift" />
        <Cloud className="absolute right-[7%] top-20 w-16 opacity-75 animate-drift" style={{ animationDelay: '2s' }} />
        <span className="flying-plane" aria-hidden>✈️</span>
        <StickerCrop sheet="garden" position="3% 4%" label="花朵贴纸" className="hero-sticker hero-sticker-flower" zoom={390} />
        <StickerCrop sheet="pink" position="60% 86%" label="粉色小兔贴纸" className="hero-sticker hero-sticker-rabbit" zoom={390} />
        <StickerCrop sheet="birthday" position="54% 52%" label="礼物贴纸" className="hero-sticker hero-sticker-gift" zoom={420} />
        <Tree className="absolute -bottom-3 left-[46%] hidden w-24 opacity-85 md:block" />
        <Flower className="absolute bottom-1 left-5 w-10 opacity-90" />
        <GrassTuft className="absolute bottom-0 left-[32%] w-16 opacity-80" />

        <div className="relative z-10 max-w-xl pb-24 sm:pb-28 md:max-w-[58%] md:pb-16">
          <span className="station-sign">🚉 天空列车学习站 · {currentGrade.label}</span>
          <h1 id="welcome-heading" className="mt-3 font-display text-4xl font-extrabold leading-tight text-forest-900 md:text-5xl">
            下午好，{kid.nickname}！
          </h1>
          <p className="mt-2 text-lg font-medium text-forest-700">小猫、小狗和小兔已经到站，陪你完成今天的学习旅程。</p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-forest-700">
            <span className="journey-pill">📅 暑期第 {studyDay} 天</span>
            <span className="journey-pill">🔥 连续 {kid.streakDays} 天</span>
            <span className="journey-pill">🪙 {kid.coins} 金币</span>
          </div>
        </div>

        <div className="animal-platform" aria-label="小猫、小狗和小兔学习伙伴">
          <img src={`${publicBase}assets/stickers/cat-smug.png`} alt="小猫学习伙伴" className="animal-friend animal-cat" />
          <img src={`${publicBase}assets/stickers/corgi-cheer.png`} alt="小狗学习伙伴" className="animal-friend animal-dog" />
          <img src={`${publicBase}assets/stickers/rabbit-happy-cry.png`} alt="小兔学习伙伴" className="animal-friend animal-rabbit" />
        </div>
        <div className="rail-line" aria-hidden><span className="little-train">🚂</span></div>
      </section>

      <GradePicker />

      <section className="sticker-reward-strip mt-5" aria-labelledby="sticker-reward-heading">
        <div className="min-w-0 flex-1">
          <span className="sticker-kicker">✨ 今日贴纸补给</span>
          <h2 id="sticker-reward-heading" className="mt-1 font-display text-xl font-extrabold text-forest-900 sm:text-2xl">完成学习，挑一张喜欢的贴纸</h2>
          <p className="mt-1 text-sm font-medium text-forest-600">动物、花朵、生日礼物和小点心，都已经放进贴纸口袋啦。</p>
        </div>
        <div className="sticker-preview-row" aria-label="今日可以收集的贴纸">
          <StickerCrop sheet="garden" position="56% 5%" label="蝴蝶花朵贴纸" />
          <StickerCrop sheet="birthday" position="7% 4%" label="生日小熊贴纸" />
          <StickerCrop sheet="pink" position="50% 82%" label="粉色小兔贴纸" />
          <StickerCrop sheet="snack" position="40% 18%" label="冰淇淋贴纸" />
        </div>
        <button className="sticker-album-link" onClick={() => navigate('/album?tab=stickers')}>打开贴纸册 <span aria-hidden>→</span></button>
      </section>

      <section className="journey-card mt-5" aria-labelledby="next-task-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-forest-600">今天的学习列车</p>
            <h2 id="next-task-heading" className="font-display text-2xl font-extrabold text-forest-900 md:text-3xl">
              {remainingTasks.length ? '下一站，只做这一项' : '今天的旅程完成啦！'}
            </h2>
          </div>
          <span className="text-sm font-bold text-forest-700">{doneCount} / {tasks.length} 项</span>
        </div>
        <div className="mt-3 flex items-center gap-3" aria-label={`今天已完成 ${doneCount} 项，共 ${tasks.length} 项`}>
          <span className="text-xl" aria-hidden>🚂</span>
          <div className="progress-track flex-1 !h-4"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <span className="text-xl" aria-hidden>🏁</span>
        </div>

        {primary ? (
          <div className="next-stop mt-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`subject-chip ${SUBJECT[primary.subject].tone}`}>{SUBJECT[primary.subject].icon} {SUBJECT[primary.subject].label}</span>
                <span className="text-sm text-forest-500">约 {primary.durationMin} 分钟</span>
              </div>
              <h3 className="mt-2 truncate font-display text-xl font-extrabold text-forest-900 sm:text-2xl">{primary.title}</h3>
              <p className="mt-1 text-sm text-forest-600 sm:text-base">{primary.detail}</p>
            </div>
            <button className="btn-primary-lg w-full shrink-0 sm:w-auto" onClick={() => onStart(primary)}>出发学习 <span aria-hidden>→</span></button>
          </div>
        ) : (
          <div className="next-stop mt-5 justify-center text-center">
            <div><div className="text-4xl">🎉</div><p className="mt-2 font-display text-xl font-bold">动物伙伴为你鼓掌！</p></div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-forest-600">
          <span>{remainingTasks.length ? `今天还剩约 ${remainingMinutes} 分钟` : '可以去森林里玩啦'}</span>
          {studyDay !== realToday && <button className="text-link" onClick={resetStudyDay}>回到真实今天（第 {realToday} 天）</button>}
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <details className="card overflow-hidden group">
          <summary className="summary-row">
            <span><strong className="font-display text-xl text-forest-800">查看今天全部车站</strong><span className="mt-0.5 block text-sm text-forest-500">按学科分类，需要时再展开</span></span>
            <span className="summary-chevron" aria-hidden>⌄</span>
          </summary>
          <div className="space-y-5 px-4 pb-4 sm:px-5 sm:pb-5">
            {groupedTasks.map((group) => (
              <section key={group.subject}>
                <h2 className="mb-2 flex items-center gap-2 font-display font-bold text-forest-700">
                  <span>{SUBJECT[group.subject].icon}</span>{SUBJECT[group.subject].label}
                  <span className="text-sm font-normal text-forest-500">{group.tasks.filter((task) => task.done).length}/{group.tasks.length}</span>
                </h2>
                <div className="divide-y divide-forest-100 overflow-hidden rounded-barn ring-1 ring-forest-100">
                  {group.tasks.map((task) => (
                    <button key={task.id} onClick={() => onStart(task)} className="task-row">
                      <span className={`task-check ${task.done ? 'task-check-done' : ''}`}>{task.done ? '✓' : ''}</span>
                      <span className="min-w-0 flex-1 text-left"><span className="block truncate font-semibold text-forest-800">{task.title}</span><span className="block text-xs text-forest-500">{task.durationMin} 分钟</span></span>
                      <span aria-hidden>→</span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </details>

        <aside className="card p-5">
          <h2 className="font-display text-xl font-bold text-forest-800">换乘去看看</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="shortcut" onClick={() => navigate('/roadmap')}><span>✈️</span><b>60 天航线</b><small>{completedDays.length}/60 天</small></button>
            <button className="shortcut" onClick={() => navigate('/board')}><span>🗺️</span><b>森林棋盘</b><small>学习后再玩</small></button>
            <button className="shortcut" onClick={() => navigate('/album')}><span>🐰</span><b>成长图鉴</b><small>收集伙伴</small></button>
            <button className="shortcut" onClick={() => navigate('/battle')}><span>🛩️</span><b>飞机大战</b><small>放松一下</small></button>
          </div>
          <details className="mt-3 border-t border-forest-100 pt-3">
            <summary className="cursor-pointer text-sm font-semibold text-forest-700">🌼 本周亲子任务</summary>
            <p className="mt-2 font-semibold text-forest-800">{mission.title}</p>
            <p className="mt-1 text-sm text-forest-500">{mission.detail}</p>
          </details>
        </aside>
      </div>

      <StretchReminder open={showStretch} onClose={() => { lastClosedRef.current = Date.now(); setShowStretch(false); }} mascot="deer" />
    </div>
  );
}
