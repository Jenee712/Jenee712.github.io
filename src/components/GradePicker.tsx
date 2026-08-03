import { useAppStore } from '@/store/useAppStore';
import { GRADES } from '@/data/grades';
import { gradeDef } from '@/data/grades';

/** 年級選擇器：7 張卡片對應 K / G1–G6，點擊切換整個工作台的內容。 */
export function GradePicker() {
  const grade = useAppStore((s) => s.grade);
  const setGrade = useAppStore((s) => s.setGrade);
  const current = gradeDef(grade);
  return (
    <details className="card mt-5 overflow-hidden" aria-labelledby="grade-picker">
      <summary className="summary-row">
        <span><strong id="grade-picker" className="font-display text-xl text-forest-800">🎒 当前：{current.fullLabel}</strong><span className="mt-0.5 block text-sm text-forest-500">点击切换其他年级</span></span>
        <span className="summary-chevron" aria-hidden>⌄</span>
      </summary>
      <div className="grid grid-cols-2 gap-3 px-4 pb-4 sm:grid-cols-4 sm:px-5 sm:pb-5 lg:grid-cols-7">
        {GRADES.map((g) => {
          const active = g.key === grade;
          return (
            <button
              key={g.key}
              onClick={() => setGrade(g.key)}
              className={`grade-card ${active ? 'grade-card-active' : ''}`}
              aria-pressed={active}
            >
              <span className="text-3xl" aria-hidden>{g.emoji}</span>
              <span className="font-display font-extrabold text-forest-800 mt-1">{g.label}</span>
              <span className="text-xs text-forest-500 mt-0.5">{g.ageRange}</span>
              <span className="text-[11px] text-forest-600/80 mt-1 leading-tight">{g.tagline}</span>
            </button>
          );
        })}
      </div>
    </details>
  );
}
