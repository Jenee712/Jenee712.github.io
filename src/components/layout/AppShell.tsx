import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { TopBar } from './TopBar';
import { useEffect, useMemo } from 'react';
import { Butterfly, Cloud, Flower, GrassTuft, Leaf, Tree } from '@/components/decor/ForestDecor';

/** 游戏/对战类路由用更明亮的羊群油画背景；其他学习类路由用温柔的兔子水彩背景 */
function pickBackground(pathname: string): 'meadow' | 'field' {
  if (pathname.startsWith('/battle')) return 'field';
  return 'meadow';
}

export function AppShell() {
  const location = useLocation();
  const bg = useMemo(() => pickBackground(location.pathname), [location.pathname]);
  const isFocusMode = /^\/(english|math|chinese)\/lesson\//.test(location.pathname)
    || /^\/english\/book\//.test(location.pathname);

  // 路由切换自动回到顶部，平滑滚动
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] flex">
      {/* === 背景大图（按路由切换） === */}
      <picture
        key={bg}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 block"
      >
        <img
          src={`${import.meta.env.BASE_URL}backgrounds/field-sheep.jpg`}
          alt=""
          className="h-full w-full object-cover animate-[bgIn_700ms_ease-out_both]"
          loading="eager"
          decoding="async"
        />
        {/* 柔光：保证深色文字仍清晰可读，又不会完全盖住原图 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              bg === 'field'
                ? 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.42) 70%, rgba(255,255,255,0.64) 100%)'
                : 'linear-gradient(180deg, rgba(236,248,255,0.22) 0%, rgba(255,255,255,0.50) 48%, rgba(247,251,239,0.78) 100%)',
          }}
        />
      </picture>

      {/* === 少量前景装饰：蝴蝶/落花/飘叶，不挡交互 === */}
      {!isFocusMode && <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <Cloud className="absolute left-[24%] top-16 w-28 opacity-55 animate-drift" />
        <Cloud className="absolute right-[8%] top-[38%] w-20 opacity-45 animate-drift" style={{ animationDelay: '3s' }} />
        <Butterfly className="absolute top-1/4 right-[18%] w-10 opacity-80 animate-flutter" />
        <Butterfly className="absolute top-2/3 left-[12%] w-8 opacity-70 animate-flutter" style={{ animationDelay: '2.4s' }} />
        <Flower color="#F4A6C0" className="absolute top-[20%] left-[6%] w-8 opacity-70 animate-bob" />
        <Flower color="#B79CE0" className="absolute bottom-[18%] right-[8%] w-9 opacity-70 animate-bob" style={{ animationDelay: '1.2s' }} />
        <Leaf className="absolute top-1/2 right-[10%] w-7 opacity-60 animate-flutter" style={{ animationDelay: '3s' }} />
        <Tree className="absolute -bottom-4 right-[4%] w-24 opacity-55" />
        <GrassTuft className="absolute bottom-0 left-[18%] w-20 opacity-55" />
      </div>}

      {!isFocusMode && <Sidebar />}
      <div className="flex-1 min-w-0 flex flex-col">
        {!isFocusMode && <TopBar />}
        <main className={isFocusMode ? 'flex-1' : 'flex-1 pb-24 md:pb-10'}>
          <Outlet />
        </main>
      </div>
      {!isFocusMode && <MobileNav />}
    </div>
  );
}
