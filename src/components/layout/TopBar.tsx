import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { gradeDef } from '@/data/grades';

/** Top progress bar — daily plan completion percentage. */
export function TopBar() {
  const navigate = useNavigate();
  const kid = useAppStore(s => s.kid);
  const grade = useAppStore(s => s.grade);
  const pct = Math.min(100, Math.round((kid.todayMinutes / Math.max(1, kid.todayGoalMin)) * 100));
  const lessonPct = Math.round((kid.todayLessonsDone / Math.max(1, kid.todayLessonsGoal)) * 100);
  const gdef = gradeDef(grade);
  return (
    <header
      className="sticky top-0 z-30 bg-cream-50/85 backdrop-blur border-b border-forest-100"
      role="banner"
    >
      <div className="flex items-center gap-4 px-4 md:px-8 h-14">
        {/* Mobile brand */}
        <div className="md:hidden flex items-center gap-2">
          <span className="w-8 h-8 rounded-leaf bg-forest-600 flex items-center justify-center">
            <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden>
              <path fill="#FBF8EF" d="M16 2C8 2 4 9 4 16c0 7 5 12 12 14 7-2 12-7 12-14 0-7-4-14-12-14z"/>
            </svg>
          </span>
          <span className="font-display font-extrabold text-forest-800">小狗的森林学习站</span>
        </div>

        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between text-[11px] text-forest-600 mb-1">
            <span>今日 {kid.todayMinutes} / {kid.todayGoalMin} 分钟</span>
            <span>{kid.todayLessonsDone} / {kid.todayLessonsGoal} 关</span>
          </div>
          <div className="progress-track" aria-label="今日学习进度">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="pill pill-forest tap"
            title="切換年級"
            aria-label={`目前年級：${gdef.fullLabel}，點擊回首頁切換`}
          >
            <span aria-hidden>{gdef.emoji}</span><span>{gdef.label}</span>
          </button>
          <div className="pill pill-sun" title="金币">
            <span aria-hidden>🪙</span><span>{kid.coins}</span>
          </div>
          <div className="pill pill-sky" title="连续打卡">
            <span aria-hidden>🔥</span><span>{kid.streakDays} 天</span>
          </div>
        </div>
      </div>
    </header>
  );
}
