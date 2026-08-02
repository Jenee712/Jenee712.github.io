import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { StickerGrid } from '@/components/stickers/StickerGrid';
import { AnimatedStickerPreview } from '@/components/stickers/AnimatedStickerPreview';
import { Mascot } from '@/components/characters/Mascot';
import type { AnimalSticker } from '@/types';

const UNLOCK_LABEL: Record<AnimalSticker['unlockType'], string> = {
  daily_task: '完成每日任务', streak: '连续打卡', unit_complete: '完成单元',
  review: '复习小花园', board: '森林棋盘', weekly_goal: '达成周目标', coins: '金币兑换',
};

/** 奖励小屋（/rewards）。查看动物表情包贴纸、了解解锁方式，金币可兑换指定贴纸。不使用抽卡/盲盒。 */
export function RewardPage() {
  const nav = useNavigate();
  const stickers = useAppStore((s) => s.stickers);
  const coins = useAppStore((s) => s.kid.coins);
  const exchange = useAppStore((s) => s.exchangeSticker);

  const [selectedId, setSelectedId] = useState<string>(
    () => stickers.find((s) => s.owned)?.id ?? stickers[0]?.id ?? '',
  );
  const [msg, setMsg] = useState<string>('');

  const selected = useMemo(() => stickers.find((s) => s.id === selectedId), [stickers, selectedId]);
  const ownedCount = stickers.filter((s) => s.owned).length;

  const canExchange = !!selected && !selected.owned && selected.unlockType === 'coins' && coins >= (selected.coinCost ?? 0);

  const onExchange = async () => {
    if (!selected) return;
    const ok = await exchange(selected.id);
    setMsg(ok ? `🎉 已用金币兑换「${selected.title}」！` : '金币还不够哦，再多完成几个任务吧～');
  };

  return (
    <div className="container-forest pt-6 pb-10">
      <header className="card-leaf p-5 flex flex-col md:flex-row md:items-center gap-4">
        <Mascot name="corgi" size={84} animated />
        <div className="flex-1">
          <h1 className="type-h1">奖励小屋 🎁</h1>
          <p className="type-body text-forest-700/90 mt-1">这里收集你的动物表情包贴纸。学习获得的贴纸会自动收藏，森林金币还能兑换特别款。</p>
        </div>
        <span className="pill pill-sun self-start md:self-auto whitespace-nowrap">🪙 {coins} 金币</span>
      </header>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 大图预览 + 兑换 */}
        <aside className="card p-5 lg:order-2">
          {selected ? (
            <div className="text-center">
              <div className="grid place-items-center">
                <AnimatedStickerPreview sticker={selected} size={180} />
              </div>
              <h2 className="type-h2 mt-3">{selected.title}</h2>
              <p className="text-sm text-forest-500">{selected.emotion} · {selected.description}</p>

              <div className="mt-3">
                {selected.owned ? (
                  <div>
                    <span className="pill pill-sun">✅ 已收集</span>
                    {selected.unlockReason && <p className="mt-2 text-[12px] text-forest-500">获得原因：{selected.unlockReason}</p>}
                  </div>
                ) : selected.unlockType === 'coins' ? (
                  <button
                    type="button"
                    onClick={onExchange}
                    disabled={!canExchange}
                    className={`tap w-full ${canExchange ? 'btn-primary' : 'btn-secondary opacity-70'}`}
                  >
                    🪙 用 {selected.coinCost} 金币兑换
                  </button>
                ) : (
                  <div>
                    <span className="pill">未解锁</span>
                    <p className="mt-2 text-[12px] text-forest-500">解锁方式：{UNLOCK_LABEL[selected.unlockType]}</p>
                  </div>
                )}
              </div>
              {msg && <p className="mt-3 text-sm font-display font-bold text-forest-700">{msg}</p>}
            </div>
          ) : (
            <p className="text-sm text-forest-500">还没有贴纸，完成今天的学习来收集第一张吧！</p>
          )}
        </aside>

        {/* 贴纸墙 */}
        <section className="card p-5 lg:col-span-2 lg:order-1">
          <div className="flex items-center justify-between">
            <h2 className="type-h3">动物表情包贴纸</h2>
            <span className="pill">{ownedCount} / {stickers.length} 已收集</span>
          </div>
          <div className="mt-4">
            <StickerGrid
              stickers={stickers}
              selectedId={selectedId}
              onSelect={(s) => { setSelectedId(s.id); setMsg(''); }}
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => nav('/album')} className="btn-secondary tap">去成长图鉴看贴纸册 →</button>
            <button type="button" onClick={() => nav('/')} className="btn-ghost tap">回到首页</button>
          </div>
        </section>
      </div>
    </div>
  );
}
