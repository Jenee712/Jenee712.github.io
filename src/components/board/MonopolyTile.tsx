import clsx from 'clsx';
import type { MonopolyCell } from '@/types';
import { MONO_COLOR_GROUPS } from '@/data/monopoly';

interface Props {
  cell: MonopolyCell;
  ownedByPlayer?: boolean;
  onClick?: () => void;
}

/** 大富翁单格。彩色产权地顶部有颜色条 + 价格 + 地主标志；角格/卡牌格特殊样式。 */
export function MonopolyTile({ cell, ownedByPlayer, onClick }: Props) {
  const color = cell.colorGroup ? MONO_COLOR_GROUPS[cell.colorGroup] : undefined;
  const isCorner = cell.kind === 'go' || cell.kind === 'jail' || cell.kind === 'park' || cell.kind === 'fountain';

  // 地主角标
  let badge: string | null = null;
  if (cell.kind === 'property' && ownedByPlayer) badge = '🏠';
  else if (cell.kind === 'animal') badge = cell.npc === 'bear' ? '🐻' : cell.npc === 'rabbit' ? '🐰' : '🐱';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`第 ${cell.index} 格 ${cell.label}`}
      className={clsx(
        'group relative w-full h-full flex flex-col items-center justify-center rounded-[6px] border text-center overflow-hidden transition select-none',
        'border-forest-200 bg-cream-50 hover:ring-2 hover:ring-forest-400',
        isCorner && 'bg-forest-100',
        cell.kind === 'chance' && 'bg-sun-400/30',
        cell.kind === 'fortune' && 'bg-berry/25',
        cell.kind === 'fountain' && 'bg-sky-300/40',
      )}
    >
      {/* 产权地颜色条 */}
      {cell.kind === 'property' && color && (
        <span className="absolute top-0 left-0 right-0 h-[34%]" style={{ background: color.hex }} aria-hidden />
      )}

      {/* 角标（地主 / 动物） */}
      {badge && (
        <span className="absolute top-[1px] right-[1px] text-[10px] leading-none" aria-hidden>{badge}</span>
      )}

      <span className={clsx('leading-none', isCorner ? 'text-base sm:text-xl' : 'text-sm sm:text-base')} aria-hidden>
        {cell.emoji}
      </span>

      <span className="mt-0.5 px-0.5 text-[7px] sm:text-[8px] leading-[1.05] text-forest-800 font-medium truncate w-full">
        {cell.label}
      </span>

      {cell.kind === 'property' && (
        <span className="text-[7px] sm:text-[8px] text-forest-500 leading-none mt-0.5">${cell.price}</span>
      )}
      {cell.kind === 'animal' && (
        <span className="text-[7px] sm:text-[8px] text-forest-500 leading-none mt-0.5">租${cell.rent}</span>
      )}
    </button>
  );
}
