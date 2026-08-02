import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { ReviewGarden } from '@/components/lesson/ReviewGarden';
import { Mascot } from '@/components/characters/Mascot';
import { ContinueLearningButton } from '@/components/ui/ContinueLearningButton';

/** 复习小花园页（/review）。每次挑 3–5 个薄弱点，用「浇水养小苗」包装，无排名/错题数展示。 */
export function ReviewGardenPage() {
  const nav = useNavigate();
  const reviewItems = useAppStore((s) => s.reviewItems);
  const saveReviewResult = useAppStore((s) => s.saveReviewResult);
  const [done, setDone] = useState(false);

  // 今日到期或仍需巩固的题目，最多 5 道
  const todayItems = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const due = reviewItems.filter((r) => r.dueAt <= today || r.lastResult !== 'ok');
    return (due.length ? due : reviewItems).slice(0, 5);
  }, [reviewItems]);

  return (
    <div className="container-forest pt-6 pb-10">
      <header className="card-leaf p-5 flex flex-col md:flex-row md:items-center gap-4">
        <Mascot name="rabbit" size={84} animated />
        <div className="flex-1">
          <h1 className="type-h1">复习小花园 🌱</h1>
          <p className="type-body text-forest-700/90 mt-1">给昨天学过的知识浇浇水，让它们长得更牢固。答错也没关系，会先给你小提示。</p>
        </div>
      </header>

      <div className="mt-6">
        {done || todayItems.length === 0 ? (
          <div className="mx-auto max-w-md card-barn p-6 text-center animate-pop">
            <Mascot name="rabbit" size={96} animated />
            <h2 className="type-h2 mt-2">小花园浇好水啦！</h2>
            <p className="type-body text-forest-600 mt-1">
              {todayItems.length === 0 ? '今天暂时没有需要复习的内容，去学新知识吧！' : '你把今天的小苗都照顾好了，真棒！'}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => nav('/')} className="btn-secondary tap">回到首页</button>
              <ContinueLearningButton label="去学英语 🌿" onClick={() => nav('/english')} />
            </div>
          </div>
        ) : (
          <ReviewGarden
            items={todayItems}
            onResult={(itemId, result) => saveReviewResult(itemId, result)}
            onFinish={() => setDone(true)}
          />
        )}
      </div>
    </div>
  );
}
