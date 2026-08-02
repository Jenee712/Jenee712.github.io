import { monoCells, monoGridPos, MONO_GRID, drawMonoCard } from '@/data/monopoly';

// 1) 数量与索引连续
const idxOk = monoCells.length === 28 && monoCells.every((c, i) => c.index === i);
console.log('cells count=28 & index contiguous:', idxOk);

// 2) 每个格的网格坐标都在 0..7
let bad = 0;
for (let i = 0; i < monoCells.length; i++) {
  const { row, col } = monoGridPos(i);
  if (row < 0 || row > 7 || col < 0 || col > 7) { bad++; console.log('BAD', i, row, col); }
}
console.log('grid positions in-range:', bad === 0);

// 3) 四角位置
const corners = [0, 7, 14, 21].map((i) => monoGridPos(i));
console.log('corners:', JSON.stringify(corners)); // 期望 (7,7)(7,0)(0,0)(0,7)

// 4) 颜色组齐全
const groups = new Set(monoCells.filter((c) => c.kind === 'property').map((c) => c.colorGroup));
console.log('color groups:', [...groups].join(','));

// 5) 抽卡可运行
const c = drawMonoCard('chance');
const f = drawMonoCard('fortune');
console.log('sample chance:', c.text.slice(0, 12), '| fortune:', f.text.slice(0, 12));
console.log('ALL_OK:', idxOk && bad === 0);
