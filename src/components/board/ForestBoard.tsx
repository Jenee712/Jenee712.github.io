import clsx from 'clsx';
import type { BoardCell } from '@/types';
import { Mascot } from '@/components/characters/Mascot';
import { BoardTile } from './BoardTile';

interface Props {
  cells: BoardCell[];
  selectedIndex?: number;
  onSelect: (cell: BoardCell) => void;
}

/**
 * 森林田园棋盘（椭圆环线 28 格 + 中心小鹿领航员）。
 * - iPad / 桌面：椭圆绝对定位布局
 * - 手机：竖向路线（复杂棋盘转换为纵向，避免拥挤）
 */
export function ForestBoard({ cells, selectedIndex, onSelect }: Props) {
  const n = cells.length;
  const positions = cells.map((_, i) => {
    const angle = (i / (n - 1)) * Math.PI * 2 - Math.PI / 2;
    // 椭圆：x 半径大（44%），y 半径较小（28%）让上下格子不至于挤到中鹿区
    const x = 50 + 44 * Math.cos(angle);
    const y = 50 + 28 * Math.sin(angle);
    return { x, y };
  });

  return (
    <>
      {/* 桌面 / iPad：椭圆布局 */}
      <div className="hidden md:block relative mx-auto px-4" style={{ width: '100%', maxWidth: 960, aspectRatio: '2 / 1' }}>
        <div className="absolute inset-0 rounded-[50%] bg-forest-50 ring-1 ring-forest-200" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
          <Mascot name="deer" size={72} animated />
          <span className="mt-1 text-xs text-forest-500">小鹿在前进</span>
        </div>
        {cells.map((c, i) => (
          <div
            key={c.index}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%` }}
          >
            <BoardTile cell={c} selected={c.index === selectedIndex} onClick={() => onSelect(c)} />
          </div>
        ))}
      </div>

      {/* 手机：竖向路线 */}
      <div className="md:hidden flex flex-col items-center gap-2">
        {cells.map((c) => (
          <div key={c.index} className="flex flex-col items-center">
            <BoardTile cell={c} selected={c.index === selectedIndex} onClick={() => onSelect(c)} />
            {c.index !== cells.length - 1 && <span className="h-3 w-1 rounded bg-forest-200" aria-hidden />}
          </div>
        ))}
      </div>
    </>
  );
}
