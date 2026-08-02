import clsx from 'clsx';
import { Mascot } from '@/components/characters/Mascot';
import type { AnimalSticker as AS } from '@/types';

interface Props {
  sticker: AS;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * 单个动物表情包贴纸（缩略图）。
 * 正式素材由用户提供的 GIF/PNG 决定；未提供时降级为原创 SVG 角色 + 文字标签，
 * 不使用系统 Emoji 作为正式素材。
 */
export function AnimalSticker({ sticker, size = 143, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${sticker.character} · ${sticker.title} · ${sticker.owned ? '已拥有' : '未解锁'}`}
      className={clsx(
        'group relative flex flex-col items-center gap-1 rounded-barn p-2 tap transition',
        onClick && 'cursor-pointer',
        selected ? 'ring-2 ring-forest-600 bg-forest-50' : 'ring-1 ring-forest-100 bg-cream-50 hover:bg-forest-50',
        !sticker.owned && 'opacity-90',
      )}
    >
      <span
        className={clsx(
          'relative grid place-items-center rounded-full bg-cream-50 ring-1 ring-forest-100 shadow-soft',
          !sticker.owned && 'grayscale-[0.3]',
        )}
        style={{ width: size, height: size }}
      >
        <Mascot name={sticker.character} size={size - 14} />
        {sticker.owned && (
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-forest-600 text-cream-50 text-xs shadow-soft">✓</span>
        )}
      </span>
      <span className="text-center leading-tight">
        <span className="block font-display font-bold text-forest-800 text-sm">{sticker.title}</span>
        <span className="block text-[11px] text-forest-500">{sticker.emotion}</span>
      </span>
      {!sticker.owned && sticker.unlockType === 'coins' && sticker.coinCost != null && (
        <span className="pill pill-sun !py-0.5 !px-2 text-[11px]">🪙 {sticker.coinCost}</span>
      )}
    </button>
  );
}
