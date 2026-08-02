import { useState } from 'react';
import { Mascot } from '@/components/characters/Mascot';
import type { AnimalSticker as AS } from '@/types';
import { usePrefersReducedMotion, useInView } from '@/lib/hooks';

interface Props {
  sticker: AS;
  size?: number;
}

/**
 * 动态动物表情包大图预览。
 * - 进入可视区域且未开启「减少动态」→ 尝试加载 GIF（animatedSrc）
 * - GIF 加载失败 / 不存在 → 降级为原创 SVG 角色 + 轻微浮动（CSS）
 * - 开启「减少动态」→ 始终显示静态 SVG（不播放循环动画）
 * 单图展示用，无需限制同屏数量；列表缩略图由 StickerGrid 控制暂停。
 */
export function AnimatedStickerPreview({ sticker, size = 180 }: Props) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [imgOk, setImgOk] = useState(true);

  const showGif = inView && !reduced && imgOk && !!sticker.animatedSrc;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={sticker.altText}
      className="relative grid place-items-center rounded-cloud bg-cream-50 ring-1 ring-forest-100 shadow-soft"
      style={{ width: size, height: size }}
    >
      {showGif ? (
        <img
          src={sticker.animatedSrc}
          alt={sticker.altText}
          className="h-full w-full object-contain"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div className={reduced ? '' : 'animate-floaty'}>
          <Mascot name={sticker.character} size={Math.min(size - 16, 160)} />
        </div>
      )}
    </div>
  );
}
