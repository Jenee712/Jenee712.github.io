import { useState, useEffect, useRef, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mascot } from '@/components/characters/Mascot';
import { useAppStore } from '@/store/useAppStore';
import type { AvatarKey, BattleRecord } from '@/types';
import clsx from 'clsx';

type Phase = 'select' | 'play' | 'result';

interface PilotStats {
  attack: number; // 子弹伤害
  guard: number; // 护甲 / 减伤
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

// 8 位贴纸飞行员，沿用原本的角色与数值
const PILOTS: Pilot[] = [
  { key: 'corgi',  name: '柯基豆豆', emoji: '🐶', stats: { attack: 8, guard: 6, speed: 9 },  desc: '射速快·火力猛',   skill: { name: '机关枪扫射', emoji: '💥', desc: '短时间射速翻倍' } },
  { key: 'cat',    name: '橘猫橙橙', emoji: '🐱', stats: { attack: 7, guard: 7, speed: 7 },  desc: '攻防均衡型',     skill: { name: '紧急闪避',   emoji: '🐱', desc: '短时间不受伤' } },
  { key: 'bear',   name: '小熊咕咕', emoji: '🐻', stats: { attack: 6, guard: 9, speed: 5 },  desc: '护甲最厚·耐打', skill: { name: '装甲护盾',   emoji: '🛡️', desc: '获得 40 点护盾' } },
  { key: 'deer',   name: '小鹿闪闪', emoji: '🦌', stats: { attack: 9, guard: 5, speed: 8 },  desc: '火力最强·爆发高', skill: { name: '激光狙击',   emoji: '✨', desc: '立即击毁一架敌机' } },
  { key: 'rabbit', name: '兔兔邮差', emoji: '🐰', stats: { attack: 7, guard: 6, speed: 9 },  desc: '速度极快·先手多', skill: { name: '极速射击',   emoji: '⚡', desc: '连续射出 3 发' } },
  { key: 'bird',   name: '小鸟啾啾', emoji: '🐦', stats: { attack: 6, guard: 5, speed: 10 }, desc: '速度王·灵活型',   skill: { name: '旋风飓风',   emoji: '🌪️', desc: '全场敌机减半血量' } },
  { key: 'penguin',name: '企鹅圆圆', emoji: '🐧', stats: { attack: 8, guard: 8, speed: 5 },  desc: '重装型·攻防兼备', skill: { name: '冰冻力场',   emoji: '❄️', desc: '敌机暂停 3 秒' } },
  { key: 'lop',    name: '垂耳暖暖', emoji: '🐨', stats: { attack: 7, guard: 7, speed: 7 },  desc: '爱心型·幸运加成', skill: { name: '幸运祝福',   emoji: '💖', desc: '回复 30 点血量' } },
];

const ENEMY_NAMES = ['暗影战机', '火焰飞龙', '冰霜巨人', '雷电风暴', '森林守护者', '深海漩涡'];
const ENEMY_CHARS: AvatarKey[] = ['corgi', 'cat', 'bear', 'deer', 'rabbit', 'bird', 'penguin', 'lop'];

// ---------- 满屏方阵设定 ----------
const GRID_COLS = 10;
const GRID_ROWS = 10;
const TOTAL_PLANES = GRID_COLS * GRID_ROWS; // 100 台
const DESCEND_RATE = 0.05;   // 方阵每 tick 下压幅度（百分比）
const SWAY_RATE = 0.22;      // 方阵左右摆动幅度（百分比）
const SWAY_LIMIT = 7;        // 摆动边界
const LOSE_LINE = 82;        // 敌机压到这条线就输

function colX(c: number) { return 6 + (c * (88 / (GRID_COLS - 1))); }   // 6% ~ 94%
function baseRowY(r: number) { return 9 + r * 3.9; }                     // 9% ~ 44.1%

function isEliteCell(row: number, col: number) {
  // 6 个精英机（⭐）分散在方阵四角与中段，会向下反击
  return (
    (row === 0 && (col === 0 || col === 9)) ||
    (row === 9 && (col === 0 || col === 9)) ||
    (row === 4 && (col === 4 || col === 5))
  );
}

// ---------- 游戏内部状态 ----------
interface Enemy {
  id: number;
  x: number;       // 0~100 百分比（由方阵格 + 偏移计算后填入）
  y: number;       // 0~100 百分比
  hp: number;
  maxHp: number;
  char: AvatarKey;
  elite?: boolean;
  col: number;
  row: number;
  lastShot: number;
}
interface Bullet {
  id: number;
  x: number;
  y: number;
  targetId: number; // -1 = 直上（方阵普通子弹）；>=0 = 追踪（技能）
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
  playerX: number;
  playerXTarget: number;
  playerHp: number;
  playerShield: number;
  spawned: number;
  total: number;
  kills: number;
  lastFire: number;
  fireBoostUntil: number;
  invulnUntil: number;
  freezeUntil: number;
  finished: boolean;
  nextId: number;
  formationY: number;  // 方阵下压偏移
  formationX: number;  // 方阵左右偏移
  formationDir: number;
}

function bulletLevelOf(kills: number) {
  return Math.min(5, 1 + Math.floor(kills / 8));
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
  const [hpView, setHpView] = useState(100);
  const [shieldView, setShieldView] = useState(0);
  const fieldRef = useRef<HTMLDivElement>(null);

  const game = useRef<GameState>({
    enemies: [], bullets: [], enemyBullets: [],
    playerX: 50, playerXTarget: 50,
    playerHp: 100, playerShield: 0,
    spawned: TOTAL_PLANES, total: TOTAL_PLANES, kills: 0,
    lastFire: 0, fireBoostUntil: 0, invulnUntil: 0, freezeUntil: 0,
    finished: false, nextId: 1,
    formationY: 0, formationX: 0, formationDir: 1,
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

    // 摆好 100 台敌机方阵
    const enemies: Enemy[] = [];
    let id = 1;
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const elite = isEliteCell(row, col);
        const maxHp = elite ? 6 : 2 + Math.floor((GRID_ROWS - 1 - row) / 4); // 越上排越厚
        enemies.push({
          id: id++,
          x: colX(col),
          y: baseRowY(row),
          hp: maxHp, maxHp,
          char: ENEMY_CHARS[Math.floor(Math.random() * ENEMY_CHARS.length)],
          elite,
          col, row,
          lastShot: Date.now() + 1500 + Math.random() * 2000,
        });
      }
    }

    game.current = {
      enemies, bullets: [], enemyBullets: [],
      playerX: 50, playerXTarget: 50,
      playerHp: 100, playerShield: 0,
      spawned: TOTAL_PLANES, total: TOTAL_PLANES, kills: 0,
      lastFire: 0, fireBoostUntil: 0, invulnUntil: 0, freezeUntil: 0,
      finished: false, nextId: id,
      formationY: 0, formationX: 0, formationDir: 1,
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
        const target = [...g.enemies].sort((a, b) => a.hp - b.hp)[0];
        if (target) { g.enemies = g.enemies.filter(e => e.id !== target.id); g.kills += 1; }
        break;
      }
      case 'rabbit': {
        const targets = [...g.enemies].sort((a, b) => b.y - a.y).slice(0, 3);
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

  // 直上子弹：依等级散射（多发），不追踪，靠通道碰撞打中同列敌机
  const fireStraight = () => {
    const g = game.current;
    if (!pilot) return;
    const lvl = bulletLevelOf(g.kills);
    const count = lvl; // 1~5 发
    const baseDmg = pilot.stats.attack + Math.floor(studyBonus / 2) + (lvl - 1) * 3;
    const span = 22;
    for (let i = 0; i < count; i++) {
      const off = count === 1 ? 0 : -span / 2 + (span * i) / (count - 1);
      g.bullets.push({ id: g.nextId++, x: clamp(g.playerX + off, 0, 100), y: 84, targetId: -1, dmg: baseDmg });
    }
  };

  // 手动点击：飞机飞向点的位置并射一轮
  const manualFire = (clientX?: number, rect?: DOMRect | null) => {
    const g = game.current;
    if (g.finished) return;
    if (clientX != null && rect) {
      g.playerXTarget = clamp(((clientX - rect.left) / rect.width) * 100, 4, 96);
    }
    fireStraight();
    force();
  };

  // 主游戏循环
  useEffect(() => {
    if (phase !== 'play') return;
    const iv = setInterval(() => {
      const g = game.current;
      if (g.finished || !pilot) return;
      const now = Date.now();

      // 结算
      if (g.playerHp <= 0) {
        g.finished = true; setResult('lose'); setPhase('result'); finishBattle('lose'); return;
      }
      if (g.enemies.length === 0) {
        g.finished = true; setResult('win'); setPhase('result'); finishBattle('win'); return;
      }

      const frozen = now < g.freezeUntil;
      const dmgReduce = Math.floor(pilot.stats.guard / 5);

      // 飞机平滑移动
      if (Math.abs(g.playerX - g.playerXTarget) > 0.5) {
        g.playerX += (g.playerXTarget - g.playerX) * 0.18;
      } else {
        g.playerX = g.playerXTarget;
      }

      if (!frozen) {
        // 方阵整体摆动 + 缓缓下压
        g.formationX += g.formationDir * SWAY_RATE;
        if (g.formationX > SWAY_LIMIT) { g.formationX = SWAY_LIMIT; g.formationDir = -1; }
        else if (g.formationX < -SWAY_LIMIT) { g.formationX = -SWAY_LIMIT; g.formationDir = 1; }
        g.formationY += DESCEND_RATE;

        // 更新每架敌机座标
        let lowestY = 0;
        for (const e of g.enemies) {
          e.x = clamp(colX(e.col) + g.formationX, 2, 98);
          e.y = baseRowY(e.row) + g.formationY;
          if (e.y > lowestY) lowestY = e.y;
        }
        // 敌机压到我头上 → 直接落败
        if (lowestY >= LOSE_LINE) {
          g.finished = true; setResult('lose'); setPhase('result'); finishBattle('lose'); return;
        }

        // 精英机向下反击
        const enemyBulletDmg = 7;
        for (const e of g.enemies) {
          if (e.elite && now > e.lastShot) {
            e.lastShot = now + 1800 + Math.random() * 1400;
            g.enemyBullets.push({ id: g.nextId++, x: e.x, y: e.y, dmg: enemyBulletDmg });
          }
        }
      }

      // 自动开火（直上散射）
      const interval = (now < g.fireBoostUntil ? 200 : 600 - pilot.stats.speed * 38);
      if (now - g.lastFire > interval) {
        g.lastFire = now;
        fireStraight();
      }

      // 子弹移动 + 碰撞
      g.bullets = g.bullets.filter(b => {
        if (b.targetId >= 0) {
          // 追踪型（技能子弹）
          const t = g.enemies.find(e => e.id === b.targetId);
          if (!t) { b.y -= 7; return b.y > 0; }
          const dx = t.x - b.x, dy = t.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 5) {
            t.hp -= b.dmg;
            if (t.hp <= 0) { g.enemies = g.enemies.filter(e => e.id !== t.id); g.kills += 1; }
            return false;
          }
          b.x += (dx / dist) * 7; b.y += (dy / dist) * 7;
          return true;
        }
        // 直上型：命中同通道（x 接近）且在本格附近的敌机
        b.y -= 7;
        if (b.y < 0) return false;
        let hit: Enemy | null = null, bestY = -999;
        for (const e of g.enemies) {
          if (Math.abs(e.x - b.x) < 3.6 && e.y <= b.y + 6 && e.y >= b.y - 3) {
            if (e.y > bestY) { bestY = e.y; hit = e; }
          }
        }
        if (hit) {
          hit.hp -= b.dmg;
          if (hit.hp <= 0) { g.enemies = g.enemies.filter(e => e.id !== hit!.id); g.kills += 1; }
          return false;
        }
        return true;
      });

      // 敌方反击弹下移
      g.enemyBullets = g.enemyBullets.filter(eb => {
        eb.y += 2.6;
        if (eb.y >= 84) {
          if (Math.abs(eb.x - g.playerX) < 7) {
            const dmg = eb.dmg;
            if (now < g.invulnUntil) { /* 免伤 */ }
            else if (g.playerShield > 0) {
              const absorbed = Math.min(g.playerShield, dmg);
              g.playerShield -= absorbed; setShieldView(g.playerShield);
              const left = dmg - absorbed;
              if (left > 0) g.playerHp = clamp(g.playerHp - left, 0, 100);
            } else {
              g.playerHp = clamp(g.playerHp - dmg, 0, 100);
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

  // 键盘控制
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
    const coins = res === 'win' ? 30 + studyBonus : 5;
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
      award(sid, '飞机大战胜利', 'daily_task').catch(() => {});
    }
  };

  const reset = () => {
    setPhase('select');
    setPilot(null);
    setResult(null);
    setShowRecords(false);
  };

  // ---- 选机阶段 ----
  if (phase === 'select') {
    return (
      <div className="container-forest pt-6">
        <header className="card-leaf p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="text-6xl">✈️</div>
          <div className="flex-1 min-w-0">
            <h1 className="type-h1">飞机大战 · 百机方阵 ✈️</h1>
            <p className="type-body text-forest-700/90 mt-1">选择你的贴纸飞行员，击落天上 <b>100 台</b> 敌机方阵！方阵会整体缓缓下压，别让它压到你头上。点画面左右移动飞机、连续击落会让子弹升级（散射更多）。今天完成 {doneTasks} 个任务，火力加成 +{studyBonus}。</p>
          </div>
          {battleRecords.length > 0 && (
            <button onClick={() => setShowRecords(!showRecords)} className="btn-ghost tap whitespace-nowrap">
              📊 战绩 {wins}胜{losses}负
            </button>
          )}
        </header>

        {showRecords && (
          <section className="mt-4 card p-5 animate-pop">
            <h2 className="type-h2 mb-3">📊 对战记录（胜率 {winRate}%）</h2>
            {battleRecords.length === 0 ? (
              <p className="text-forest-600/80">还没有对战记录，快去打一场吧！</p>
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
          <h2 className="type-h2 mb-3">选择你的飞行员</h2>
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

  // ---- 对战阶段 ----
  if (phase === 'play' && pilot) {
    const g = game.current;
    const remaining = g.enemies.length;
    return (
      <div className="container-forest pt-4">
        {/* 顶部状态条 */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => { game.current.finished = true; setResult('lose'); setPhase('result'); finishBattle('lose'); }} className="btn-ghost tap text-sm">🚪 撤退</button>
          <div className="flex-1 text-center text-sm text-forest-600">
            击落 <span className="font-display font-bold text-forest-800">{g.kills}</span> / 剩余敌机 <span className="font-display font-bold text-forest-800">{remaining}</span>
            <span className="ml-2 inline-block px-2 py-0.5 rounded-full bg-sun-400/20 text-soil-600 text-xs font-display font-bold">子弹 Lv.{bulletLevelOf(g.kills)}</span>
          </div>
          <button onClick={() => setShowRecords(false)} className="text-xs text-forest-400">✈️ 飞机大战</button>
        </div>

        {/* 天空战场 */}
        <div
          ref={fieldRef}
          onClick={(e) => {
            const rect = fieldRef.current?.getBoundingClientRect();
            manualFire(e.clientX, rect);
          }}
          className="relative w-full max-w-2xl mx-auto h-[62vh] rounded-barn overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-cream-100 ring-2 ring-sky-300 select-none touch-manipulation cursor-pointer"
          style={{ touchAction: 'manipulation' }}
        >
          {/* 云朵装饰 */}
          <div className="absolute top-6 left-6 text-3xl opacity-70 pointer-events-none">☁️</div>
          <div className="absolute top-16 right-10 text-2xl opacity-60 pointer-events-none">☁️</div>
          <div className="absolute top-32 left-1/3 text-2xl opacity-50 pointer-events-none">☁️</div>

          {/* 危险线 */}
          <div className="absolute inset-x-0 pointer-events-none" style={{ top: `${LOSE_LINE}%` }}>
            <div className="border-t-2 border-dashed border-rose-400/70" />
          </div>

          {/* 敌机方阵 */}
          {g.enemies.map(e => (
            <div
              key={e.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${e.x}%`, top: `${e.y}%` }}
            >
              <div className="text-xl drop-shadow leading-none">{e.elite ? '🛸' : '🛩️'}</div>
              {e.elite && <div className="text-[9px] -mb-0.5">⭐</div>}
              <div className="w-7 h-1 mt-0.5 rounded-full bg-cream-200 overflow-hidden">
                <div className="h-full bg-soil-500" style={{ width: `${(e.hp / e.maxHp) * 100}%` }} />
              </div>
            </div>
          ))}

          {/* 我方子弹 */}
          {g.bullets.map(b => (
            <div
              key={b.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-3 rounded-full bg-sun-500 shadow"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            />
          ))}

          {/* 敌方反击弹 */}
          {g.enemyBullets.map(eb => (
            <div
              key={eb.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-300 shadow"
              style={{ left: `${eb.x}%`, top: `${eb.y}%` }}
            />
          ))}

          {/* 玩家飞机 */}
          <div className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center" style={{ left: `${g.playerX}%` }}>
            <div className="w-12"><Mascot name={pilot.key} size={48} withShadow={false} /></div>
            <div className="text-3xl drop-shadow -mt-1">🚀</div>
          </div>

          {/* 操作提示 */}
          <div className="absolute inset-x-0 bottom-1 text-center text-[11px] text-forest-600/70 pointer-events-none">
            点画面飞过去并射击 · 键盘 ← → 移动 ✨
          </div>
        </div>

        {/* 玩家状态 + 技能 */}
        <div className="mt-3 max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-forest-600 mb-1">我方机体血量</div>
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

  // ---- 结果阶段 ----
  if (phase === 'result' && result && pilot) {
    const coins = result === 'win' ? 30 + studyBonus : 5;
    return (
      <div className="container-forest pt-6 flex flex-col items-center">
        <div className={clsx('card-leaf p-8 text-center max-w-md w-full animate-pop', result === 'win' && 'ring-4 ring-sun-400/50')}>
          <div className="text-6xl mb-3">{result === 'win' ? '🏆' : '💪'}</div>
          <h1 className={clsx('type-h1', result === 'win' ? 'text-sun-600' : 'text-forest-700')}>
            {result === 'win' ? '百机全灭！' : '方阵压境…'}
          </h1>
          <p className="type-body text-forest-700 mt-2">
            {pilot.name} {result === 'win' ? '成功击落了全部 100 台' : '不敌'} {enemyName} 敌机方阵
          </p>
          <div className="mt-2 text-sm text-forest-600">本次击落 <span className="font-display font-bold text-forest-800">{game.current.kills}</span> 架</div>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-barn bg-sun-400/20">
            <span className="text-2xl">🪙</span>
            <span className="font-display font-bold text-soil-700">+{coins} 金币</span>
          </div>
          {result === 'win' && (
            <p className="text-sm text-forest-600/80 mt-3">🎉 还获得了一张随机贴纸奖励！</p>
          )}
          {skillUsed && (
            <p className="text-xs text-sun-600 mt-2">🔥 本场使用了技能「{pilot.skill.name}」</p>
          )}
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <span className="text-forest-600">累计 {battleRecords.length} 场</span>
            <span className="text-sun-600 font-bold">{wins}胜</span>
            <span className="text-forest-500">{losses}负</span>
            <span className="text-forest-600">胜率 {winRate}%</span>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={reset} className="btn-primary-lg tap">🔄 再战一场</button>
            <button onClick={() => nav('/')} className="btn-ghost tap">返回首页</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
