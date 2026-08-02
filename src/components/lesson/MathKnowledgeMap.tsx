import clsx from 'clsx';
import type { MathTopic, SkillProgress } from '@/types';
import { mathTopics } from '@/data/curriculum';

interface Props {
  progress: SkillProgress[];
  currentTopic?: MathTopic;
  onContinue?: () => void;
}

const ICON: Record<MathTopic, string> = {
  counting: '🔢', add_sub: '➕', shapes: '🔺', compare: '⚖️', clock: '🕐', chart: '📊',
};

/** 数学六类知识地图（数→加减→形状→比较→时钟→图表）。 */
export function MathKnowledgeMap({ progress, currentTopic, onContinue }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {mathTopics.map((t, i) => {
          const p = progress.find((x) => x.key === t.id);
          const mastery = Math.round((p?.mastery ?? 0) * 100);
          const isCurrent = t.id === currentTopic;
          return (
            <div
              key={t.id}
              className={clsx('card-leaf p-3 relative', isCurrent && 'ring-2 ring-forest-500')}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cream-50 text-lg" aria-hidden>{ICON[t.id]}</span>
                <div>
                  <div className="font-display font-bold text-forest-800 text-sm">{t.label}</div>
                  <div className="text-[10px] text-forest-500">第 {i + 1} 站</div>
                </div>
              </div>
              <div className="mt-2 progress-track">
                <div className="progress-fill bg-sun-500" style={{ width: `${mastery}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      {onContinue && (
        <button type="button" onClick={onContinue} className="btn-secondary tap w-full sm:w-auto">继续数学 →</button>
      )}
    </div>
  );
}
