import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const items = [
  { to: '/',         label: '首页',     emoji: '🏡', end: true },
  { to: '/english/books', label: '绘本馆', emoji: '📖' },
  { to: '/english',  label: '英语',     emoji: '🔤', end: true },
  { to: '/math',     label: '数学',     emoji: '🥕' },
  { to: '/chinese',  label: '语文',     emoji: '📚' },
  { to: '/roadmap',  label: '航线',     emoji: '✈️' },
];

export function MobileNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream-50/95 backdrop-blur
                 border-t border-forest-100 px-1 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(23,48,20,0.08)]"
      aria-label="底部导航"
    >
      <div className="grid grid-cols-6 max-w-lg mx-auto">
        {items.map(i => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.end}
            className={({ isActive }) => clsx(
              'min-w-0 flex flex-col items-center justify-center gap-0.5 py-2 rounded-barn text-xs tap',
              isActive ? 'text-forest-800 font-bold' : 'text-forest-600',
            )}
          >
            <span className="text-xl leading-none" aria-hidden>{i.emoji}</span>
            <span className="whitespace-nowrap text-[10px] leading-tight">{i.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
