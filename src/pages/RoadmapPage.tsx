import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { getDayDef, dayOfSummer, PLAN_TOTAL_DAYS } from '@/data/plan60';
import type { TodayTask } from '@/types';
import { Mascot } from '@/components/characters/Mascot';
import { Cloud, Tree, Pine, Flower, GrassTuft } from '@/components/decor/ForestDecor';

const WEEKDAY = ['一', '二', '三', '四', '五', '六', '日'];
const subjectLabel = (s: string) =>
  s === 'english' ? '英语' : s === 'math' ? '数学' : s === 'chinese' ? '语文' : s === 'rest' ? '伸展' : '复习';

export function RoadmapPage() {
  const navigate = useNavigate();
  const completedDays = useAppStore((s) => s.completedDays);
  const markDayDone = useAppStore((s) => s.markDayDone);
  const unmarkDayDone = useAppStore((s) => s.unmarkDayDone);
  const loadDayPlan = useAppStore((s) => s.loadDayPlan);
  const studyDay = useAppStore((s) => s.studyDay);
  const setStudyDay = useAppStore((s) => s.setStudyDay);
  const resetStudyDay = useAppStore((s) => s.resetStudyDay);
  const today = dayOfSummer();

  const [preview, setPreview] = useState<{ day: number; tasks: TodayTask[] } | null>(null);

  // 预览某天的任务
  useEffect(() => {
    if (!preview) return;
    let cancel = false;
    loadDayPlan(preview.day).then((tasks) => {
      if (!cancel) setPreview({ day: preview.day, tasks });
    });
    return () => { cancel = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview?.day]);

  // 弹窗打开时锁定背景滚动
  useEffect(() => {
    if (!preview) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [preview]);

  const completedCount = completedDays.length;
  const pct = Math.round((completedCount / PLAN_TOTAL_DAYS) * 100);

  return (
    <div className="container-forest pt-6 pb-10">
      {/* 顶部：进度总览 */}
      <section className="relative overflow-hidden card p-5 sm:p-6 mb-5">
        <Tree className="absolute -top-4 -left-4 w-20 opacity-40" />
        <Pine className="absolute -bottom-4 -right-6 w-24 opacity-30" />
        <Cloud className="absolute top-3 right-8 w-10 opacity-60 animate-drift" />
        <div className="relative flex items-center gap-4">
          <Mascot name="deer" size={72} animated className="animate-floaty shrink-0 hidden sm:block" />
          <div className="min-w-0 flex-1">
            <h1 className="type-h1">暑期 60 天路线图</h1>
            <p className="type-meta mt-1">
              今天：<span className="font-bold text-forest-700">暑期第 {today} 天</span> · 已完成 {completedCount} / {PLAN_TOTAL_DAYS} 天（{pct}%）
            </p>
            <p className="text-xs text-forest-600/80 mt-1">
              英语按週進階：主題詞（英↔中翻譯）→ 句型（中翻英）→ 閱讀理解，每天都不一樣。
            </p>
            {studyDay !== today ? (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-forest-500/10 ring-1 ring-forest-400/30 px-3 py-1 text-xs text-forest-700">
                <span>📚 你正在学习：<b>暑期第 {studyDay} 天</b>（非真实今天）</span>
                <button className="underline font-bold" onClick={resetStudyDay}>回到今天</button>
              </div>
            ) : (
              <p className="text-xs text-forest-600/80 mt-1">点击任意一天可「学习那一天」并记住选择。</p>
            )}
            {/* 进度条 */}
            <div className="mt-3 h-3 rounded-full bg-cream-200 overflow-hidden ring-1 ring-forest-200">
              <div
                className="h-full bg-gradient-to-r from-forest-500 to-sun-400 transition-all"
                style={{ width: `${pct}%` }}
                aria-label="总进度"
              />
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary tap shrink-0"
          >← 回首页</button>
        </div>
      </section>

      {/* 路线图网格 */}
      <section className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="type-h2">第 1 天 — 第 {PLAN_TOTAL_DAYS} 天</h2>
          <div className="text-[11px] text-forest-600/80 flex items-center gap-3">
            <span><span className="inline-block w-3 h-3 rounded-full bg-sun-400 mr-1 align-middle" />今天</span>
            <span><span className="inline-block w-3 h-3 rounded-full bg-forest-500 mr-1 align-middle" />已完成</span>
            <span><span className="inline-block w-3 h-3 rounded-full bg-cream-200 ring-1 ring-forest-200 mr-1 align-middle" />未学</span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
          {Array.from({ length: PLAN_TOTAL_DAYS }, (_, i) => i + 1).map((d) => {
            const def = getDayDef(d);
            const isToday = d === today;
            const isDone = completedDays.includes(d);
            const themeShort = def.theme.split('·')[1]?.trim() || def.theme.split('·')[0]?.trim() || def.theme;
            return (
              <button
                key={d}
                onClick={() => setPreview({ day: d, tasks: [] })}
                className={
                  'relative aspect-square rounded-barn p-1.5 sm:p-2 flex flex-col items-center justify-center text-center tap transition select-none active:scale-95 ' +
                  (isDone
                    ? 'bg-forest-500 text-cream-50 ring-2 ring-forest-600'
                    : isToday
                      ? 'bg-sun-400 text-soil-700 ring-2 ring-sun-500 shadow-lift'
                      : 'bg-cream-50 text-forest-800 ring-1 ring-forest-200 hover:ring-2 hover:ring-forest-400')
                }
                aria-label={`第 ${d} 天 ${themeShort}${isDone ? '（已完成）' : isToday ? '（今天）' : ''}，点击预览`}
              >
                <div className="text-[9px] sm:text-[11px] font-bold opacity-80">週{WEEKDAY[(d - 1) % 7]}</div>
                <div className="font-display font-extrabold text-base sm:text-xl leading-none">{d}</div>
                <div className="text-[8px] sm:text-[10px] leading-tight opacity-90 truncate w-full mt-0.5">
                  {themeShort.replace(/^(第\s*\d+\s*周\s*·\s*)/, '')}
                </div>
                {isDone && <div className="absolute -top-1 -right-1 text-sm sm:text-base">✓</div>}
                {isToday && !isDone && <div className="absolute -top-1 -right-1 text-sm sm:text-base">📍</div>}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-forest-600/80">
          <Flower className="w-5 opacity-60" />
          <span>👆 点击任意一天，会弹出当天全部内容</span>
          <GrassTuft className="w-5 opacity-60" />
        </div>
      </section>

      {/* 当天任务预览 —— 改为居中弹窗，点了必定看得见 */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-forest-900/40 backdrop-blur-sm animate-[fadeIn_180ms_ease-out]"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`第 ${preview.day} 天内容预览`}
        >
          <section
            className="w-full sm:max-w-lg max-h-[88dvh] overflow-y-auto card rounded-b-none sm:rounded-pebble p-5 animate-[slideUp_220ms_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="type-h2">第 {preview.day} 天 · {getDayDef(preview.day).theme.split('·')[1]?.trim() || getDayDef(preview.day).theme}</h2>
                <p className="type-meta mt-1">
                  {completedDays.includes(preview.day) ? '✅ 已完成' : preview.day === today ? '📍 今天' : '未开始'} · 共 {preview.tasks.length} 项 · 约 {preview.tasks.reduce((s, t) => s + t.durationMin, 0)} 分钟
                </p>
              </div>
              <button className="btn-ghost tap shrink-0" onClick={() => setPreview(null)} aria-label="关闭预览">✕</button>
            </header>

            {preview.tasks.length === 0 ? (
              <p className="text-sm text-forest-500">加载中…</p>
            ) : (
              <ul className="space-y-2">
                {preview.tasks.map((t) => (
                  <li key={t.id} className="card-leaf p-3 flex items-center gap-3">
                    <span className={
                      'pill !rounded-full !px-2.5 !py-1 !text-xs !font-bold ' +
                      (t.subject === 'english' ? 'bg-sky-400/15 text-sky-500 ring-sky-400/30' :
                       t.subject === 'math' ? 'bg-sun-400/15 text-soil-500 ring-sun-400/30' :
                       t.subject === 'chinese' ? 'bg-forest-400/15 text-forest-600 ring-forest-400/30' :
                       'bg-forest-100 text-forest-700 ring-forest-200')
                    }>
                      {subjectLabel(t.subject)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-forest-800 truncate">{t.title}</div>
                      <div className="text-xs text-forest-500 truncate">{t.detail}</div>
                    </div>
                    <span className="pill !py-0.5 !px-2 text-xs">⏱ {t.durationMin} 分</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {completedDays.includes(preview.day) ? (
                <button className="btn-ghost tap" onClick={() => unmarkDayDone(preview.day)}>撤销完成</button>
              ) : (
                <button className="btn-secondary tap" onClick={() => markDayDone(preview.day)}>标记为已完成</button>
              )}
              {preview.day === studyDay ? (
                <span className="btn-primary tap !bg-forest-500 !text-cream-50 cursor-default">✓ 当前正在学习这一天</span>
              ) : (
                <button className="btn-primary tap" onClick={() => { setStudyDay(preview.day); setPreview(null); navigate('/'); }}>
                  📖 学习这一天
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
