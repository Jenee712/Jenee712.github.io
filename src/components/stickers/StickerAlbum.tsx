import type { AnimalSticker as AS } from '@/types';
import { Mascot } from '@/components/characters/Mascot';

const CHARACTER_LABEL: Record<AS['character'], string> = {
  corgi: '柯基豆豆', cat: '橘猫橙橙', rabbit: '垂耳兔点点', bear: '小熊麦麦',
  deer: '小鹿森森', penguin: '企鹅圆圆', lop: '垂耳兔', bird: '小鸟老师',
};

/**
 * 动物表情包贴纸册（成长图鉴内）。
 * - 按角色归类，显示已拥有 / 获得日期 / 解锁原因
 * - 不展示稀有度、不展示儿童之间的排名
 * - 整体尺寸放大 70%（按家长要求）让头像更清楚
 */
export function StickerAlbum({ stickers }: { stickers: AS[] }) {
  const owned = stickers.filter((s) => s.owned);
  const groups = Array.from(new Set(stickers.map((s) => s.character)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="type-h3">动物表情包贴纸册</h3>
        <span className="pill">{owned.length} / {stickers.length} 已收集</span>
      </div>

      {groups.map((ch) => {
        const items = stickers.filter((s) => s.character === ch);
        return (
          <div key={ch} className="card p-3">
            <div className="mb-3 flex items-center gap-2.5">
              <Mascot name={ch} size={61} />
              <span className="font-display font-bold text-forest-800 text-lg">{CHARACTER_LABEL[ch]}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((s) => (
                <div key={s.id} className={`rounded-barn p-2.5 ring-1 ${s.owned ? 'bg-cream-50 ring-forest-100' : 'bg-cream-100 ring-cream-200 opacity-80'}`}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-[58px] w-[58px] place-items-center rounded-full bg-cream-50 ring-1 ring-forest-100 shrink-0">
                      <Mascot name={s.character} size={58} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-display font-bold text-forest-800 text-sm">{s.title}</div>
                      <div className="text-[11px] text-forest-500">{s.owned ? `📅 ${s.unlockedAt}` : '未解锁'}</div>
                    </div>
                  </div>
                  {s.owned && s.unlockReason && (
                    <p className="mt-1.5 text-[11px] text-forest-600 line-clamp-2">原因：{s.unlockReason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
