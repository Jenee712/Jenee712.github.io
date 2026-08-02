import type { BookScene as Scene } from '@/types';
import { Mascot } from '@/components/characters/Mascot';

/**
 * 绘本书页插画：原创森林角色 + 简单天空/地面道具，不引用任何商业 IP。
 * 场景完全由 BookScene 数据驱动，保证 8 本书风格统一。
 *
 * 视觉规范（2026-08 升级）：
 *  - 角色 size 在渲染时统一 ×2.51（面积缩 30% 后的边长，比原始 ×1 大，比 ×3 收敛，让动画有空间感且不抢主体）。
 *  - 加常驻场景装饰层：远山 + 草丛 + 蝴蝶 + 多色花丛，按 sky 自动配色（day / night / rain / snow）。
 *  - **caption 移除**：用户反馈手机端 caption 挡住角色脸，文字改为在画布下方独立 section 渲染（见 PictureBookReader）。
 *    画布里只剩插画，干净通透。
 */
const CHARACTER_SIZE_SCALE = 2.51; // ×3 缩小 30% 面积（边长 ×√0.7）

export function BookScene({ scene, className = '' }: { scene: Scene; className?: string }) {
  const sky = scene.sky ?? 'day';
  const groundCls =
    sky === 'night' ? 'bg-forest-700/70'
    : sky === 'snow' ? 'bg-cream-100'
    : sky === 'rain' ? 'bg-forest-400/70'
    : 'bg-forest-300/80';

  return (
    <div className={`relative overflow-hidden rounded-pebble ring-1 ring-forest-200 bg-gradient-to-b ${scene.bg} ${className}`}>
      {/* 天空道具（保留原有 props 体系） */}
      {scene.props?.includes('sun') && <Sun />}
      {scene.props?.includes('moon') && <Moon />}
      {scene.props?.includes('cloud') && <>{[12, 62].map((l, i) => <Cloud key={i} left={l} top={i === 0 ? 14 : 26} />)}</>}
      {scene.props?.includes('star') && <Stars />}
      {scene.props?.includes('rain') && <Rain />}
      {scene.props?.includes('snow') && <Snow />}
      {scene.props?.includes('tree') && <>{[8, 88].map((l, i) => <Tree key={i} left={l} />)}</>}
      {scene.props?.includes('flower') && <Flowers />}
      {scene.props?.includes('lake') && <Lake />}

      {/* 常驻场景装饰层（远山 / 草丛 / 蝴蝶）—— 让画面有纵深，不再空旷 */}
      <BookDecorations sky={sky} />

      {/* 地面小山丘 */}
      <div className={`absolute bottom-0 left-0 right-0 h-[30%] ${groundCls} rounded-t-[45%]`} />

      {/* 角色（原创 SVG，size ×2.51 = 主要但不过分突出） */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        {scene.characters.map((c, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <Mascot name={c.name} size={c.size * CHARACTER_SIZE_SCALE} animated={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * 天空道具（保持原有风格）
 * ============================================================ */
function Sun() {
  return (
    <div className="absolute top-6 right-8" aria-hidden>
      <div className="w-14 h-14 rounded-full bg-sun-400 shadow-[0_0_0_8px_rgba(250,204,21,0.25)]" />
    </div>
  );
}
function Moon() {
  return (
    <div className="absolute top-6 right-10" aria-hidden>
      <div className="w-12 h-12 rounded-full bg-cream-100 shadow-[inset_-10px_-2px_0_0_#fde68a]" />
    </div>
  );
}
function Cloud({ left, top }: { left: number; top: number }) {
  return (
    <div className="absolute" style={{ left: `${left}%`, top: `${top}%` }} aria-hidden>
      <div className="flex items-center gap-1">
        <div className="w-8 h-8 rounded-full bg-white/90" />
        <div className="w-12 h-12 rounded-full bg-white/90 -ml-3" />
        <div className="w-8 h-8 rounded-full bg-white/90 -ml-3" />
      </div>
    </div>
  );
}
function Stars() {
  const pts = [[14, 16], [30, 10], [46, 22], [70, 12], [82, 24], [60, 30], [22, 30]];
  return (
    <div className="absolute inset-0" aria-hidden>
      {pts.map(([l, t], i) => (
        <div key={i} className="absolute text-cream-100 text-lg" style={{ left: `${l}%`, top: `${t}%` }}>★</div>
      ))}
    </div>
  );
}
function Rain() {
  return (
    <div className="absolute inset-0 opacity-60" aria-hidden>
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-5 bg-sky-400/70 rotate-12"
          style={{ left: `${(i * 31) % 100}%`, top: `${(i * 17) % 60}%` }}
        />
      ))}
    </div>
  );
}
function Snow() {
  const pts = Array.from({ length: 18 }).map((_, i) => [(i * 37) % 100, (i * 23) % 80]);
  return (
    <div className="absolute inset-0" aria-hidden>
      {pts.map(([l, t], i) => (
        <div key={i} className="absolute w-2 h-2 rounded-full bg-white/90" style={{ left: `${l}%`, top: `${t}%` }} />
      ))}
    </div>
  );
}
function Tree({ left }: { left: number }) {
  return (
    <div className="absolute bottom-[20%]" style={{ left: `${left}%`, transform: 'translateX(-50%)' }} aria-hidden>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-forest-500" />
        <div className="w-3 h-10 bg-soil-600 rounded" />
      </div>
    </div>
  );
}
function Flowers() {
  const pts = [[16, 70], [30, 78], [78, 72], [90, 80], [50, 84]];
  return (
    <div className="absolute inset-0" aria-hidden>
      {pts.map(([l, t], i) => (
        <div key={i} className="absolute w-3 h-3 rounded-full bg-pink-300 ring-2 ring-pink-200" style={{ left: `${l}%`, top: `${t}%` }} />
      ))}
    </div>
  );
}
function Lake() {
  return (
    <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-2/3 h-[10%] rounded-[50%] bg-sky-300/70" aria-hidden />
  );
}

/* ============================================================
 * 常驻场景装饰层（远山 / 草丛 / 蝴蝶 / 彩色花丛 / 飞虫）
 * 不依赖 scene.props，每页自动出现。
 * z-index 0~3，绝不遮挡角色（z-5）和 caption（z-10）。
 * ============================================================ */
function BookDecorations({ sky }: { sky: 'day' | 'night' | 'rain' | 'snow' }) {
  // 按 sky 调色：夜晚加深，雪天去饱和，雨天偏冷
  const palette = paletteFor(sky);
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none" aria-hidden>
      {/* 远山（最远景，给纵深） */}
      <Mountains sky={sky} />

      {/* 蝴蝶 / 飞虫（2 只，分别在画面左上和右下） */}
      <Butterfly left={18} top={28} color={palette.butterfly1} />
      <Butterfly left={78} top={42} color={palette.butterfly2} />

      {/* 草丛（前/中景，3 丛高草分散在地面） */}
      <Grass left={6}  height={64} color={palette.grass} />
      <Grass left={92} height={72} color={palette.grass} />
      <Grass left={48} height={42} color={palette.grassLight} />

      {/* 多色花丛（在草坡上，5 朵） */}
      <FlowerCluster />
    </div>
  );
}

function paletteFor(sky: 'day' | 'night' | 'rain' | 'snow') {
  if (sky === 'night')
    return { butterfly1: '#fcd34d', butterfly2: '#fbbf24', grass: '#15803d', grassLight: '#166534' };
  if (sky === 'snow')
    return { butterfly1: '#a7f3d0', butterfly2: '#fbcfe8', grass: '#65a30d', grassLight: '#84cc16' };
  if (sky === 'rain')
    return { butterfly1: '#93c5fd', butterfly2: '#c4b5fd', grass: '#16a34a', grassLight: '#22c55e' };
  return { butterfly1: '#f472b6', butterfly2: '#fbbf24', grass: '#22c55e', grassLight: '#86efac' };
}

function Mountains({ sky }: { sky: 'day' | 'night' | 'rain' | 'snow' }) {
  // 远山用 SVG 三角叠加，顶部约 55%，底部与小山丘相接
  const fill = sky === 'night' ? '#1e3a5f' : sky === 'rain' ? '#64748b' : sky === 'snow' ? '#cbd5e1' : '#7d9a8b';
  const fill2 = sky === 'night' ? '#2d4a6f' : sky === 'rain' ? '#94a3b8' : sky === 'snow' ? '#e2e8f0' : '#a7c4b1';
  return (
    <svg className="absolute bottom-[18%] left-0 right-0 w-full h-[40%]" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden>
      {/* 远山第一层 */}
      <path d="M 0 200 L 0 130 L 120 80 L 220 110 L 340 60 L 460 95 L 580 70 L 700 105 L 820 75 L 920 100 L 1000 85 L 1000 200 Z" fill={fill} opacity="0.55" />
      {/* 远山第二层（更近一点） */}
      <path d="M 0 200 L 0 160 L 90 130 L 200 150 L 310 120 L 440 145 L 560 125 L 690 150 L 820 130 L 1000 145 L 1000 200 Z" fill={fill2} opacity="0.7" />
    </svg>
  );
}

function Butterfly({ left, top, color }: { left: number; top: number; color: string }) {
  return (
    <div
      className="absolute animate-[flutter_4s_ease-in-out_infinite]"
      style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)' }}
      aria-hidden
    >
      <svg width="34" height="26" viewBox="0 0 34 26">
        {/* 蝶翼（两对） */}
        <ellipse cx="9"  cy="9"  rx="8" ry="6" fill={color} stroke="#15803d" strokeWidth="0.6" />
        <ellipse cx="25" cy="9"  rx="8" ry="6" fill={color} stroke="#15803d" strokeWidth="0.6" />
        <ellipse cx="10" cy="18" rx="5" ry="4" fill={color} opacity="0.85" />
        <ellipse cx="24" cy="18" rx="5" ry="4" fill={color} opacity="0.85" />
        {/* 身躯 */}
        <rect x="16" y="6" width="2" height="14" rx="1" fill="#1f2937" />
        {/* 触角 */}
        <path d="M 16 6 Q 14 3 13 2" stroke="#1f2937" strokeWidth="0.6" fill="none" />
        <path d="M 18 6 Q 20 3 21 2" stroke="#1f2937" strokeWidth="0.6" fill="none" />
      </svg>
    </div>
  );
}

function Grass({ left, height, color }: { left: number; height: number; color: string }) {
  // 几根弯曲的高草叶
  return (
    <div
      className="absolute bottom-[10%]"
      style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
      aria-hidden
    >
      <svg width="42" height={height} viewBox="0 0 42 64" fill="none">
        <path d="M 21 64 Q 16 40 12 18 Q 10 8 14 2" stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M 21 64 Q 26 38 30 14 Q 32 4 28 0"  stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M 21 64 Q 21 36 21 8"  stroke={color} strokeWidth="2"   strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

function FlowerCluster() {
  // 5 朵彩色小花，散布在草坡（bottom 12%–20%）
  const pts: [number, number, string, string][] = [
    [14, 86, '#f472b6', '#fbcfe8'],
    [26, 90, '#fbbf24', '#fde68a'],
    [42, 88, '#a78bfa', '#ddd6fe'],
    [62, 90, '#60a5fa', '#bfdbfe'],
    [84, 86, '#f472b6', '#fbcfe8'],
  ];
  return (
    <div className="absolute inset-0" aria-hidden>
      {pts.map(([l, t, c, r], i) => (
        <div key={i} className="absolute" style={{ left: `${l}%`, top: `${t}%`, transform: 'translate(-50%, -50%)' }}>
          <svg width="22" height="28" viewBox="0 0 22 28">
            {/* 茎 */}
            <path d="M 11 28 Q 11 18 11 8" stroke="#15803d" strokeWidth="1.6" fill="none" />
            {/* 花瓣（5 瓣） */}
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse key={deg} cx="11" cy="4" rx="3" ry="4" fill={c} transform={`rotate(${deg} 11 8)`} />
            ))}
            <circle cx="11" cy="8" r="2.2" fill={r} />
          </svg>
        </div>
      ))}
    </div>
  );
}
