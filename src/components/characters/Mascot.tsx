import clsx from 'clsx';

type MascotKey = 'deer' | 'bear' | 'rabbit' | 'bird' | 'corgi' | 'cat' | 'lop' | 'penguin';

interface MascotProps {
  name: MascotKey;
  size?: number;
  className?: string;
  /** Subtle hover/looping animation */
  animated?: boolean;
  /** Show a soft body ground shadow */
  withShadow?: boolean;
}

/**
 * 8 original mascots — all built from simple primitives so they remain
 * original, friendly, and easily recoloured. No licensed characters referenced.
 */
export function Mascot({ name, size = 120, className, animated = false, withShadow = true }: MascotProps) {
  const cls = clsx('inline-block', animated && 'animate-floaty', className);
  const body = renderMascot(name);
  return (
    <span className={cls} style={{ width: size, height: size, lineHeight: 0 }} aria-label={name}>
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        {withShadow && (
          <ellipse cx="60" cy="112" rx="28" ry="4" fill="rgba(23,48,20,0.10)" />
        )}
        {body}
      </svg>
    </span>
  );
}

function renderMascot(name: MascotKey) {
  switch (name) {
    case 'deer':    return <Deer />;
    case 'bear':    return <Bear />;
    case 'rabbit':  return <RabbitPostman />;
    case 'bird':    return <Bird />;
    case 'corgi':   return <Corgi />;
    case 'cat':     return <OrangeCat />;
    case 'lop':     return <LopRabbit />;
    case 'penguin': return <Penguin />;
  }
}

const eye = (cx: number, cy: number) => (
  <>
    <circle cx={cx} cy={cy} r="3" fill="#173014" />
    <circle cx={cx + 1} cy={cy - 1} r="0.8" fill="#fff" />
  </>
);

const smile = (cx: number, cy: number) => (
  <path d={`M${cx - 4} ${cy} q4 4 8 0`} stroke="#173014" strokeWidth="1.6" fill="none" strokeLinecap="round" />
);

/** 小鹿领航员 — light brown with white spots & a leaf scarf */
function Deer() {
  return (
    <g>
      {/* Antlers */}
      <path d="M44 18 l-3 -10 l4 2 l3 -8 l3 8 l4 -2 l-3 10" fill="#A77B4A" stroke="#855E33" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M76 18 l-3 -10 l4 2 l3 -8 l3 8 l4 -2 l-3 10" fill="#A77B4A" stroke="#855E33" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Head */}
      <ellipse cx="60" cy="48" rx="26" ry="24" fill="#D9A36E" />
      {/* Snout */}
      <ellipse cx="60" cy="58" rx="14" ry="10" fill="#F5E6CC" />
      <ellipse cx="60" cy="56" rx="3" ry="2" fill="#173014" />
      {/* Ears */}
      <ellipse cx="36" cy="36" rx="7" ry="10" fill="#D9A36E" transform="rotate(-25 36 36)" />
      <ellipse cx="84" cy="36" rx="7" ry="10" fill="#D9A36E" transform="rotate(25 84 36)" />
      <ellipse cx="36" cy="38" rx="3" ry="5" fill="#F5C0A0" transform="rotate(-25 36 38)" />
      <ellipse cx="84" cy="38" rx="3" ry="5" fill="#F5C0A0" transform="rotate(25 84 38)" />
      {/* Spots */}
      <circle cx="48" cy="48" r="2" fill="#FBF8EF" />
      <circle cx="72" cy="48" r="2" fill="#FBF8EF" />
      <circle cx="60" cy="42" r="1.6" fill="#FBF8EF" />
      {/* Eyes */}
      {eye(50, 48)}
      {eye(70, 48)}
      {smile(60, 62)}
      {/* Leaf scarf */}
      <path d="M30 70 q30 18 60 0 q-2 8 -30 12 q-28 -4 -30 -12z" fill="#7CB260" />
      <path d="M48 76 q12 -2 24 0" stroke="#427831" strokeWidth="1.2" fill="none" />
    </g>
  );
}

/** 小熊园丁 — brown bear with a straw hat */
function Bear() {
  return (
    <g>
      {/* Hat brim */}
      <ellipse cx="60" cy="26" rx="34" ry="6" fill="#A77B4A" />
      <ellipse cx="60" cy="22" rx="20" ry="10" fill="#C99A6B" />
      <rect x="56" y="18" width="8" height="6" fill="#A77B4A" />
      {/* Head */}
      <ellipse cx="60" cy="52" rx="30" ry="28" fill="#9A6B43" />
      <ellipse cx="60" cy="62" rx="16" ry="12" fill="#E2C39A" />
      <ellipse cx="60" cy="60" rx="3" ry="2" fill="#173014" />
      {/* Ears */}
      <circle cx="34" cy="32" r="9" fill="#9A6B43" />
      <circle cx="34" cy="32" r="5" fill="#E2C39A" />
      <circle cx="86" cy="32" r="9" fill="#9A6B43" />
      <circle cx="86" cy="32" r="5" fill="#E2C39A" />
      {eye(50, 52)}
      {eye(70, 52)}
      {smile(60, 66)}
      {/* Cheek blush */}
      <circle cx="44" cy="60" r="3" fill="#F2A2A2" opacity="0.55" />
      <circle cx="76" cy="60" r="3" fill="#F2A2A2" opacity="0.55" />
    </g>
  );
}

/** 兔子邮差 — white rabbit with a satchel */
function RabbitPostman() {
  return (
    <g>
      {/* Ears (upright) */}
      <ellipse cx="48" cy="22" rx="6" ry="16" fill="#FBF8EF" stroke="#E0D8C2" strokeWidth="1" />
      <ellipse cx="72" cy="22" rx="6" ry="16" fill="#FBF8EF" stroke="#E0D8C2" strokeWidth="1" />
      <ellipse cx="48" cy="22" rx="2.5" ry="10" fill="#F2A2A2" opacity="0.6" />
      <ellipse cx="72" cy="22" rx="2.5" ry="10" fill="#F2A2A2" opacity="0.6" />
      {/* Head */}
      <ellipse cx="60" cy="54" rx="28" ry="26" fill="#FBF8EF" />
      <ellipse cx="60" cy="64" rx="14" ry="10" fill="#FFFFFF" />
      <ellipse cx="60" cy="62" rx="3" ry="2" fill="#F2A2A2" />
      {eye(50, 52)}
      {eye(70, 52)}
      {smile(60, 68)}
      {/* Satchel strap */}
      <path d="M30 70 q30 26 60 0" stroke="#855E33" strokeWidth="2" fill="none" />
      <rect x="48" y="84" width="24" height="18" rx="4" fill="#C99A6B" />
      <rect x="56" y="80" width="8" height="6" fill="#A77B4A" />
      <text x="60" y="96" textAnchor="middle" fontSize="7" fill="#FBF8EF" fontWeight="700">✉</text>
    </g>
  );
}

/** 小鸟老师 — blue round bird with a tiny book */
function Bird() {
  return (
    <g>
      <ellipse cx="60" cy="56" rx="30" ry="28" fill="#7BB6D9" />
      <ellipse cx="60" cy="68" rx="18" ry="14" fill="#FBF8EF" />
      <path d="M86 56 q10 -4 16 0" stroke="#5194BF" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M88 56 l-4 0 l3 4 z" fill="#F2C94C" />
      {eye(50, 50)}
      {eye(70, 50)}
      <path d="M52 64 q8 4 16 0" stroke="#173014" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Tiny book */}
      <rect x="44" y="80" width="32" height="14" rx="2" fill="#427831" />
      <rect x="46" y="82" width="28" height="10" rx="1" fill="#FBF8EF" />
      <path d="M60 82 v10" stroke="#427831" strokeWidth="1" />
    </g>
  );
}

/** 柯基豆豆 — orange-white corgi with a little leaf */
function Corgi() {
  return (
    <g>
      {/* Ears */}
      <path d="M30 30 l8 24 l-10 -2 z" fill="#D9824B" />
      <path d="M90 30 l-8 24 l10 -2 z" fill="#D9824B" />
      {/* Head */}
      <ellipse cx="60" cy="54" rx="28" ry="26" fill="#E2A26B" />
      <ellipse cx="60" cy="64" rx="20" ry="14" fill="#FBF8EF" />
      <ellipse cx="60" cy="60" rx="3" ry="2" fill="#173014" />
      {eye(50, 52)}
      {eye(70, 52)}
      <path d="M50 64 q10 6 20 0" stroke="#173014" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="44" cy="60" r="3" fill="#F2A2A2" opacity="0.5" />
      <circle cx="76" cy="60" r="3" fill="#F2A2A2" opacity="0.5" />
    </g>
  );
}

/** 橘猫橙橙 — orange tabby with a leaf on head */
function OrangeCat() {
  return (
    <g>
      {/* Ears */}
      <path d="M34 28 l8 18 l-14 -2 z" fill="#E2A26B" />
      <path d="M86 28 l-8 18 l14 -2 z" fill="#E2A26B" />
      <path d="M40 32 l4 8 l-8 -1 z" fill="#F2A2A2" />
      <path d="M80 32 l-4 8 l8 -1 z" fill="#F2A2A2" />
      {/* Head */}
      <ellipse cx="60" cy="56" rx="30" ry="26" fill="#E2A26B" />
      {/* Stripes */}
      <path d="M44 38 q4 4 0 8" stroke="#A77B4A" strokeWidth="1.4" fill="none" />
      <path d="M76 38 q-4 4 0 8" stroke="#A77B4A" strokeWidth="1.4" fill="none" />
      <path d="M40 50 q4 2 0 6" stroke="#A77B4A" strokeWidth="1.2" fill="none" />
      <path d="M80 50 q-4 2 0 6" stroke="#A77B4A" strokeWidth="1.2" fill="none" />
      <ellipse cx="60" cy="62" rx="14" ry="10" fill="#F5E6CC" />
      <ellipse cx="60" cy="60" rx="3" ry="2" fill="#173014" />
      {eye(50, 56)}
      {eye(70, 56)}
      <path d="M52 66 q8 4 16 0" stroke="#173014" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* Whiskers */}
      <path d="M40 62 h-10 M40 66 h-10 M80 62 h10 M80 66 h10" stroke="#855E33" strokeWidth="1" />
    </g>
  );
}

/** 垂耳兔点点 — floppy-eared rabbit */
function LopRabbit() {
  return (
    <g>
      {/* Floppy ears */}
      <path d="M44 24 q-10 18 -2 44" fill="#F5E6CC" stroke="#E0D8C2" strokeWidth="1" />
      <path d="M76 24 q10 18 2 44" fill="#F5E6CC" stroke="#E0D8C2" strokeWidth="1" />
      <path d="M44 28 q-6 14 -1 32" fill="#F2A2A2" opacity="0.4" />
      <path d="M76 28 q6 14 1 32" fill="#F2A2A2" opacity="0.4" />
      {/* Head */}
      <ellipse cx="60" cy="50" rx="28" ry="26" fill="#F5E6CC" />
      <ellipse cx="60" cy="60" rx="14" ry="10" fill="#FFFFFF" />
      <ellipse cx="60" cy="58" rx="3" ry="2" fill="#F2A2A2" />
      {eye(50, 50)}
      {eye(70, 50)}
      {smile(60, 64)}
    </g>
  );
}

/** 企鹅圆圆 — round penguin with a leaf bow tie */
function Penguin() {
  return (
    <g>
      <ellipse cx="60" cy="60" rx="28" ry="32" fill="#173014" />
      <ellipse cx="60" cy="64" rx="20" ry="22" fill="#FBF8EF" />
      <ellipse cx="60" cy="40" rx="22" ry="20" fill="#173014" />
      <ellipse cx="60" cy="40" rx="14" ry="14" fill="#FBF8EF" />
      {eye(53, 36)}
      {eye(67, 36)}
      <path d="M52 46 l8 4 l8 -4 l-4 6 l-4 -2 l-4 2 z" fill="#F2C94C" />
      <path d="M56 60 l4 4 l4 -4 l-4 6 z" fill="#F2C94C" />
      {/* Bow tie */}
      <path d="M50 76 l10 4 l0 -8 z M70 76 l-10 4 l0 -8 z" fill="#7CB260" />
      <circle cx="60" cy="76" r="2.5" fill="#427831" />
    </g>
  );
}
