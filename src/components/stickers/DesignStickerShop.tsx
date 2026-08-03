import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { StickerCrop } from '@/components/ui/StickerCrop';
import { DESIGN_STICKERS, type DesignStickerCategory } from '@/data/designStickers';
import { useAppStore } from '@/store/useAppStore';

type Filter = 'all' | 'mine' | DesignStickerCategory;
const OWNED_KEY = 'ff_design_stickers_v1';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: '✨ 全部' },
  { id: 'animals', label: '🐰 动物' },
  { id: 'nature', label: '🌼 花草' },
  { id: 'treats', label: '🍪 美食' },
  { id: 'cheer', label: '🌈 鼓励语' },
  { id: 'mine', label: '🎒 我的贴纸' },
];

function loadOwned(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(OWNED_KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch { return []; }
}

export function DesignStickerShop() {
  const [filter, setFilter] = useState<Filter>('all');
  const [owned, setOwned] = useState<string[]>(loadOwned);
  const [message, setMessage] = useState('每张贴纸都可以单独购买，购买记录保存在当前设备。');
  const coins = useAppStore((state) => state.kid.coins);

  const visible = useMemo(() => DESIGN_STICKERS.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'mine') return owned.includes(item.id);
    return item.category === filter;
  }), [filter, owned]);

  const buy = (id: string, title: string, cost: number) => {
    if (owned.includes(id)) return;
    if (coins < cost) {
      setMessage(`还差 ${cost - coins} 枚金币，完成学习任务就能继续买啦。`);
      return;
    }
    const next = [...owned, id];
    setOwned(next);
    try { localStorage.setItem(OWNED_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    useAppStore.setState((state) => ({ kid: { ...state.kid, coins: state.kid.coins - cost } }));
    setMessage(`“${title}”已经放进你的贴纸口袋！`);
  };

  return (
    <section className="design-sticker-shop" aria-labelledby="design-sticker-shop-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="sticker-kicker">NEW · 第二轮贴纸商店</span>
          <h2 id="design-sticker-shop-heading" className="mt-2 type-h2">一张一张，挑喜欢的买</h2>
          <p className="mt-1 text-sm text-forest-600">整版素材已拆成 {DESIGN_STICKERS.length} 张独立贴纸，可按类型筛选。</p>
        </div>
        <div className="design-coin-balance" aria-label={`现有 ${coins} 枚森林金币`}>🪙 {coins} 金币</div>
      </div>

      <div className="design-sticker-filters" role="tablist" aria-label="贴纸分类">
        {FILTERS.map((item) => (
          <button key={item.id} role="tab" aria-selected={filter === item.id} onClick={() => setFilter(item.id)} className={clsx(filter === item.id && 'is-active')}>
            {item.label}{item.id === 'mine' ? ` ${owned.length}` : ''}
          </button>
        ))}
      </div>

      <p className="design-shop-message" aria-live="polite">{message}</p>

      {visible.length ? (
        <div className="design-sticker-grid">
          {visible.map((item) => {
            const isOwned = owned.includes(item.id);
            return (
              <article key={item.id} className={clsx('design-sticker-card', isOwned && 'is-owned')}>
                <StickerCrop sheet={item.sheet} position={item.position} zoom={item.zoom} label={`${item.title}贴纸`} className="design-sticker-art" />
                <h3>{item.title}</h3>
                <button type="button" disabled={isOwned} onClick={() => buy(item.id, item.title, item.cost)}>
                  {isOwned ? '✓ 已收藏' : `🪙 ${item.cost} 购买`}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="design-shop-empty">还没有购买贴纸，先从“全部”里挑一张吧。</div>
      )}

      <details className="design-sheet-source">
        <summary>查看第二轮 7 张整版原素材</summary>
        <div>
          {[
            ['autumn-cozy.jpg', '秋日伙伴'], ['autumn-botany.jpg', '秋日花草'], ['chocolate-friends.jpg', '巧克力甜点'],
            ['kind-words.jpg', '彩色鼓励语'], ['spring-friends.jpg', '春日伙伴'], ['breakfast-friends.jpg', '早餐朋友'], ['happy-day.jpg', '快乐每一天'],
          ].map(([file, title]) => {
            const src = `${import.meta.env.BASE_URL}assets/sticker-sheets/${file}`;
            return <a key={file} href={src} target="_blank" rel="noreferrer"><img src={src} alt={`${title}整版贴纸`} loading="lazy" /><span>{title}</span></a>;
          })}
        </div>
      </details>
    </section>
  );
}
