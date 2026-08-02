import { useState, useEffect, useRef, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mascot } from '@/components/characters/Mascot';
import { useAppStore } from '@/store/useAppStore';
import type { AvatarKey, BattleRecord } from '@/types';
import clsx from 'clsx';

type Phase = 'select' | 'play' | 'result';

interface PilotStats {
  attack: number; // 子彈傷害
  guard: number; // 護甲 / 減傷
  speed: number; // 射速
}

interface Skill {
  name: string;
  emoji: string;
  desc: string;
}

interface Pilot {
  key: AvatarKey;
  name: string;
  emoji: string;
  stats: PilotStats;
  desc: string;
  skill: Skill;
}

// 8 位貼紙飛行員，沿用原本的角色與數值
const PILOTS: Pilot[] = [
  { key: 'corgi',  name: '柯基豆豆', emoji: '🐶', stats: { attack: 8, guard: 6, speed: 9 },  desc: '射速快·火力猛',   skill: { name: '機關槍掃射', emoji: '💥', desc: '短時間射速翻倍' } },
  { key: 'cat',    name: '橘貓橙橙', emoji: '🐱', stats: { attack: 7, guard: 7, speed: 7 },  desc: '攻防均衡型',     skill: { name: '緊急閃避',   emoji: '🐱', desc: '短時間不受傷' } },
  { key: 'bear',   name: '小熊咕咕', emoji: '🐻', stats: { attack: 6, guard: 9, speed: 5 },  desc: '護甲最厚·耐打', skill: { name: '裝甲護盾',   emoji: '🛡️', desc: '獲得 40 點護盾' } },
  { key: 'deer',   name: '小鹿閃閃', emoji: '🦌', stats: { attack: 9, guard: 5, speed: 8 },  desc: '火力最強·爆發高', skill: { name: '雷射狙擊',   emoji: '✨', desc: '立即擊毀一架敵機' } },
  { key: 'rabbit', name: '兔兔郵差', emoji: '🐰', stats: { attack: 7, guard: 6, speed: 9 },  desc: '速度極快·先手多', skill: { name: '極速射擊',   emoji: '⚡', desc: '連續射出 3 發' } },
  { key: 'bird',   name: '小鳥啾啾', emoji: '🐦', stats: { attack: 6, guard: 5, speed: 10 }, desc: '速度王·靈活型',   skill: { name: '旋風颶風',   emoji: '🌪️', desc: '全場敵機減半血量' } },
  { key: 'penguin',name: '企鵝圓圓', emoji: '🐧', stats: { attack: 8, guard: 8, speed: 5 },  desc: '重裝型·攻防兼備', skill: { name: '冰凍力場',   emoji: '❄️', desc: '敵機暫停 3 秒' } },
  { key: 'lop',    name: '垂耳暖暖', emoji: '🐨', stats: { attack: 7, guard: 7, speed: 7 },  desc: '愛心型·幸運加成', skill: { name: '幸運祝福',   emoji: '💖', desc: '回復 30 點血量' } },
];

const ENEMY_NAMES = ['暗影戰機', '火焰飛龍', '冰霜巨人', '雷電風暴', '森林守護者', '深海漩渦'];
const ENEMY_CHARS: AvatarKey[] = ['corgi', 'cat', 'bear', 'deer', 'rabbit', 'bird', 'penguin', 'lop'];

// ---------- 遊戲內部狀態 ----------
interface Enemy {
  id: number;
  x: number;       // 0~100 百分比
  y: number;       // 0~100 百分比（0=頂部, 100=底部）
  hp: number;
  maxHp: number;
  char: AvatarKey;
  vy: number;      // 每 tick 下移量
  elite?: boolean; // 精英機（⭐，會向下射擊）
  lastShot: number;
}
interface Bullet {
  id: number;
  x: number;
  y: number;
  targetId: number;
  dmg: number;
}
interface EnemyBullet {
  id: number;
  x: number;
  y: number;
  dmg: number;
}
interface GameState {
  enemies: Enemy[];
  bullets: Bullet[];
  enemyBullets: EnemyBullet[];
  playerX: number;        // 0~100 百分比（飛機水平位置）
  playerXTarget: number;  // 平滑移動目標
  playerHp: number;
  playerShield: number;
  spawned: number;
  total: number;
  kills: number;
  lastFire: number;
  lastSpawn: number;
  fireBoostUntil: number;
  invulnUntil: number;
  freezeUntil: number;
  finished: boolean;
  nextId: number;
}

// 子彈等級：每擊落 5 架升一級（最多 5 級）
function bulletLevelOf(kills: number) {
  return Math.min(5, 1 + Math.floor(kills / 5));
}
// 敵機等級：依生成序號遞增，每 4 架出現一隻精英機
function enemyTierOf(spawned: number) {
  return 1 + Math.floor(spawned / 4);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function BattlePage() {
  const nav = useNavigate();
  const tasks = useAppStore(s => s.tasks);
  const award = useAppStore(s => s.awardSticker);
  const battleRecords = useAppStore(s => s.battleRecords);
  const addBattleRecord = useAppStore(s => s.addBattleRecord);

  const [phase, setPhase] = useState<Phase>('select');
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [enemyName, setEnemyName] = useState('');
  const [enemyChar, setEnemyChar] = useState<AvatarKey>('corgi');
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [skillUsed, setSkillUsed] = useState(false);
  const [showRecords, setShowRecords] = useState(false);
  const [hpView, setHpView] = useState(100); // 用於進度條平滑顯示
  const [shieldView, setShieldView] = useState(0);
  const fieldRef = useRef<HTMLDivElement>(null);

  // 遊戲狀態放在 ref，避免 setInterval 閉包拿到舊值
  const game = useRef<GameState>({
    enemies: [], bullets: [], enemyBullets: [],
    playerX: 50, playerXTarget: 50,
    playerHp: 100, playerShield: 0,
    spawned: 0, total: 12, kills: 0,
    lastFire: 0, lastSpawn: 0, fireBoostUntil: 0, invulnUntil: 0, freezeUntil: 0,
    finished: false, nextId: 1,
  });
  const [, force] = useReducer(x => x + 1, 0);

  const doneTasks = tasks.filter(t => t.done && t.kind === 'normal').length;
  const studyBonus = Math.min(doneTasks * 2, 10);

  const wins = battleRecords.filter(r => r.result === 'win').length;
  const losses = battleRecords.filter(r => r.result === 'lose').length;
  const winRate = battleRecords.length > 0 ? Math.round((wins / battleRecords.length) * 100) : 0;

  const startBattle = (p: Pilot) => {
    const eName = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)];
    const eChar = ENEMY_CHARS[Math.floor(Math.random() * ENEMY_CHARS.length)];
    setPilot(p);
    setEnemyName(eName);
    setEnemyChar(eChar);
    setResult(null);
    setSkillUsed(false);
    setHpView(100);
    setShieldView(0);
    game.current = {
      enemies: [], bullets: [], enemyBullets: [],
      playerX: 50, playerXTarget: 50,
      playerHp: 100, playerShield: 0,
      spawned: 0, total: 12 + Math.floor(studyBonus / 2),
      kills: 0, lastFire: 0, lastSpawn: 0, fireBoostUntil: 0, invulnUntil: 0, freezeUntil: 0,
      finished: false, nextId: 1,
    };
    setPhase('play');
  };

  // 使用技能
  const useSkill = () => {
    if (!pilot || skillUsed || game.current.finished) return;
    const g = game.current;
    setSkillUsed(true);
    switch (pilot.key) {
      case 'corgi':  g.fireBoostUntil = Date.now() + 4000; break;
      case 'cat':    g.invulnUntil = Date.now() + 4000; break;
      case 'bear':   g.playerShield = 40; setShieldView(40); break;
      case 'deer': {
        // 立即擊毀當前血量最低的一架敵機
        const target = [...g.enemies].sort((a, b) => a.hp - b.hp)[0];
        if (target) { g.enemies = g.enemies.filter(e => e.id !== target.id); g.kills += 1; }
        break;
      }
      case 'rabbit': {
        // 立刻對最近的 3 架補 3 發子彈
        const targets = [...g.enemies].sort((a, b) => a.y - b.y).slice(0, 3);
        for (const t of targets) {
          g.bullets.push({ id: g.nextId++, x: g.playerX, y: 84, targetId: t.id, dmg: pilot.stats.attack + Math.floor(studyBonus / 2) });
        }
        break;
      }
      case 'bird':
        g.enemies = g.enemies.map(e => ({ ...e, hp: Math.ceil(e.hp / 2) }));
        break;
      case 'penguin': g.freezeUntil = Date.now() + 3000; break;
      case 'lop':
        g.playerHp = clamp(g.playerHp + 30, 0, 100); setHpView(g.playerHp);
        break;
    }
    force();
  };

  // 發射一輪子彈：依等級散射（多發 + 傷害提升），從飛機當前位置出發
  const fireSpread = (targetId: number) => {
    const g = game.current;
    if (!pilot) return;
    const lvl = bulletLevelOf(g.kills);
    const count = lvl; // 1~5 發
    const baseDmg = pilot.stats.attack + Math.floor(studyBonus / 2) + (lvl - 1) * 3;
    const span = 16; // 散射水平跨度（百分比）
    for (let i = 0; i < count; i++) {
      const off = count === 1 ? 0 : -span / 2 + (span * i) / (count - 1);
      g.bullets.push({ id: g.nextId++, x: clamp(g.playerX + off, 0, 100), y: 84, targetId, dmg: baseDmg });
    }
  };

  // 手動點擊：飛機飛向點的位置，並對最近敵機集火一輪
  const manualFire = (clientX?: number, rect?: DOMRect | null) => {
    const g = game.current;
    if (g.finished) return;
    if (clientX != null && rect) {
      g.playerXTarget = clamp(((clientX - rect.left) / rect.width) * 100, 4, 96);
    }
    const target = [...g.enemies].sort((a, b) => a.y - b.y)[0];
    if (!target || !pilot) return;
    fireSpread(target.id);
    force();
  };

  // 主遊戲循環
  useEffect(() => {
    if (phase !== 'play') return;
    const iv = setInterval(() => {
      const g = game.current;
      if (g.finished || !pilot) return;
      const now = Date.now();

      // 結算
      if (g.playerHp <= 0) {
        g.finished = true;
        setResult('lose'); setPhase('result');
        finishBattle('lose');
        return;
      }
      if (g.spawned >= g.total && g.enemies.length === 0) {
        g.finished = true;
        setResult('win'); setPhase('result');
        finishBattle('win');
        return;
      }

      const frozen = now < g.freezeUntil;

      // 飛機平滑移動到目標 x
      if (Math.abs(g.playerX - g.playerXTarget) > 0.5) {
        g.playerX += (g.playerXTarget - g.playerX) * 0.18;
      } else {
        g.playerX = g.playerXTarget;
      }

      // 生成敵機（越後面越強，每 4 架出一隻精英機）
      if (g.spawned < g.total && now - g.lastSpawn > 1100) {
        g.lastSpawn = now;
        g.spawned += 1;
        const tier = enemyTierOf(g.spawned);
        const elite = g.spawned % 4 === 0;
        const maxHp = 8 + Math.floor(Math.random() * 9) + tier * 4 + (elite ? 18 : 0);
        g.enemies.push({
          id: g.nextId++,
          x: 12 + Math.random() * 76,
          y: 4,
          hp: maxHp, maxHp,
          char: ENEMY_CHARS[Math.floor(Math.random() * ENEMY_CHARS.length)],
          vy: 0.18 + Math.random() * 0.14 + tier * 0.04,
          elite,
          lastShot: now + 900 + Math.random() * 1200,
        });
      }

      // 自動開火（依子彈等級散射）
      const interval = (now < g.fireBoostUntil ? 230 : 620 - pilot.stats.speed * 38);
      if (now - g.lastFire > interval) {
        g.lastFire = now;
        const target = [...g.enemies].sort((a, b) => a.y - b.y)[0];
        if (target) fireSpread(target.id);
      }

      // 子彈移動 + 碰撞
      const dmgReduce = Math.floor(pilot.stats.guard / 5);
      g.bullets = g.bullets.filter(b => {
        const t = g.enemies.find(e => e.id === b.targetId);
        if (!t) { b.y -= 4; return b.y > 0; }
        const dx = t.x - b.x, dy = t.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 5) {
          t.hp -= b.dmg;
          if (t.hp <= 0) { g.enemies = g.enemies.filter(e => e.id !== t.id); g.kills += 1; }
          return false;
        }
        b.x += (dx / dist) * 6;
        b.y += (dy / dist) * 6;
        return true;
      });

      // 敵機下移 + 精英機向下射擊
      const enemyBulletDmg = 8 + Math.floor(g.spawned / 5);
      if (!frozen) {
        g.enemies = g.enemies.filter(e => {
          e.y += e.vy;
          // 精英機定期向玩家方向射出反擊彈
          if (e.elite && now > e.lastShot) {
            e.lastShot = now + 1500 + Math.random() * 1100;
            g.enemyBullets.push({ id: g.nextId++, x: e.x, y: e.y, dmg: enemyBulletDmg });
          }
          if (e.y >= 86) {
            const dmg = Math.max(6, 12 - dmgReduce);
            if (now < g.invulnUntil) { /* 不受傷 */ }
            else if (g.playerShield > 0) {
              const absorbed = Math.min(g.playerShield, dmg);
              g.playerShield -= absorbed; setShieldView(g.playerShield);
              const left = dmg - absorbed;
              if (left > 0) g.playerHp = clamp(g.playerHp - left, 0, 100);
            } else {
              g.playerHp = clamp(g.playerHp - dmg, 0, 100);
            }
            setHpView(g.playerHp);
            return false;
          }
          return true;
        });
      }

      // 敵方反擊彈下移：到玩家機水平線時判定命中，可左右移動躲避
      g.enemyBullets = g.enemyBullets.filter(eb => {
        eb.y += 2.4;
        if (eb.y >= 86) {
          if (Math.abs(eb.x - g.playerX) < 7) {
            if (now < g.invulnUntil) { /* 免傷 */ }
            else if (g.playerShield > 0) {
              const absorbed = Math.min(g.playerShield, eb.dmg);
              g.playerShield -= absorbed; setShieldView(g.playerShield);
              const left = eb.dmg - absorbed;
              if (left > 0) g.playerHp = clamp(g.playerHp - left, 0, 100);
            } else {
              g.playerHp = clamp(g.playerHp - eb.dmg, 0, 100);
            }
            setHpView(g.playerHp);
          }
          return false;
        }
        return true;
      });

      force();
    }, 60);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pilot, studyBonus]);

  // 鍵盤控制：左右鍵移動飛機，空白/下鍵集火
  useEffect(() => {
    if (phase !== 'play') return;
    const onKey = (e: KeyboardEvent) => {
      const g = game.current;
      if (e.key === 'ArrowLeft') { g.playerXTarget = clamp(g.playerXTarget - 8, 4, 96); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { g.playerXTarget = clamp(g.playerXTarget + 8, 4, 96); e.preventDefault(); }
      else if (e.key === ' ' || e.key === 'ArrowDown') { manualFire(); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, manualFire]);

  const finishBattle = (res: 'win' | 'lose') => {
    if (!pilot) return;
    const coins = res === 'win' ? 20 + studyBonus : 5;
    const now = new Date();
    const record: BattleRecord = {
      id: `br-${Date.now()}`,
      date: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`,
      playerTop: pilot.name,
      playerChar: pilot.key,
      enemyName,
      enemyChar,
      result: res,
      coins,
      rounds: game.current.kills,
      skillUsed,
    };
    addBattleRecord(record);
    if (res === 'win') {
      const stickers = ['corgi-cheer', 'bear-wow', 'deer-shine', 'cat-smug'];
      const sid = stickers[Math.floor(Math.random() * stickers.length)];
      award(sid, '飛機大戰勝利', 'daily_task').catch(() => {});
    }
  };

  const reset = () => {
    setPhase('select');
    setPilot(null);
    setResult(null);
    setShowRecords(false);
  };

  // ---- 選機階段 ----
  if (phase === 'select') {
    return (
      <div className="container-forest pt-6">
        <header className="card-leaf p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="text-6xl">✈️</div>
          <div className="flex-1 min-w-0">
            <h1 className="type-h1">飛機大戰 · 天空防衛戰 ✈️</h1>
            <p className="type-body text-forest-700/90 mt-1">選擇你的貼紙飛行員，點畫面左右移動飛機、擊落來襲敵機！連續擊落會讓子彈升級（散射更多），後段還會出現會反擊的⭐精英機。今天完成 {doneTasks} 個任務，火力加成 +{studyBonus}。</p>
          </div>
          {battleRecords.length > 0 && (
            <button onClick={() => setShowRecords(!showRecords)} className="btn-ghost tap whitespace-nowrap">
              📊 戰績 {wins}勝{losses}負
            </button>
          )}
        </header>

        {showRecords && (
          <section className="mt-4 card p-5 animate-pop">
            <h2 className="type-h2 mb-3">📊 對戰記錄（勝率 {winRate}%）</h2>
            {battleRecords.length === 0 ? (
              <p className="text-forest-600/80">還沒有對戰記錄，快去打一場吧！</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {battleRecords.map(r => (
                  <div key={r.id} className={clsx('flex items-center gap-3 p-2 rounded-barn text-sm', r.result === 'win' ? 'bg-sun-400/10' : 'bg-forest-100/50')}>
                    <span className="text-lg">{r.result === 'win' ? '🏆' : '💪'}</span>
                    <Mascot name={r.playerChar} size={32} />
                    <span className="font-display font-bold text-forest-800">{r.playerTop}</span>
                    <span className="text-forest-500 text-xs">VS</span>
                    <Mascot name={r.enemyChar} size={32} />
                    <span className="text-forest-600 text-xs flex-1 truncate">{r.enemyName}</span>
                    {r.skillUsed && <span className="text-xs px-1.5 py-0.5 rounded bg-sun-400/20 text-soil-600">技能</span>}
                    <span className="text-soil-600 font-bold text-xs">+{r.coins}🪙</span>
                    <span className="text-forest-400 text-xs whitespace-nowrap">{r.date}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mt-6">
          <h2 className="type-h2 mb-3">選擇你的飛行員</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {PILOTS.map(t => (
              <button
                key={t.key}
                onClick={() => startBattle(t)}
                className="card p-4 text-center hover:shadow-lift transition tap group"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-sky-100 ring-2 ring-sky-200 flex items-center justify-center group-hover:ring-sky-400 group-hover:scale-105 transition">
                  <Mascot name={t.key} size={56} />
                </div>
                <div className="font-display font-bold text-forest-800 mt-2">{t.name}</div>
                <div className="text-xs text-forest-600/80 mt-0.5">{t.desc}</div>
                <div className="mt-2 flex justify-center gap-1.5 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-sun-400/20 text-soil-600">攻{t.stats.attack}</span>
                  <span className="px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-600">防{t.stats.guard}</span>
                  <span className="px-1.5 py-0.5 rounded bg-forest-400/20 text-forest-600">速{t.stats.speed}</span>
                </div>
                <div className="mt-2 p-1.5 rounded-barn bg-sun-400/10 ring-1 ring-sun-400/20">
                  <div className="text-[10px] font-bold text-soil-600">{t.skill.emoji} {t.skill.name}</div>
                  <div className="text-[9px] text-forest-600/80 leading-tight mt-0.5">{t.skill.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // ---- 對戰階段 ----
  if (phase === 'play' && pilot) {
    const g = game.current;
    return (
      <div className="container-forest pt-4">
        {/* 頂部狀態條 */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => { game.current.finished = true; setResult('lose'); setPhase('result'); finishBattle('lose'); }} className="btn-ghost tap text-sm">🚪 撤退</button>
          <div className="flex-1 text-center text-sm text-forest-600">
            擊落 <span className="font-display font-bold text-forest-800">{g.kills}</span> / 剩餘敵機 <span className="font-display font-bold text-forest-800">{g.enemies.length + (g.total - g.spawned)}</span>
            <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-sun-400/20 text-soil-600 text-xs font-display font-bold">子彈 Lv.{bulletLevelOf(g.kills)}</span>
          </div>
          <button onClick={() => setShowRecords(false)} className="text-xs text-forest-400">✈️ 飛機大戰</button>
        </div>

        {/* 天空戰場 */}
        <div
          ref={fieldRef}
          onClick={(e) => {
            const rect = fieldRef.current?.getBoundingClientRect();
            manualFire(e.clientX, rect);
          }}
          className="relative w-full max-w-2xl mx-auto h-[62vh] rounded-barn overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-cream-100 ring-2 ring-sky-300 select-none touch-manipulation cursor-pointer"
          style={{ touchAction: 'manipulation' }}
        >
          {/* 雲朵裝飾 */}
          <div className="absolute top-6 left-6 text-3xl opacity-70">☁️</div>
          <div className="absolute top-16 right-10 text-2xl opacity-60">☁️</div>
          <div className="absolute top-32 left-1/3 text-2xl opacity-50">☁️</div>

          {/* 敵機 */}
          {g.enemies.map(e => (
            <div
              key={e.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${e.x}%`, top: `${e.y}%` }}
            >
              <div className="text-2xl drop-shadow">{e.elite ? '🛸' : '🛩️'}</div>
              {e.elite && <div className="text-[10px] -mb-0.5">⭐</div>}
              <div className="w-7"><Mascot name={e.char} size={28} withShadow={false} /></div>
              <div className="w-10 h-1 mt-0.5 rounded-full bg-cream-200 overflow-hidden">
                <div className="h-full bg-soil-500" style={{ width: `${(e.hp / e.maxHp) * 100}%` }} />
              </div>
            </div>
          ))}

          {/* 我方子彈 */}
          {g.bullets.map(b => (
            <div
              key={b.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sun-500 shadow"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            />
          ))}

          {/* 敵方反擊彈 */}
          {g.enemyBullets.map(eb => (
            <div
              key={eb.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-300 shadow"
              style={{ left: `${eb.x}%`, top: `${eb.y}%` }}
            />
          ))}

          {/* 玩家飛機 */}
          <div className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center" style={{ left: `${g.playerX}%` }}>
            <div className="w-12"><Mascot name={pilot.key} size={48} withShadow={false} /></div>
            <div className="text-3xl drop-shadow -mt-1">🚀</div>
          </div>

          {/* 操作提示 */}
          <div className="absolute inset-x-0 bottom-1 text-center text-[11px] text-forest-600/70 pointer-events-none">
            點畫面飛過去並射擊 · 鍵盤 ← → 移動 ✨
          </div>
        </div>

        {/* 玩家狀態 + 技能 */}
        <div className="mt-3 max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-forest-600 mb-1">我方機體血量</div>
            <div className="h-5 rounded-full bg-cream-200 overflow-hidden ring-1 ring-forest-200">
              <div className="h-full bg-gradient-to-r from-forest-500 to-forest-400 transition-all duration-300 flex items-center justify-center text-[10px] text-cream-50 font-bold" style={{ width: `${hpView}%` }}>
                {hpView}
              </div>
            </div>
            {shieldView > 0 && (
              <div className="mt-1 h-2 rounded-full bg-cream-200 overflow-hidden ring-1 ring-sky-200">
                <div className="h-full bg-sky-400 transition-all" style={{ width: `${(shieldView / 40) * 100}%` }} />
              </div>
            )}
          </div>
          <button
            onClick={useSkill}
            disabled={skillUsed}
            className={clsx('tap rounded-barn px-4 py-3 text-sm font-display font-bold transition', skillUsed ? 'bg-cream-200 text-forest-400 cursor-not-allowed' : 'bg-gradient-to-r from-sun-400 to-sun-500 text-cream-50 hover:scale-105 animate-pulse')}
          >
            {skillUsed ? `${pilot.skill.emoji} 已用` : `${pilot.skill.emoji} ${pilot.skill.name}`}
          </button>
        </div>
        <p className="text-center text-[11px] text-forest-600/70 mt-1">{pilot.skill.desc}</p>
      </div>
    );
  }

  // ---- 結果階段 ----
  if (phase === 'result' && result && pilot) {
    const coins = result === 'win' ? 20 + studyBonus : 5;
    return (
      <div className="container-forest pt-6 flex flex-col items-center">
        <div className={clsx('card-leaf p-8 text-center max-w-md w-full animate-pop', result === 'win' && 'ring-4 ring-sun-400/50')}>
          <div className="text-6xl mb-3">{result === 'win' ? '🏆' : '💪'}</div>
          <h1 className={clsx('type-h1', result === 'win' ? 'text-sun-600' : 'text-forest-700')}>
            {result === 'win' ? '任務達成！' : '再接再厲！'}
          </h1>
          <p className="type-body text-forest-700 mt-2">
            {pilot.name} {result === 'win' ? '擊落了所有' : '不敵'} {enemyName} 敵機
          </p>
          <div className="mt-2 text-sm text-forest-600">本次擊落 <span className="font-display font-bold text-forest-800">{game.current.kills}</span> 架</div>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-barn bg-sun-400/20">
            <span className="text-2xl">🪙</span>
            <span className="font-display font-bold text-soil-700">+{coins} 金幣</span>
          </div>
          {result === 'win' && (
            <p className="text-sm text-forest-600/80 mt-3">🎉 還獲得了一張隨機貼紙獎勵！</p>
          )}
          {skillUsed && (
            <p className="text-xs text-sun-600 mt-2">🔥 本場使用了技能「{pilot.skill.name}」</p>
          )}
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <span className="text-forest-600">累計 {battleRecords.length} 場</span>
            <span className="text-sun-600 font-bold">{wins}勝</span>
            <span className="text-forest-500">{losses}負</span>
            <span className="text-forest-600">勝率 {winRate}%</span>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={reset} className="btn-primary-lg tap">🔄 再戰一場</button>
            <button onClick={() => nav('/')} className="btn-ghost tap">返回首頁</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
