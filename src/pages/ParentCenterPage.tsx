import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import clsx from 'clsx';
import { useAppStore } from '@/store/useAppStore';
import { Mascot } from '@/components/characters/Mascot';
import { ParentReportChart } from '@/components/ui/ParentReportChart';
import { DeviceSyncStatus } from '@/components/ui/DeviceSyncStatus';
import { WeeklyGoal } from '@/components/ui/WeeklyGoal';

type Tab = 'daily' | 'weekly' | 'weak' | 'plan' | 'difficulty' | 'remind' | 'rewards' | 'account';

const ENGLISH_COLOR = '#5B9742';
const MATH_COLOR = '#E9A23B';

export function ParentCenterPage() {
  const parentUnlocked = useAppStore(s => s.parentUnlocked);
  const lock = useAppStore(s => s.lockParent);
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>('daily');

  if (!parentUnlocked) return <Navigate to="/parent" replace />;

  return (
    <div className="container-forest pt-6">
      <header className="card-leaf p-5 flex flex-col md:flex-row md:items-center gap-4">
        <Mascot name="bear" size={84} />
        <div className="flex-1">
          <h1 className="type-h1">家长中心</h1>
          <p className="type-body text-forest-700/90 mt-1">查看报告、调整目标、确认现实奖励。所有改动会实时同步到孩子的设备。</p>
        </div>
        <button onClick={() => { lock(); nav('/'); }} className="btn-secondary">🔒 退出家长模式</button>
      </header>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist">
        {[
          { id: 'daily',      label: '每日报告',  emoji: '📈' },
          { id: 'weekly',     label: '每周报告',  emoji: '🗓️' },
          { id: 'weak',       label: '薄弱知识点', emoji: '🩹' },
          { id: 'plan',       label: '周计划',    emoji: '🧭' },
          { id: 'difficulty', label: '难度设置',  emoji: '🎚️' },
          { id: 'remind',     label: '提醒与屏幕时间', emoji: '⏰' },
          { id: 'rewards',    label: '现实奖励',  emoji: '🎁' },
          { id: 'account',    label: '账号与设备', emoji: '🛡️' },
        ].map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id as Tab)}
            className={clsx(
              'px-4 py-2 rounded-barn font-display font-semibold tap transition',
              tab === t.id ? 'bg-forest-700 text-cream-50 shadow-soft' : 'bg-cream-50 ring-1 ring-forest-200 text-forest-700',
            )}
          >
            <span aria-hidden className="mr-1">{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === 'daily'      && <DailyReport />}
        {tab === 'weekly'     && <WeeklyReport />}
        {tab === 'weak'       && <WeakPoints />}
        {tab === 'plan'       && <WeekPlan />}
        {tab === 'difficulty' && <Difficulty />}
        {tab === 'remind'     && <Reminder />}
        {tab === 'rewards'    && <Rewards />}
        {tab === 'account'    && <Account />}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="type-h3">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function DailyReport() {
  const kid = useAppStore(s => s.kid);
  const subjectProgress = useAppStore(s => s.subjectProgress);
  const streak = useAppStore(s => s.streak);

  const eng = subjectProgress.find(s => s.subject === 'english');
  const math = subjectProgress.find(s => s.subject === 'math');

  // 最近 7 天学习分钟（末位与今日实际分钟联动）
  const week = ['一', '二', '三', '四', '五', '六', '日'];
  const minutesSeed = [18, 22, 30, 25, 28, 35, kid.todayMinutes];
  const minutesData = week.map((d, i) => ({ label: `周${d}`, value: minutesSeed[i], color: ENGLISH_COLOR }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Section title="今日概览">
        <div className="grid grid-cols-2 gap-3">
          <KPI label="今日学习" value={`${kid.todayMinutes} 分`} />
          <KPI label="今日关卡" value={`${kid.todayLessonsDone} / ${kid.todayLessonsGoal}`} />
          <KPI label="连续打卡" value={`${streak.current} 天`} />
          <KPI label="森林金币" value={`${kid.coins}`} />
        </div>
        <div className="mt-4">
          <ParentReportChart title="最近 7 天学习分钟" variant="bar" unit="分" data={minutesData} />
        </div>
      </Section>

      <div className="space-y-4">
        <ParentReportChart
          title="学科时长占比"
          variant="donut"
          data={[
            { label: '英语', value: eng?.minutes ?? 0, color: ENGLISH_COLOR },
            { label: '数学', value: math?.minutes ?? 0, color: MATH_COLOR },
          ]}
        />
        <Section title="本周森林棋盘步数">
          <div className="flex items-center gap-2">
            <span className="pill pill-sun">🌿 {kid.weeklySteps} / {kid.weeklyStepGoal} 步</span>
            <span className="text-sm text-forest-600/80">距离周末大奖还差 {Math.max(0, kid.weeklyStepGoal - kid.weeklySteps)} 步</span>
          </div>
          <div className="mt-3 progress-track">
            <div className="progress-fill bg-sun-500" style={{ width: `${Math.min(100, (kid.weeklySteps / Math.max(1, kid.weeklyStepGoal)) * 100)}%` }} />
          </div>
        </Section>
      </div>
    </div>
  );
}

function WeeklyReport() {
  const subjectProgress = useAppStore(s => s.subjectProgress);
  const skillProgress = useAppStore(s => s.skillProgress);

  const engSkills = skillProgress.filter(s => ['letter_sound', 'phonics', 'sight_words', 'theme_words', 'sentences', 'reading'].includes(s.key));
  const mathSkills = skillProgress.filter(s => ['counting', 'add_sub', 'shapes', 'compare', 'clock', 'chart'].includes(s.key));

  const eng = subjectProgress.find(s => s.subject === 'english');
  const math = subjectProgress.find(s => s.subject === 'math');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="英语 · 本周">
          <div className="grid grid-cols-2 gap-3">
            <KPI label="本周分钟" value={`${eng?.weeklyMinutes ?? 0} 分`} />
            <KPI label="正确率" value={`${Math.round((eng?.accuracy ?? 0) * 100)}%`} />
            <KPI label="累计掌握" value={`${eng?.masteredCount ?? 0} 项`} />
            <KPI label="累计分钟" value={`${eng?.minutes ?? 0} 分`} />
          </div>
        </Section>
        <Section title="数学 · 本周">
          <div className="grid grid-cols-2 gap-3">
            <KPI label="本周分钟" value={`${math?.weeklyMinutes ?? 0} 分`} />
            <KPI label="正确率" value={`${Math.round((math?.accuracy ?? 0) * 100)}%`} />
            <KPI label="累计掌握" value={`${math?.masteredCount ?? 0} 项`} />
            <KPI label="累计分钟" value={`${math?.minutes ?? 0} 分`} />
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ParentReportChart
          title="英语六类技能掌握度"
          variant="bar"
          unit="%"
          data={engSkills.map(s => ({ label: s.label, value: Math.round(s.mastery * 100), color: ENGLISH_COLOR }))}
        />
        <ParentReportChart
          title="数学六类知识掌握度"
          variant="bar"
          unit="%"
          data={mathSkills.map(s => ({ label: s.label, value: Math.round(s.mastery * 100), color: MATH_COLOR }))}
        />
      </div>
    </div>
  );
}

function WeakPoints() {
  const reviewItems = useAppStore(s => s.reviewItems);
  const nav = useNavigate();

  const weak = reviewItems.filter(r => r.lastResult === 'retry' || r.attempts > 0);
  const list = (weak.length ? weak : reviewItems);

  return (
    <Section title="薄弱知识点（自动来自错题与复习）">
      <ul className="divide-y divide-forest-100">
        {list.map((it) => (
          <li key={it.itemId} className="py-3 flex items-center gap-3">
            <span className="pill pill-sun">复习 {it.attempts} 次</span>
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold text-forest-800">{it.prompt}</div>
              <div className="text-sm text-forest-600/80 truncate">来源：{it.source}{it.hint ? ` · 提示：${it.hint}` : ''}</div>
            </div>
            <span className="pill">{it.kind === 'math' ? '数学' : it.kind === 'letter' ? '字母' : it.kind === 'word' ? '单词' : '句型'}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => nav('/review')} className="btn-secondary mt-4 w-full sm:w-auto tap">进入复习小花园 →</button>
      <p className="text-sm text-forest-600/80 mt-2">复习以「浇水养小苗」呈现，不展示错题数量与排名，答错先给提示。</p>
    </Section>
  );
}

function WeekPlan() {
  const weeklyRewards = useAppStore(s => s.weeklyRewards);
  const completeWeeklyGoal = useAppStore(s => s.completeWeeklyGoal);
  const mission = useAppStore(s => s.mission);
  const confirmMission = useAppStore(s => s.confirmMission);

  const plan = [
    { day: '周一', en: '字母音 /s/ /p/', math: '3 + 1' },
    { day: '周二', en: 'CVC: sat / pat', math: '5 − 1' },
    { day: '周三', en: '绘本跟读 #1',   math: '2 + 3' },
    { day: '周四', en: '复习小花园',     math: '4 + 2' },
    { day: '周五', en: '视觉词 I / like / the', math: '6 − 3' },
    { day: '周六', en: '亲子英语游戏',   math: '数一数家里的圆' },
    { day: '周日', en: '周末大奖日 🎉', math: '家长确认现实奖励' },
  ];

  return (
    <div className="space-y-4">
      <Section title="本周学习计划">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-forest-600/80 text-sm">
                <th className="py-2 pr-3">星期</th>
                <th className="py-2 pr-3">英语</th>
                <th className="py-2 pr-3">数学</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {plan.map((p, i) => (
                <tr key={i}>
                  <td className="py-2 pr-3 font-display font-bold text-forest-800">{p.day}</td>
                  <td className="py-2 pr-3">{p.en}</td>
                  <td className="py-2 pr-3">{p.math}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="周末周目标">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {weeklyRewards.map(w => (
            <WeeklyGoal key={w.id} reward={w} onClaim={completeWeeklyGoal} />
          ))}
        </div>
      </Section>

      <Section title="本周亲子任务">
        <div className="card-barn p-4">
          <div className="font-display font-bold text-forest-800">{mission.title}</div>
          <p className="text-sm text-forest-600 mt-1">{mission.detail}</p>
          <p className="text-[12px] text-forest-500 mt-1">完成奖励：{mission.rewardText}</p>
          <div className="mt-3">
            {mission.confirmedByParent
              ? <span className="pill pill-sun">✅ 已确认完成</span>
              : <button onClick={() => confirmMission(mission.id)} className="btn-primary tap">确认孩子已完成</button>}
          </div>
        </div>
      </Section>
    </div>
  );
}

function Difficulty() {
  const parent = useAppStore(s => s.parent);
  const patch = useAppStore(s => s.patchParent);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Section title="难度">
        <div className="flex gap-2">
          {(['easy', 'normal', 'challenge'] as const).map(d => (
            <button
              key={d}
              onClick={() => patch({ difficulty: d })}
              className={clsx(
                'px-4 py-2 rounded-barn font-display font-semibold tap',
                parent.difficulty === d ? 'bg-forest-700 text-cream-50' : 'bg-cream-50 ring-1 ring-forest-200 text-forest-700',
              )}
            >{({ easy: '轻松', normal: '标准', challenge: '挑战' } as const)[d]}</button>
          ))}
        </div>
        <p className="text-sm text-forest-600/80 mt-3">难度改变每日关卡的步骤数与提示层级，不影响奖牌。</p>
      </Section>

      <Section title="英数比例">
        <div className="flex items-center gap-3">
          <span className="pill">英语 {Math.round(parent.englishRatio * 100)}%</span>
          <span className="pill pill-sun">数学 {Math.round(parent.mathRatio * 100)}%</span>
        </div>
        <input
          type="range" min={50} max={90} step={5}
          value={parent.englishRatio * 100}
          onChange={e => {
            const en = Number(e.target.value) / 100;
            patch({ englishRatio: en, mathRatio: 1 - en });
          }}
          className="w-full mt-4 accent-forest-700"
          aria-label="英语比例"
        />
        <p className="text-sm text-forest-600/80 mt-2">本设计默认英语占 70%，数学占 30%。</p>
      </Section>

      <Section title="自由练习">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={parent.freePracticeEnabled}
            onChange={e => patch({ freePracticeEnabled: e.target.checked })}
            className="h-5 w-5 accent-forest-700"
          />
          <span className="text-forest-800">允许完成每日任务后自由练习</span>
        </label>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-forest-700">单次自由练习上限</span>
          <input
            type="number" min={5} max={30} value={parent.freePracticeLimitMin}
            onChange={e => patch({ freePracticeLimitMin: Number(e.target.value) })}
            className="w-24 px-3 py-2 rounded-barn ring-1 ring-forest-200 bg-cream-50 text-forest-800 font-display"
            aria-label="自由练习上限"
          />
          <span className="text-forest-700">分钟</span>
        </div>
      </Section>

      <Section title="动画偏好">
        <div className="flex gap-2">
          {(['auto', 'always', 'reduced'] as const).map(a => (
            <button
              key={a}
              onClick={() => patch({ animationPref: a })}
              className={clsx(
                'px-4 py-2 rounded-barn font-display font-semibold tap',
                parent.animationPref === a ? 'bg-forest-700 text-cream-50' : 'bg-cream-50 ring-1 ring-forest-200 text-forest-700',
              )}
            >{({ auto: '跟随系统', always: '始终动态', reduced: '减少动态' } as const)[a]}</button>
          ))}
        </div>
        <p className="text-sm text-forest-600/80 mt-3">「减少动态」会让动物贴纸显示静态首帧，适合对动画敏感的孩子。</p>
      </Section>
    </div>
  );
}

function Reminder() {
  const parent = useAppStore(s => s.parent);
  const patch = useAppStore(s => s.patchParent);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Section title="每日学习时长">
        <div className="flex items-center gap-3">
          <input
            type="number" min={10} max={120} value={parent.dailyMinutesGoal}
            onChange={e => patch({ dailyMinutesGoal: Number(e.target.value) })}
            className="w-24 px-3 py-2 rounded-barn ring-1 ring-forest-200 bg-cream-50 text-forest-800 font-display"
            aria-label="每日学习时长"
          />
          <span className="text-forest-700">分钟</span>
        </div>
        <p className="text-sm text-forest-600/80 mt-2">建议 6 岁孩子单日 30–45 分钟。</p>
      </Section>

      <Section title="休息提醒">
        <div className="flex items-center gap-3">
          <span className="text-forest-700">连续学习</span>
          <input
            type="number" min={5} max={40} value={parent.restReminderMin}
            onChange={e => patch({ restReminderMin: Number(e.target.value) })}
            className="w-24 px-3 py-2 rounded-barn ring-1 ring-forest-200 bg-cream-50 text-forest-800 font-display"
            aria-label="休息提醒间隔"
          />
          <span className="text-forest-700">分钟后提醒伸展</span>
        </div>
        <p className="text-sm text-forest-600/80 mt-2">达到间隔会在首页弹出「伸展补给站」，孩子可跳过一次。</p>
      </Section>

      <Section title="提醒时间 & 屏幕时间">
        <div className="flex items-center gap-3">
          <span className="text-forest-700">每日提醒</span>
          <input
            type="time" value={parent.reminderTime}
            onChange={e => patch({ reminderTime: e.target.value })}
            className="px-3 py-2 rounded-barn ring-1 ring-forest-200 bg-cream-50 text-forest-800 font-display"
            aria-label="提醒时间"
          />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-forest-700">单次屏幕时间上限</span>
          <input
            type="number" min={10} max={120} value={parent.screenTimeLimitMin}
            onChange={e => patch({ screenTimeLimitMin: Number(e.target.value) })}
            className="w-24 px-3 py-2 rounded-barn ring-1 ring-forest-200 bg-cream-50 text-forest-800 font-display"
            aria-label="屏幕时间上限"
          />
          <span className="text-forest-700">分钟</span>
        </div>
      </Section>
    </div>
  );
}

function Rewards() {
  const parent = useAppStore(s => s.parent);
  const patch = useAppStore(s => s.patchParent);
  return (
    <Section title="现实奖励（必须由家长确认）">
      <p className="text-sm text-forest-700/80 mb-3">虚拟金币不连接任何真实支付。兑换记录会同步到所有设备。</p>
      <ul className="divide-y divide-forest-100">
        {parent.realityRewards.map((r) => (
          <li key={r.id} className="py-3 flex items-center gap-3">
            <span className="text-2xl" aria-hidden>🎁</span>
            <div className="flex-1">
              <div className="font-display font-semibold">{r.title}</div>
              <div className="text-sm text-forest-600/80">需 {r.costCoins} 枚金币 · {r.needsParentConfirm ? '需家长确认' : '自动兑换'} · {r.shownToChild ? '对孩子可见' : '仅家长可见'}</div>
            </div>
            <span className="pill">{r.redeemed ? '已兑换' : '可兑换'}</span>
            <button onClick={() => patch({ realityRewards: parent.realityRewards.map(x => x.id === r.id ? { ...x, redeemed: !x.redeemed } : x) })} className="btn-ghost text-sm">
              {r.redeemed ? '撤销' : '确认兑换'}
            </button>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Account() {
  const parent = useAppStore(s => s.parent);
  const syncMeta = useAppStore(s => s.syncMeta);
  const setOnline = useAppStore(s => s.setOnline);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <DeviceSyncStatus meta={syncMeta} devices={parent.devices} onToggleOnline={setOnline} />
      <Section title="账号">
        <div className="space-y-2 text-forest-800">
          <div className="flex justify-between"><span>孩子昵称</span><span className="font-display font-semibold">小鹿 Leo</span></div>
          <div className="flex justify-between"><span>PIN</span><span className="font-display font-semibold">已设置</span></div>
          <div className="flex justify-between"><span>数据存储</span><span className="font-display font-semibold">本地 + 云端同步</span></div>
        </div>
        <button className="btn-secondary mt-4 w-full">导出学习记录</button>
        <p className="text-sm text-forest-600/80 mt-3">同步演示：在「账号与设备」点击「模拟断网」，此时的奖励改动会进入离线队列，恢复连接后自动增量重发，且不会重复计数。</p>
      </Section>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-barn p-3">
      <div className="text-xs text-forest-600/80 uppercase tracking-wider">{label}</div>
      <div className="font-display font-bold text-2xl text-forest-800">{value}</div>
    </div>
  );
}
