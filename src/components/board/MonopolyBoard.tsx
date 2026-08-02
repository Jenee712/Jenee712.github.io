import type { MonopolyCell } from '@/types';
import { MONO_GRID, monoGridPos } from '@/data/monopoly';
import { Mascot } from '@/components/characters/Mascot';
import { MonopolyTile } from './MonopolyTile';

interface Props {
  cells: MonopolyCell[];
  pos: number;
  owned: number[];
  onCellClick: (index: number) => void;
}

/** 森林大富翁棋盘：8×8 网格外圈 28 格 + 中心森林场景 + 小鹿棋子（逐格滑动 / 每步跳一下）。 */
export function MonopolyBoard({ cells, pos, owned, onCellClick }: Props) {
  const N = MONO_GRID;
  const pct = 100 / N;

  // 棋子中心坐标（百分比），用于绝对定位 + 平滑滑动
  const { row: prow, col: pcol } = monoGridPos(pos);
  const pawnLeft = (pcol + 0.5) * pct;
  const pawnTop = (prow + 0.5) * pct;

  return (
    <div className="relative mx-auto w-full max-w-[min(660px,calc(100vw-2rem))] aspect-square rounded-pebble bg-forest-50 ring-1 ring-forest-200 p-1 sm:p-2">
      {cells.map((c) => {
        const { row, col } = monoGridPos(c.index);
        const isPlayer = owned.includes(c.index);
        return (
          <div
            key={c.index}
            className="absolute p-[1px]"
            style={{ left: `${col * pct}%`, top: `${row * pct}%`, width: `${pct}%`, height: `${pct}%` }}
          >
            <MonopolyTile cell={c} ownedByPlayer={isPlayer} onClick={() => onCellClick(c.index)} />
          </div>
        );
      })}

      {/* 中心森林场景 */}
      <div
        className="absolute"
        style={{ left: `${pct}%`, top: `${pct}%`, width: `${pct * (N - 2)}%`, height: `${pct * (N - 2)}%` }}
      >
        <div className="w-full h-full rounded-[18px] bg-gradient-to-b from-cream-50 to-forest-100 flex flex-col items-center justify-center text-center px-1">
          <Mascot name="deer" size={40} animated />
          <div className="text-[10px] sm:text-xs text-forest-700 mt-1 font-display font-bold whitespace-nowrap">森林大富翁</div>
          <div className="text-[8px] sm:text-[10px] text-forest-500">第 {pos + 1} 格</div>
        </div>
      </div>

      {/* 小鹿棋子：独立绝对定位，left/top 平滑过渡；内层 key={pos} 让每落一格重播一次弹跳 */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          left: `${pawnLeft}%`,
          top: `${pawnTop}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left .32s cubic-bezier(.34,1.45,.5,1), top .32s cubic-bezier(.34,1.45,.5,1)',
        }}
      >
        <span key={pos} className="pawn-hop inline-block">
          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 ring-2 ring-forest-500 flex items-center justify-center shadow-lift">
            <Mascot name="deer" size={22} animated />
          </span>
        </span>
      </div>
    </div>
  );
}
