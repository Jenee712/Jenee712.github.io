import { useAppStore } from '@/store/useAppStore';
import { GRADES } from '@/data/grades';

/** 年級選擇器：7 張卡片對應 K / G1–G6，點擊切換整個工作台的內容。 */
export function GradePicker() {
  const grade = useAppStore((s) => s.grade);
  const setGrade = useAppStore((s) => s.setGrade);
  return (
    <section className="mt-6" aria-labelledby="grade-picker">
      <div className="flex items-end justify-between gap-3">
        <h2 id="grade-picker" className="type-h2">🎒 選擇年級</h2>
        <span className="pill whitespace-nowrap">7 套學習玩耍工作台 · 標準版骨架</span>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {GRADES.map((g) => {
          const active = g.key === grade;
          return (
            <button
              key={g.key}
              onClick={() => setGrade(g.key)}
              className={`card p-3 flex flex-col items-center text-center tap transition ring-2 ${active ? 'ring-forest-500 bg-forest-50' : 'ring-transparent hover:ring-forest-200'}`}
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
    </section>
  );
}
