import clsx from 'clsx';
import type { SkillTrack, SkillProgress } from '@/types';
import { englishTracks } from '@/data/curriculum';

interface Props {
  progress: SkillProgress[];
  currentTrack?: SkillTrack;
  onContinue?: () => void;
}

/** 英语六类稳定技能路线（字母→Phonics→Sight→主题词→句型→绘本）。 */
export function EnglishSkillPath({ progress, currentTrack, onContinue }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {englishTracks.map((t) => {
          const p = progress.find((x) => x.key === t.id);
          const mastery = Math.round((p?.mastery ?? 0) * 100);
          const isCurrent = t.id === currentTrack;
          return (
            <div key={t.id} className={clsx('card p-3', isCurrent && 'ring-2 ring-forest-500')}>
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-forest-800">{t.label}</span>
                {isCurrent && <span className="pill pill-sun !py-0.5 !px-2 text-[11px]">继续</span>}
              </div>
              <div className="mt-2 progress-track">
                <div className="progress-fill bg-forest-500" style={{ width: `${mastery}%` }} />
              </div>
              <div className="mt-1 text-[11px] text-forest-500">掌握度 {mastery}%</div>
            </div>
          );
        })}
      </div>
      {onContinue && (
        <button type="button" onClick={onContinue} className="btn-secondary tap w-full sm:w-auto">继续下一关 →</button>
      )}
    </div>
  );
}
