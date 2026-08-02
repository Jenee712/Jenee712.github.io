import { useNavigate } from 'react-router-dom';
import { Mascot } from '@/components/characters/Mascot';
import { MathKnowledgeMap } from '@/components/lesson/MathKnowledgeMap';
import { mathContinue, getMathLesson, mathUnits } from '@/data/gradeContent';
import { gradeDef } from '@/data/grades';
import { useAppStore } from '@/store/useAppStore';

export function MathPage() {
  const nav = useNavigate();
  const kid = useAppStore(s => s.kid);
  const tasks = useAppStore(s => s.tasks);
  const skillProgress = useAppStore(s => s.skillProgress);
  const difficulty = useAppStore(s => s.parent.difficulty);
  const grade = useAppStore(s => s.grade);
  const def = gradeDef(grade);

  const todayMathMin = tasks.filter(t => t.subject === 'math' && t.done).reduce((a, b) => a + b.durationMin, 0);
  const todayMathGoal = Math.round(kid.todayGoalMin * 0.3);
  const current = mathUnits.find(u => u.current)!;
  // 跟 studyDay 同步：优先取当日计划里下一个未完成的数学任务；都完成了再走兜底 lesson
  const mathTask = tasks.find(t => t.subject === 'math' && t.kind === 'normal' && !t.done);
  const fallback = mathContinue(difficulty);
  const nextLesson = mathTask?.lessonId ? (getMathLesson(mathTask.lessonId, difficulty) ?? fallback) : fallback;

  return (
    <div className="container-forest pt-6">
      <UnitHeader
        title={`${def.label} · 田園數學站`}
        story={current.storyTask}
        today={`今日 ${todayMathMin} / ${todayMathGoal} 分钟`}
        mascot="bear"
      />

      {/* 六类知识地图（固定站点 + 掌握度） */}
      <section className="mt-6" aria-labelledby="math-map">
        <div className="flex items-end justify-between">
          <h2 id="math-map" className="type-h2">{def.label} · 知識地圖</h2>
          <span className="pill">数 → 加减 → 形状 → 比较 → 时钟 → 图表</span>
        </div>
        <div className="mt-4">
          <MathKnowledgeMap
            progress={skillProgress}
            currentTopic="add_sub"
            onContinue={() => nav(`/math/lesson/${nextLesson.id}`)}
          />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <header className="flex items-end justify-between">
            <div>
              <div className="text-sm text-forest-600/80">今日救援</div>
              <h3 className="type-h2 mt-1">{nextLesson.title}</h3>
              <p className="text-sm text-forest-600 mt-1">第 {nextLesson.index} 关 · {nextLesson.durationMin} 分钟</p>
            </div>
            <Mascot name="bear" size={92} animated />
          </header>

          {/* 实物可视化：3 点 + 2 点（仅常规档示意） */}
          {difficulty === 'challenge'
            ? <div className="mt-5"><span className="card-leaf px-4 py-3 text-forest-700">二年级挑战 · 100 以内进退位 / 乘法 / 应用题</span></div>
            : (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map(i => <Dot key={`a${i}`} />)}
                </div>
                <span className="font-display font-extrabold text-3xl text-forest-700">+</span>
                <div className="flex items-center gap-2">
                  {[0, 1].map(i => <Dot key={`b${i}`} />)}
                </div>
              </div>
            )}

          <button
            className="btn-primary-lg mt-5 w-full"
            onClick={() => nav(`/math/lesson/${nextLesson.id}`)}
          >
            ▶ 开始：{nextLesson.title}
          </button>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="type-h3">本单元目标</h3>
            <span className="pill">{Math.round(current.progress * 100)}%</span>
          </div>
          <ul className="mt-3 space-y-2 text-forest-800">
            {current.goals.map((g, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-forest-500 mt-0.5" aria-hidden>•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 progress-track">
            <div className="progress-fill" style={{ width: `${current.progress * 100}%` }} />
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <FooterCard title="内容入口" body="六类知识形成固定地图，进度既显示当前主题，也保留后续目标预告。" />
        <FooterCard title="交互形式" body="拖动物件、数一数、配对大小、拨动时针、涂色生成简单图表。" />
        <FooterCard title="抽象阶梯" body={'每个概念按"实物图 → 图形符号 → 数字算式"推进，避免过早纯计算。'} />
      </section>
    </div>
  );
}

function Dot() {
  return (
    <span
      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-sun-400/70 ring-2 ring-sun-500/40 inline-block"
      aria-hidden
    />
  );
}

function UnitHeader({ title, story, today, mascot }: { title: string; story: string; today: string; mascot: 'deer' | 'bear' | 'bird' }) {
  return (
    <div className="card-leaf p-5 flex flex-col md:flex-row md:items-center gap-4">
      <Mascot name={mascot} size={88} animated />
      <div className="flex-1 min-w-0">
        <h1 className="type-h1">{title}</h1>
        <p className="type-body text-forest-700/90 mt-1">故事任务：{story}</p>
      </div>
      <div className="pill pill-sky whitespace-nowrap self-start md:self-auto">{today}</div>
    </div>
  );
}

function FooterCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-5">
      <h4 className="type-h3 text-forest-800">{title}</h4>
      <p className="type-body mt-2 text-forest-700/90">{body}</p>
    </div>
  );
}
