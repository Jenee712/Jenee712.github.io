import type { ChildProfile } from '@/types';

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="card px-3 py-2 flex flex-col justify-center">
      <span className="text-[11px] text-forest-500">{label}</span>
      <span className={`font-display font-bold ${tone ?? 'text-forest-800'} text-lg leading-tight`}>{value}</span>
      {sub && <span className="text-[10px] text-forest-400">{sub}</span>}
    </div>
  );
}

/** 首页顶部状态条：今日时长 / 关卡 / 打卡 / 金币 / 等级 */
export function LearningStatusHeader({ kid }: { kid: ChildProfile }) {
  const pct = Math.min(100, Math.round((kid.todayMinutes / kid.todayGoalMin) * 100));
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      <Stat label="今日学习" value={`${kid.todayMinutes} 分`} sub={`目标 ${kid.todayGoalMin} 分 · ${pct}%`} tone="text-forest-700" />
      <Stat label="今日关卡" value={`${kid.todayLessonsDone} / ${kid.todayLessonsGoal}`} sub="已完成 / 目标" />
      <Stat label="连续打卡" value={`${kid.streakDays} 天`} sub="小鹿在等你 🦌" tone="text-sun-500" />
      <Stat label="森林金币" value={`🪙 ${kid.coins}`} sub="只换虚拟贴纸" tone="text-soil-500" />
      <Stat label="等级" value={`Lv.${kid.level}`} sub={`${kid.xp} 经验`} tone="text-sky-500" />
    </div>
  );
}
