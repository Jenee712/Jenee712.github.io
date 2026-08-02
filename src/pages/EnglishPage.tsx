import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Mascot } from '@/components/characters/Mascot';
import { EnglishSkillPath } from '@/components/lesson/EnglishSkillPath';
import { englishUnits, englishContinue, getEnglishLesson } from '@/data/gradeContent';
import { gradeDef } from '@/data/grades';
import { dayOfSummer } from '@/data/plan60';

export function EnglishPage() {
  const nav = useNavigate();
  const kid = useAppStore(s => s.kid);
  const tasks = useAppStore(s => s.tasks);
  const skillProgress = useAppStore(s => s.skillProgress);
  const difficulty = useAppStore(s => s.parent.difficulty);
  const studyDay = useAppStore(s => s.studyDay);
  const grade = useAppStore(s => s.grade);
  const realToday = dayOfSummer();
  const resetStudyDay = useAppStore(s => s.resetStudyDay);
  const def = gradeDef(grade);

  const todayEngMin = tasks.filter(t => t.subject === 'english' && t.done).reduce((a, b) => a + b.durationMin, 0);
  const todayEngGoal = Math.round(kid.todayGoalMin * 0.7);
  const current = englishUnits.find(u => u.current)!;
  const englishTask = tasks.find((t) => t.subject === 'english' && t.kind === 'normal');
  const nextLesson = englishTask?.lessonId ? getEnglishLesson(englishTask.lessonId, difficulty) : englishContinue(difficulty);
  const bookTasks = tasks.filter((t) => t.subject === 'english' && t.kind === 'book');

  return (
    <div className="container-forest pt-6">
      {studyDay !== realToday && (
        <div className="mb-4 card-leaf px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-forest-700">📚 正在学习：<b>暑期第 {studyDay} 天</b> 的英语（已记住，非真实今天）</span>
          <button className="btn-ghost tap shrink-0" onClick={resetStudyDay}>回到今天（第 {realToday} 天）</button>
        </div>
      )}
      <UnitHeader
        title={`${def.label} · 森林英語營`}
        story={current.storyTask}
        today={`今日 ${todayEngMin} / ${todayEngGoal} 分钟`}
        mascot="deer"
      />

      {/* 绘本馆入口 */}
      <section className="mt-6">
        <button
          onClick={() => nav('/english/books')}
          className="card-leaf w-full p-5 flex items-center justify-between gap-4 tap hover:ring-2 hover:ring-forest-300 transition text-left"
          aria-label="进入绘本馆"
        >
          <div className="flex items-center gap-4 min-w-0">
            <Mascot name="deer" size={72} animated />
            <div className="min-w-0">
              <h2 className="type-h2">📚 绘本馆</h2>
              <p className="type-body text-forest-700/90 mt-0.5 truncate">原创森林故事 · 翻页读 · 点单词听发音</p>
            </div>
          </div>
          <span className="btn-primary tap shrink-0">去翻书 →</span>
        </button>
      </section>

      {/* 六类稳定技能航线（掌握度） */}
      <section className="mt-6" aria-labelledby="skill-route">
        <div className="flex items-end justify-between">
          <h2 id="skill-route" className="type-h2">{def.label} · 技能航線</h2>
          <span className="pill">6 类稳定结构 · 主题随单元更换</span>
        </div>
        <div className="mt-4">
          <EnglishSkillPath
            progress={skillProgress}
            currentTrack="phonics"
            onContinue={() => nav(`/english/lesson/${nextLesson.id}`)}
          />
        </div>
      </section>

      {/* 继续任务 + 单元目标 */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {englishTask ? (
          <div className="card p-5 lg:col-span-2">
            <header className="flex items-end justify-between">
              <div>
                <div className="text-sm text-forest-600/80">继续任务</div>
                <h3 className="type-h2 mt-1">{nextLesson.title}</h3>
                <p className="text-sm text-forest-600 mt-1">第 {nextLesson.index} 关 · {nextLesson.durationMin} 分钟</p>
              </div>
              <Mascot name="deer" size={92} animated />
            </header>

            <div className="mt-4 flex items-center gap-3">
              {difficulty === 'challenge'
                ? <span className="card-leaf px-4 py-3 text-forest-700">{def.fullLabel} · {def.tagline}</span>
                : (['s', 'u', 'n'] as const).map((l, i) => (
                  <div key={l} className="flex items-center gap-3">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-barn bg-cream-200 ring-1 ring-forest-200 flex flex-col items-center justify-center">
                      <div className="font-display font-extrabold text-3xl text-forest-800">{l}</div>
                      <div className="text-sm text-forest-600/80 mt-1">/{l}/</div>
                    </div>
                    {i < 2 && <span className="text-2xl text-forest-500">+</span>}
                  </div>
                ))}
            </div>

            <button
              className="btn-primary-lg mt-5 w-full"
              onClick={() => nav(`/english/lesson/${nextLesson.id}`)}
            >
              ▶ 开始：{nextLesson.title}
            </button>
          </div>
        ) : bookTasks.length > 0 ? (
          <div className="card p-5 lg:col-span-2">
            <header className="flex items-end justify-between">
              <div>
                <div className="text-sm text-forest-600/80">今日绘本</div>
                <h3 className="type-h2 mt-1">{bookTasks[0].title.replace(/^绘本 ·\s?/, '')}</h3>
                <p className="text-sm text-forest-600 mt-1">{bookTasks[0].detail}</p>
              </div>
              <Mascot name="deer" size={92} animated />
            </header>
            <p className="type-body text-forest-700/90 mt-4">这一天是「绘本日」——翻开原创森林故事，边看插画边读英语吧！</p>
            <button
              className="btn-primary-lg mt-5 w-full"
              onClick={() => nav(`/english/book/${bookTasks[0].lessonId}?task=${bookTasks[0].id}`)}
            >
              ▶ 翻开：{bookTasks[0].title.replace(/^绘本 ·\s?/, '')}
            </button>
          </div>
        ) : (
          <div className="card p-5 lg:col-span-2 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-forest-600/80">今日英语</div>
              <h3 className="type-h2 mt-1">去绘本馆读一本？</h3>
              <p className="text-sm text-forest-600 mt-1">课余自由选读，慢慢翻</p>
            </div>
            <button className="btn-primary tap shrink-0" onClick={() => nav('/english/books')}>绘本馆 →</button>
          </div>
        )}

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

      {/* 今日绘本列表（第 50–60 天会出现） */}
      {bookTasks.length > 0 && (
        <section className="mt-6">
          <h2 className="type-h2">📖 今日绘本（{bookTasks.length} 本）</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookTasks.map((t) => (
              <div key={t.id} className={`card p-4 flex items-center justify-between gap-3 ${t.done ? 'opacity-70' : ''}`}>
                <div className="min-w-0">
                  <div className="font-display font-bold text-forest-800 truncate">{t.title}</div>
                  <div className="text-xs text-forest-500 mt-0.5">{t.detail} · ⏱ {t.durationMin} 分</div>
                </div>
                <button
                  className={t.done ? 'btn-ghost tap shrink-0' : 'btn-primary tap shrink-0'}
                  onClick={() => nav(`/english/book/${t.lessonId}?task=${t.id}`)}
                >
                  {t.done ? '再读' : '翻开'}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 底部三列 —— 内容 / 交互 / 纠错 */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <FooterCard title="内容入口" body="技能路线保持 6 类稳定结构，具体主题通过单元更换，不让导航无限增长。" />
        <FooterCard title="交互形式" body="听音点选、拖字母拼词、看图说词、跟读录音、字母描红。" />
        <FooterCard title="纠错方式" body="第一次提示口型或首音，第二次缩小选项；不直接显示红叉和失败文案。" />
      </section>
    </div>
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
