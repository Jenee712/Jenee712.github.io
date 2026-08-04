import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAppStore } from '@/store/useAppStore';
import { Mascot } from '@/components/characters/Mascot';
import { Tree, Flower, Cloud } from '@/components/decor/ForestDecor';

const items = [
  { to: '/english/books', label: '绘本馆', emoji: '📖' },
  { to: '/',         label: '首页',     emoji: '🏡', end: true },
  { to: '/english',  label: '英语',     emoji: '🔤', end: true },
  { to: '/math',     label: '数学',     emoji: '🥕' },
  { to: '/chinese',  label: '语文',     emoji: '📚' },
  { to: '/roadmap',  label: '60 天航线', emoji: '✈️' },
];

export function Sidebar() {
  const kid = useAppStore(s => s.kid);
  return (
    <aside className="hidden md:flex flex-col w-[220px] shrink-0 h-full px-4 py-6 bg-cream-50/80 backdrop-blur-sm border-r border-forest-100">
      {/* Brand */}
      <div className="relative flex items-center gap-3 px-2 mb-6">
        <Tree className="w-12 animate-sway" />
        <div className="relative">
          <div className="font-display font-extrabold text-forest-800 leading-none">🐶 小狗的</div>
          <div className="text-[15px] font-display font-bold text-sun-500 leading-tight">森林学习站</div>
        </div>
        <Cloud className="absolute -top-3 -right-2 w-10 opacity-70 animate-drift" />
      </div>
      <Flower color="#F4A6C0" className="absolute left-3 top-20 w-7 opacity-80 animate-bob" />

      <div className="text-[11px] tracking-[0.18em] text-forest-500 px-2 mb-2">学习列车</div>
      <nav className="flex flex-col gap-1.5">
        {items.map(i => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.end}
            className={({ isActive }) => clsx('nav-item', isActive && 'nav-item-active')}
          >
            <span className="text-xl" aria-hidden>{i.emoji}</span>
            <span>{i.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="text-[11px] tracking-[0.18em] text-forest-500 px-2 mt-6 mb-2">森林乐园</div>
      <div className="grid grid-cols-3 gap-1 px-1">
        <NavLink to="/board" className="side-shortcut" aria-label="森林棋盘"><span>🗺️</span><small>棋盘</small></NavLink>
        <NavLink to="/album" className="side-shortcut" aria-label="成长图鉴"><span>🐰</span><small>图鉴</small></NavLink>
        <NavLink to="/battle" className="side-shortcut" aria-label="飞机大战"><span>🛩️</span><small>游戏</small></NavLink>
      </div>

      <div className="mt-auto pt-6">
        <NavLink to="/parent" className="nav-item text-forest-700">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 2 4 5v6c0 5 3.5 9.4 8 11 4.5-1.6 8-6 8-11V5l-8-3z" />
          </svg>
          <span>家长中心</span>
        </NavLink>
      </div>

      <div className="mt-4 p-3 rounded-barn bg-forest-50 flex items-center gap-3">
        <Mascot name={kid.avatarKey} size={44} />
        <div className="min-w-0">
          <div className="font-display font-bold text-forest-800 truncate">{kid.nickname}</div>
          <div className="text-xs text-forest-600/80">Lv.{kid.level} · 🔥{kid.streakDays} 天</div>
        </div>
      </div>
    </aside>
  );
}
