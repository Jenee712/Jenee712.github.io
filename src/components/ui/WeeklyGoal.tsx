import type { WeeklyReward } from '@/types';
import { Mascot } from '@/components/characters/Mascot';

interface Props {
  reward: WeeklyReward;
  onClaim: (id: string) => void;
}

/** 周末周目标卡片（达成后领取步数 / 贴纸）。 */
export function WeeklyGoal({ reward, onClaim }: Props) {
  return (
    <div className={`card p-3 flex items-center gap-3 ${reward.achieved ? 'ring-2 ring-forest-500' : ''}`}>
      <Mascot name={reward.stickerId?.startsWith('deer') ? 'deer' : 'corgi'} size={48} />
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-forest-800">{reward.title}</div>
        <div className="text-xs text-forest-500">{reward.condition}{reward.stepReward ? ` · +${reward.stepReward} 步` : ''}</div>
      </div>
      {reward.achieved ? (
        <span className="pill">🎉 已达成</span>
      ) : (
        <button type="button" onClick={() => onClaim(reward.id)} className="btn-secondary tap">领取</button>
      )}
    </div>
  );
}
