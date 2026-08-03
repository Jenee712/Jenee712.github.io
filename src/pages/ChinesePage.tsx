import { useNavigate } from 'react-router-dom';
import { Mascot } from '@/components/characters/Mascot';
import { chineseLessons, chineseContinue, getChineseLesson } from '@/data/curriculum';
import { useAppStore } from '@/store/useAppStore';

export function ChinesePage() {
  const nav = useNavigate();
  const kid = useAppStore(s => s.kid);
  const tasks = useAppStore(s => s.tasks);

  const todayChMin = tasks.filter(t => t.subject === 'chinese' && t.done).reduce((a, b) => a + b.durationMin, 0);
  const todayChGoal = Math.round(kid.todayGoalMin * 0.2);
  // 跟 studyDay 同步：优先取当日计划里下一个未完成的语文任务；都完成了再走兜底 lesson
  const chiTask = tasks.find(t => t.subject === 'chinese' && t.kind === 'normal' && !t.done);
  const fallback = chineseContinue();
  const nextLesson = chiTask?.lessonId ? (getChineseLesson(chiTask.lessonId) ?? fallback) : fallback;
  const poems = chineseLessons.filter(l => l.kind === 'poem');
  const idioms = chineseLessons.filter(l => l.kind === 'idiom');
  const zhaozi = chineseLessons.filter(l => l.kind === 'character');

  return (
    <div className="container-forest pt-6">
      <header className="card-leaf p-5 flex flex-col md:flex-row md:items-center gap-4">
        <Mascot name="bird" size={88} animated />
        <div className="flex-1 min-w-0">
          <h1 className="type-h1">语文园地 📚</h1>
          <p className="type-body text-forest-700/90 mt-1">读古诗词、学成语，感受中文之美。（繁体字版本）</p>
        </div>
        <div className="pill pill-sky whitespace-nowrap self-start md:self-auto">
          今日 {todayChMin} / {todayChGoal} 分钟
        </div>
      </header>

      {/* 继续任务 */}
      <section className="mt-6 card p-5">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-sm text-forest-600/80">继续任务</div>
            <h3 className="type-h2 mt-1">{nextLesson.title}</h3>
            <p className="text-sm text-forest-600 mt-1">第 {nextLesson.index} 关 · {nextLesson.durationMin} 分钟</p>
          </div>
          <Mascot name="bird" size={72} animated />
        </header>
        <button
          className="btn-primary-lg mt-5 w-full"
          onClick={() => nav(`/chinese/lesson/${nextLesson.id}`)}
        >
          ▶ 开始学习
        </button>
      </section>

      {/* 古诗词列表 */}
      <section className="mt-6">
        <h2 className="type-h2 mb-3">诗词欣赏</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {poems.map(l => (
            <button
              key={l.id}
              onClick={() => nav(`/chinese/lesson/${l.id}`)}
              className="card p-4 text-left hover:shadow-lift transition tap"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📜</span>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-forest-800">{l.title}</div>
                  <div className="text-sm text-forest-600/80 mt-0.5">第 {l.index} 关 · {l.durationMin} 分钟</div>
                </div>
                <span className="text-forest-400">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 成语列表 */}
      <section className="mt-6">
        <h2 className="type-h2 mb-3">成语故事</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {idioms.map(l => (
            <button
              key={l.id}
              onClick={() => nav(`/chinese/lesson/${l.id}`)}
              className="card p-4 text-left hover:shadow-lift transition tap"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧧</span>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-forest-800">{l.title}</div>
                  <div className="text-sm text-forest-600/80 mt-0.5">第 {l.index} 关 · {l.durationMin} 分钟</div>
                </div>
                <span className="text-forest-400">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 认字小教室 */}
      <section className="mt-6">
        <h2 className="type-h2 mb-3">认字小教室</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {zhaozi.map(l => (
            <button
              key={l.id}
              onClick={() => nav(`/chinese/lesson/${l.id}`)}
              className="card p-4 text-left hover:shadow-lift transition tap"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">✏️</span>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-forest-800">{l.title}</div>
                  <div className="text-sm text-forest-600/80 mt-0.5">第 {l.index} 关 · {l.durationMin} 分钟</div>
                </div>
                <span className="text-forest-400">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
