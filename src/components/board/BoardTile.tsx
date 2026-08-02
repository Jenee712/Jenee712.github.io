import clsx from 'clsx';
import type { BoardCell } from '@/types';

interface Props {
  cell: BoardCell;
  selected?: boolean;
  onClick?: () => void;
}

/** 单个棋盘格。状态色：done / current(高亮) / locked / available。emoji 在格子里，label 放在格子下方独立显示（避免文字溢出重叠）。 */
export function BoardTile({ cell, selected, onClick }: Props) {
  const statusCls =
    cell.status === 'done' ? 'cell-done'
    : cell.status === 'current' ? 'cell-current'
    : cell.status === 'locked' ? 'cell-locked'
    : 'cell-event';
  return (
    <div className={clsx('flex flex-col items-center select-none', selected && 'scale-110 transition')}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`第 ${cell.index} 格 · ${cell.label} · ${cell.status === 'locked' ? '未解锁' : cell.status === 'current' ? '当前位置' : '已完成'}`}
        className={clsx('cell aspect-square w-11 h-11 sm:w-12 sm:h-12 text-xl rounded-barn flex items-center justify-center', statusCls, selected && 'ring-2 ring-forest-800')}
      >
        <span aria-hidden>{cell.emoji}</span>
      </button>
      <span className="text-[10px] sm:text-[11px] leading-tight text-forest-700 mt-1 max-w-[5rem] text-center whitespace-normal break-words">{cell.label}</span>
    </div>
  );
}
