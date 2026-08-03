import { useState } from 'react';
import clsx from 'clsx';
import { useAppStore } from '@/store/useAppStore';
import { Mascot } from '@/components/characters/Mascot';
import { KnowledgeCollection } from '@/components/ui/KnowledgeCollection';
import { StickerAlbum } from '@/components/stickers/StickerAlbum';
import { PortfolioCard } from '@/components/ui/PortfolioCard';
import { useSearchParams } from 'react-router-dom';
import { DesignStickerShop } from '@/components/stickers/DesignStickerShop';

type Tab = 'knowledge' | 'stickers' | 'works' | 'milestones';

export function GrowthAlbumPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>(() => searchParams.get('tab') === 'stickers' ? 'stickers' : 'knowledge');
  const stickers = useAppStore((s) => s.stickers);
  const knowledge = useAppStore((s) => s.knowledge);
  const portfolio = useAppStore((s) => s.portfolio);
  const kid = useAppStore((s) => s.kid);

  const owned = stickers.filter((s) => s.owned).length;

  return (
    <div className="container-forest pt-6">
      <header className="card-leaf p-5 flex flex-col md:flex-row md:items-center gap-4">
        <Mascot name="lop" size={88} animated />
        <div className="flex-1">
          <h1 className="type-h1">成长图鉴 📒</h1>
          <p className="type-body text-forest-700/90 mt-1">看看你收集的知识、贴纸、作品和里程碑。</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="pill">🪙 {kid.coins}</span>
          <span className="pill pill-sun">⭐ {owned}/{stickers.length}</span>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist">
        {[
          { id: 'knowledge', label: '知识收藏', emoji: '📚' },
          { id: 'stickers', label: '动物贴纸册', emoji: '🦊' },
          { id: 'works', label: '我的作品袋', emoji: '🎨' },
          { id: 'milestones', label: '阶段里程碑', emoji: '🏁' },
        ].map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id as Tab)}
            className={clsx(
              'px-4 py-2 rounded-barn font-display font-semibold tap transition',
              tab === t.id ? 'bg-forest-700 text-cream-50 shadow-soft' : 'bg-cream-50 ring-1 ring-forest-200 text-forest-700',
            )}
          >
            <span aria-hidden className="mr-1">{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === 'knowledge' && <KnowledgeCollection collection={knowledge} />}
        {tab === 'stickers' && (
          <div className="space-y-5">
            <DesignStickerShop />
            <SuppliedStickerCollection />
            <section>
              <h2 className="type-h2 mb-3">森林动物贴纸</h2>
              <StickerAlbum stickers={stickers} />
            </section>
          </div>
        )}
        {tab === 'works' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {portfolio.map((p) => <PortfolioCard key={p.id} item={p} />)}
          </div>
        )}
        {tab === 'milestones' && <Milestones kid={kid} />}
      </div>
    </div>
  );
}

function SuppliedStickerCollection() {
  const base = import.meta.env.BASE_URL;
  const sheets = [
    { file: 'garden-friends.jpg', title: '花园好朋友', detail: '花朵、蝴蝶和可爱动物' },
    { file: 'birthday-party.jpg', title: '生日派对', detail: '礼物、蛋糕、气球和祝福' },
    { file: 'pink-buddies.jpg', title: '粉色伙伴', detail: '小兔、小熊、蝴蝶结和爱心' },
    { file: 'snack-time.jpg', title: '点心补给站', detail: '冰淇淋、饼干和早餐点心' },
  ];

  return (
    <section className="supplied-sticker-album" aria-labelledby="supplied-stickers-heading">
      <div>
        <span className="sticker-kicker">保留 · 第一轮贴纸</span>
        <h2 id="supplied-stickers-heading" className="mt-2 type-h2">第一轮小易设计贴纸</h2>
        <p className="mt-1 text-sm text-forest-600">之前加入的四套原始贴纸完整保留，点击图片可以查看大图。</p>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {sheets.map((sheet) => {
          const src = `${base}assets/sticker-sheets/${sheet.file}`;
          return (
            <a key={sheet.file} href={src} target="_blank" rel="noreferrer" className="supplied-sticker-card">
              <img src={src} alt={`${sheet.title}贴纸整版`} loading="lazy" />
              <span><strong>{sheet.title}</strong><small>{sheet.detail}</small></span>
              <b aria-hidden>放大 ↗</b>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function Milestones({ kid }: { kid: { level: number; streakDays: number; totalDays: number } }) {
  const items = [
    { e: '🌱', t: '第一次学习', d: '第 1 天', done: true },
    { e: '🔥', t: `连续打卡 ${kid.streakDays} 天`, d: kid.streakDays >= 7 ? '已达成' : '进行中', done: kid.streakDays >= 7 },
    { e: '📚', t: `学习 ${kid.totalDays} 天`, d: '累积中', done: kid.totalDays >= 10 },
    { e: '🏅', t: `到达 Lv.${kid.level}`, d: '升等级啦', done: true },
    { e: '🏁', t: '走完一圈森林棋盘', d: '周末大奖', done: false },
  ];
  return (
    <div className="card p-5">
      <h3 className="type-h3">阶段里程碑</h3>
      <ul className="mt-4 space-y-3">
        {items.map((m, i) => (
          <li key={i} className="flex items-center gap-3 card-barn p-3">
            <span className="text-3xl" aria-hidden>{m.e}</span>
            <div className="flex-1">
              <div className="font-display font-bold text-forest-800">{m.t}</div>
              <div className="text-sm text-forest-600/80">{m.d}</div>
            </div>
            <span className={m.done ? 'pill pill-sun' : 'pill'}>{m.done ? '已达成' : '进行中'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
