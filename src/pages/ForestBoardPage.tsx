import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Mascot } from '@/components/characters/Mascot';
import { MonopolyBoard } from '@/components/board/MonopolyBoard';
import { monoCells, MONO_COLOR_GROUPS } from '@/data/monopoly';

export function ForestBoardPage() {
  const m = useAppStore((s) => s.monopoly);
  const monoRoll = useAppStore((s) => s.monoRoll);
  const monoBuy = useAppStore((s) => s.monoBuy);
  const monoReset = useAppStore((s) => s.monoReset);
  const monoClearCard = useAppStore((s) => s.monoClearCard);
  const monoGrantAllowance = useAppStore((s) => s.monoGrantAllowance);
  const navigate = useNavigate();

  const [selected, setSelected] = useState<number | undefined>(m.pos);
  const cur = monoCells.find((c) => c.index === m.pos)!;
  const sel = monoCells.find((c) => c.index === selected);

  // 每次打开棋盘补发 20 个骰子（若上一轮已用完且未学习则不补，需先去学习）
  useEffect(() => {
    monoGrantAllowance();
  }, [monoGrantAllowance]);

  const canRoll = m.inTreeHole <= 0 && (m.dice > 0 || m.extraRoll) && !m.animating;
  const noDiceLeft = m.dice <= 0 && !m.extraRoll && m.inTreeHole <= 0;
  const canBuyHere = cur.kind === 'property' && cur.owner === null && m.monoCoins >= (cur.price ?? 0);

  return (
    <div className="container-forest pt-6">
      <header className="card-leaf p-5 flex flex-col md:flex-row md:items-center gap-4">
        <Mascot name="deer" size={76} animated />
        <div className="flex-1 min-w-0">
          <h1 className="type-h1">森林大富翁 🎲</h1>
          <p className="type-body text-forest-700/90 mt-1">掷骰子沿森林走一圈，用大富翁金币买下喜欢的领地，经过自己地收租、路过动物地付租！</p>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
          <span className="pill pill-sky whitespace-nowrap">🎲 骰子 {m.dice} / 20</span>
          <span className="pill pill-sun whitespace-nowrap">🪙 {m.monoCoins}</span>
        </div>
      </header>

      {m.inTreeHole > 0 && (
        <div className="mt-4 card p-3 text-center text-forest-700">🌳 你在树洞休息（还剩 {m.inTreeHole} 回合），暂时不能掷骰子。</div>
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 棋盘 */}
        <section className="card p-4 lg:col-span-2">
          <MonopolyBoard cells={monoCells} pos={m.pos} owned={m.owned} onCellClick={setSelected} />
          <div className="mt-3 flex items-center justify-center gap-3">
            {m.lastRoll && (
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-barn bg-cream-100 ring-1 ring-forest-200 text-2xl font-display font-extrabold text-forest-800 animate-pop">
                {m.lastRoll[0]}
              </span>
            )}
            <button
              className="btn-primary-lg disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!canRoll}
              onClick={monoRoll}
            >
              {m.animating ? '🐾 走棋中…' : `🎲 掷骰子 ${m.extraRoll ? '（再掷一次）' : ''}`}
            </button>
            <button className="btn-ghost" onClick={monoReset}>重开</button>
          </div>
          <p className="text-center text-xs text-forest-400 mt-2">点格子看说明 · 每次打开棋盘补发 20 个骰子，用完需学习一轮再来兑换 🎲</p>
        </section>

        {/* 右侧：当前格 / 详情 / 日志 */}
        <aside className="flex flex-col gap-4">
          {/* 当前所在格 */}
          <section className="card p-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>{cur.emoji}</span>
              <div>
                <div className="font-display font-bold text-forest-800">{cur.label}</div>
                <div className="text-xs text-forest-500">第 {m.pos + 1} 格</div>
              </div>
            </div>
            <p className="text-sm text-forest-700 mt-2">{cur.desc}</p>

            {cur.kind === 'property' && cur.owner === null && (
              <button
                className="btn-primary mt-3 w-full disabled:opacity-40"
                disabled={!canBuyHere}
                onClick={() => monoBuy(m.pos)}
              >
                🏠 买下这块地（{cur.price} 金币）
              </button>
            )}
            {cur.kind === 'property' && m.owned.includes(m.pos) && (
              <p className="mt-3 text-sm text-forest-600">✅ 这是你的领地，路过收租 +{cur.rent} 金币。</p>
            )}
            {cur.kind === 'animal' && (
              <p className="mt-3 text-sm text-forest-600">🐾 动物领地：路过要付 {cur.rent} 金币租金。</p>
            )}
          </section>

          {/* 点选格详情 */}
          {sel && sel.index !== m.pos && (
            <section className="card p-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden>{sel.emoji}</span>
                <div className="font-display font-bold text-forest-800">{sel.label}</div>
              </div>
              <p className="text-sm text-forest-700 mt-2">{sel.desc}</p>
              {sel.kind === 'property' && sel.colorGroup && (
                <p className="mt-2 text-xs text-forest-500">
                  颜色组：<span className="font-semibold" style={{ color: MONO_COLOR_GROUPS[sel.colorGroup].hex }}>{MONO_COLOR_GROUPS[sel.colorGroup].name}</span>
                  · 地价 {sel.price} · 租金 {sel.rent}
                </p>
              )}
            </section>
          )}

          {/* 日志 */}
          <section className="card p-5">
            <h2 className="type-h3">森林日记</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-forest-700 max-h-52 overflow-y-auto pr-1">
              {m.log.map((line, i) => (
                <li key={i} className={i === 0 ? 'font-medium text-forest-800' : ''}>{line}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* 卡牌弹窗 */}
      {m.pendingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 p-4" onClick={monoClearCard}>
          <div
            className={`card p-6 max-w-sm w-full text-center animate-pop ${m.pendingCard.type === 'chance' ? 'ring-2 ring-sun-400' : 'ring-2 ring-berry/50'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-display font-bold mb-2" style={{ color: m.pendingCard.type === 'chance' ? '#E0A92E' : '#C76FA0' }}>
              {m.pendingCard.type === 'chance' ? '🍀 森林奇遇' : '🔮 森林考验'}
            </div>
            <p className="text-forest-800 type-body">{m.pendingCard.text}</p>
            <button className="btn-primary-lg mt-5 w-full" onClick={monoClearCard}>好嘞！</button>
          </div>
        </div>
      )}

      {/* 骰子用完弹窗 */}
      {noDiceLeft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-900/40 p-4">
          <div className="card p-7 max-w-sm w-full text-center animate-pop ring-2 ring-forest-300">
            <div className="text-5xl mb-3">🌳🎲</div>
            <h2 className="type-h3 text-forest-800">不能玩啦</h2>
            <p className="text-forest-700 mt-2 type-body">20 个骰子点数已经用完～<br />请学习一轮再来兑换点数！</p>
            <div className="mt-5 flex flex-col gap-2">
              <button className="btn-primary-lg w-full" onClick={() => navigate('/')}>📚 去学习一轮</button>
              <button className="btn-ghost w-full" onClick={monoReset}>🔄 重开棋盘</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
