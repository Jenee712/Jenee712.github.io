import clsx from 'clsx';
import type { BoardCell, BoardEvent } from '@/types';

interface Props {
  cell: BoardCell;
  event?: BoardEvent;
  canClaim: boolean;
  onClaim: () => void;
}

const STATUS_TEXT: Record<BoardCell['status'], string> = {
  done: '已完成', current: '当前位置', available: '可以领取', locked: '还没走到',
};

const STATUS_CLS: Record<BoardCell['status'], string> = {
  done: 'bg-forest-500 text-cream-50', current: 'bg-sun-400 text-forest-900', available: 'bg-forest-100 text-forest-700', locked: 'bg-cream-200 text-forest-400',
};

/** 点击格子后的事件详情面板。 */
export function BoardEventDetail({ cell, event, canClaim, onClaim }: Props) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>{cell.emoji}</span>
        <div>
          <h3 className="type-h3">{cell.title}</h3>
          <span className={clsx('pill !py-0.5 !px-2 text-[11px]', STATUS_CLS[cell.status])}>{STATUS_TEXT[cell.status]}</span>
        </div>
      </div>
      <p className="mt-2 type-body text-forest-600">{cell.desc}</p>
      {cell.rewardText && (
        <div className="mt-2 pill pill-sun">🎁 {cell.rewardText}</div>
      )}
      {event?.completedAt && (
        <p className="mt-2 text-[11px] text-forest-400">已完成于 {event.completedAt.slice(0, 10)}</p>
      )}
      {canClaim && (
        <button type="button" onClick={onClaim} className="btn-primary tap mt-3 w-full">
          领取奖励 🌿
        </button>
      )}
      {!canClaim && cell.status === 'locked' && (
        <p className="mt-3 text-xs text-forest-400">继续完成今天的学习，就能走到这一格啦。</p>
      )}
    </div>
  );
}
