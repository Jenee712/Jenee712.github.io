import { Mascot } from '@/components/characters/Mascot';
import type { AnimalSticker as AS } from '@/types';
import { AnimalSticker } from './AnimalSticker';

interface Props {
  stickers: AS[];
  selectedId?: string;
  onSelect: (s: AS) => void;
  /** 同屏最多播放（GIF）数量，超出则显示静态首帧 */
  maxPlaying?: number;
}

/**
 * 贴纸列表（缩略图网格）。点击切换大图预览。
 * 未拥有且非金币兑换类的贴纸，明确标注「未解锁」而不使用抽卡/盲盒措辞。
 */
export function StickerGrid({ stickers, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {stickers.map((s) => (
        <AnimalSticker
          key={s.id}
          sticker={s}
          size={129}
          selected={s.id === selectedId}
          onClick={() => onSelect(s)}
        />
      ))}
    </div>
  );
}

/** 小动物图标（用于奖励页/结算页的小标识） */
export function StickerGlyph({ character, size = 28 }: { character: AS['character']; size?: number }) {
  return <Mascot name={character} size={size} />;
}
