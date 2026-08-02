/**
 * ForestDecor — 小狗的森林学习站 · 森系可爱装饰元素库
 * 所有元素为圆润卡通 SVG，森林配色；支持 size 与 className（用于动画）。
 * 用法：<Cloud className="animate-drift" />  <Flower color="#F4A6C0" />
 */
import type { CSSProperties } from 'react';

type BaseProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

function Svg({
  size = 64,
  className,
  style,
  children,
  vb = '0 0 64 64',
  label,
}: BaseProps & { children: React.ReactNode; vb?: string; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={vb}
      className={className}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {children}
    </svg>
  );
}

/** 白云 */
export function Cloud({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} vb="0 0 80 48" label="云">
      <g fill="#FFFFFF">
        <ellipse cx="26" cy="30" rx="20" ry="14" />
        <ellipse cx="46" cy="24" rx="18" ry="16" />
        <ellipse cx="58" cy="32" rx="16" ry="12" />
        <rect x="14" y="30" width="52" height="14" rx="7" />
      </g>
      <ellipse cx="46" cy="38" rx="30" ry="8" fill="#EAF4FA" opacity="0.7" />
    </Svg>
  );
}

/** 卡通圆树（树冠 + 树干） */
export function Tree({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="树">
      <rect x="28" y="40" width="8" height="18" rx="3" fill="#A77B4A" />
      <circle cx="32" cy="30" r="20" fill="#5B9742" />
      <circle cx="20" cy="34" r="13" fill="#7CB260" />
      <circle cx="44" cy="34" r="13" fill="#7CB260" />
      <circle cx="32" cy="22" r="14" fill="#8FCB6E" />
      <circle cx="26" cy="26" r="3" fill="#F2C94C" opacity="0.85" />
      <circle cx="38" cy="30" r="3" fill="#F2C94C" opacity="0.85" />
    </Svg>
  );
}

/** 松树（三角层叠） */
export function Pine({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="松树">
      <rect x="28" y="48" width="8" height="12" rx="3" fill="#855E33" />
      <path d="M32 6 L52 30 H12 Z" fill="#427831" />
      <path d="M32 18 L56 44 H8 Z" fill="#5B9742" />
      <path d="M32 32 L60 56 H4 Z" fill="#6FAE50" />
      <circle cx="32" cy="9" r="3" fill="#F2C94C" />
    </Svg>
  );
}

/** 灌木丛 */
export function Bush({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="灌木">
      <ellipse cx="20" cy="44" rx="18" ry="16" fill="#6FAE50" />
      <ellipse cx="44" cy="44" rx="18" ry="16" fill="#5B9742" />
      <ellipse cx="32" cy="36" rx="16" ry="15" fill="#7CB260" />
      <circle cx="26" cy="36" r="2.5" fill="#F4A6C0" />
      <circle cx="40" cy="40" r="2.5" fill="#F2C94C" />
    </Svg>
  );
}

/** 小花（可配色，默认粉） */
export function Flower({ size, className, style, color = '#F4A6C0' }: BaseProps & { color?: string }) {
  const petals = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return { x: 32 + Math.cos(a) * 14, y: 30 + Math.sin(a) * 14 };
  });
  return (
    <Svg size={size} className={className} style={style} label="花">
      <rect x="30" y="40" width="4" height="20" rx="2" fill="#5B9742" />
      <path d="M32 44 q-10 4 -14 -2 q10 -2 14 2Z" fill="#7CB260" />
      {petals.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="9" fill={color} />
      ))}
      <circle cx="32" cy="30" r="9" fill="#F2C94C" />
    </Svg>
  );
}

/** 郁金香 */
export function Tulip({ size, className, style, color = '#E8736A' }: BaseProps & { color?: string }) {
  return (
    <Svg size={size} className={className} style={style} label="郁金香">
      <rect x="29" y="34" width="6" height="28" rx="3" fill="#5B9742" />
      <path d="M32 40 q-12 0 -14 -8 q12 -2 14 8Z" fill="#7CB260" />
      <path d="M32 40 q12 0 14 -8 q-12 -2 -14 8Z" fill="#7CB260" />
      <path d="M18 34 q14 -10 28 0 q-4 -16 -14 -18 q-10 2 -14 18Z" fill={color} />
      <path d="M22 30 q10 4 20 0 q-2 -8 -10 -10 q-8 2 -10 10Z" fill="#FFFFFF" opacity="0.25" />
    </Svg>
  );
}

/** 蘑菇 */
export function Mushroom({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="蘑菇">
      <rect x="26" y="34" width="12" height="20" rx="6" fill="#FBF8EF" />
      <path d="M10 38 a22 18 0 0 1 44 0 Z" fill="#E8736A" />
      <circle cx="22" cy="30" r="3.5" fill="#FFFFFF" />
      <circle cx="34" cy="26" r="3" fill="#FFFFFF" />
      <circle cx="42" cy="32" r="2.5" fill="#FFFFFF" />
    </Svg>
  );
}

/** 浆果丛 */
export function Berry({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="浆果">
      <path d="M14 46 q18 -22 36 0 Z" fill="#5B9742" />
      <circle cx="24" cy="40" r="5" fill="#C0455A" />
      <circle cx="34" cy="42" r="5" fill="#E0455E" />
      <circle cx="42" cy="38" r="5" fill="#C0455A" />
      <circle cx="30" cy="36" r="4" fill="#F26D7E" />
    </Svg>
  );
}

/** 蝴蝶 */
export function Butterfly({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="蝴蝶">
      <ellipse cx="24" cy="26" rx="12" ry="14" fill="#B79CE0" />
      <ellipse cx="40" cy="26" rx="12" ry="14" fill="#B79CE0" />
      <ellipse cx="24" cy="42" rx="10" ry="11" fill="#F4A6C0" />
      <ellipse cx="40" cy="42" rx="10" ry="11" fill="#F4A6C0" />
      <rect x="30" y="20" width="4" height="30" rx="2" fill="#5B9742" />
      <path d="M32 22 q6 -8 2 -10 M32 22 q-6 -8 -2 -10" stroke="#5B9742" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/** 瓢虫 */
export function Ladybug({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="瓢虫">
      <ellipse cx="32" cy="38" rx="20" ry="16" fill="#E0455E" />
      <path d="M32 22 a16 14 0 0 1 0 28Z" fill="#C0455A" />
      <rect x="28" y="14" width="8" height="10" rx="4" fill="#23461C" />
      <circle cx="32" cy="20" r="3" fill="#23461C" />
      <circle cx="24" cy="36" r="3.5" fill="#23461C" />
      <circle cx="40" cy="36" r="3.5" fill="#23461C" />
      <circle cx="26" cy="46" r="3" fill="#23461C" />
      <circle cx="38" cy="46" r="3" fill="#23461C" />
    </Svg>
  );
}

/** 草丛 */
export function GrassTuft({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} vb="0 0 64 40" label="草">
      <path d="M10 40 q-2 -22 4 -30 q2 14 -4 30Z" fill="#5B9742" />
      <path d="M22 40 q-4 -26 2 -32 q4 16 -2 32Z" fill="#7CB260" />
      <path d="M34 40 q-2 -22 4 -30 q2 14 -4 30Z" fill="#5B9742" />
      <path d="M46 40 q-4 -26 2 -32 q4 16 -2 32Z" fill="#7CB260" />
      <path d="M56 40 q-2 -20 3 -28 q2 14 -3 28Z" fill="#6FAE50" />
    </Svg>
  );
}

/** 太阳 */
export function Sun({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="太阳">
      <g fill="#F2C94C">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return <rect key={i} x="30" y="2" width="4" height="12" rx="2" transform={`rotate(${(i / 8) * 360} 32 32)`} />;
        })}
      </g>
      <circle cx="32" cy="32" r="16" fill="#F2C94C" />
      <circle cx="26" cy="29" r="2.5" fill="#23461C" />
      <circle cx="38" cy="29" r="2.5" fill="#23461C" />
      <path d="M26 38 q6 6 12 0" stroke="#23461C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/** 山丘（底部地平线装饰） */
export function Hill({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} vb="0 0 64 32" label="山丘">
      <path d="M0 32 Q16 8 34 20 T64 14 V32 Z" fill="#A6CC8B" />
      <path d="M0 32 Q22 18 44 26 T64 22 V32 Z" fill="#7CB260" opacity="0.85" />
    </Svg>
  );
}

/** 萤火虫（发光小点） */
export function Firefly({ size = 20, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="萤火虫">
      <circle cx="10" cy="10" r="9" fill="#F2C94C" opacity="0.25" />
      <circle cx="10" cy="10" r="4" fill="#F2E08A" />
    </Svg>
  );
}

/** 飘叶 */
export function Leaf({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} label="叶子">
      <path d="M32 8 C12 16 12 48 32 56 C52 48 52 16 32 8Z" fill="#7CB260" />
      <path d="M32 12 V54" stroke="#5B9742" strokeWidth="2.5" />
      <path d="M32 26 l-10 -4 M32 36 l10 -4 M32 44 l-8 -3" stroke="#5B9742" strokeWidth="2" fill="none" />
    </Svg>
  );
}

/** 小土坡 + 草（组合成角落点缀） */
export function GrassCorner({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style} vb="0 0 120 60" label="草丛">
      <path d="M0 60 Q30 30 60 44 T120 38 V60 Z" fill="#A6CC8B" />
      <path d="M0 60 Q40 44 70 52 T120 50 V60 Z" fill="#7CB260" opacity="0.9" />
    </Svg>
  );
}
