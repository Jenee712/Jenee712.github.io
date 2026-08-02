import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { LessonResult } from '@/components/lesson/LessonResult';

/** 关卡结算页（/lesson/result/:taskId）。数据来自 store.lastResult；直接访问则回首页。 */
export function LessonResultPage() {
  const nav = useNavigate();
  const result = useAppStore((s) => s.lastResult);
  const stickers = useAppStore((s) => s.stickers);
  const tasks = useAppStore((s) => s.tasks);
  const setLast = useAppStore((s) => s.setLastResult);

  // 没有结算数据（例如刷新或直接访问）→ 回首页
  useEffect(() => {
    if (!result) nav('/', { replace: true });
  }, [result, nav]);

  // ============ 自动跳下一关 ============
  // 用户读完本关 → 2.5 秒后自动跳到下一个未完成任务。
  // 若全部已完成 → 跳首页看今日总奖励。
  // 顶部显示倒计时 + 「下一关」按钮，用户可立刻手动跳（也会中断自动跳转）。
  const [autoLeft, setAutoLeft] = useState(2.5);
  const [autoActive, setAutoActive] = useState(true);
  const tickedRef = useRef(false);

  // 找下一个未完成任务（与下方 goNext 同样的判定规则）
  const nextTask = tasks.find((t) => !t.done && t.kind === 'normal') ?? tasks.find((t) => !t.done);

  useEffect(() => {
    if (!result) return;
    setAutoLeft(2.5);
    setAutoActive(true);
    tickedRef.current = false;
  }, [result?.taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!autoActive) return;
    if (!nextTask) return; // 全部完成了，不自动跳（让用户看到「全部完成」奖励）
    const start = Date.now();
    const total = 2500;
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, (total - elapsed) / 1000);
      setAutoLeft(left);
      if (elapsed >= total && !tickedRef.current) {
        tickedRef.current = true;
        clearInterval(id);
        goNext();
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoActive, nextTask?.id]);

  if (!result) return null;

  const sticker = result.stickerId ? stickers.find((s) => s.id === result.stickerId) : undefined;

  const goHome = () => { setAutoActive(false); setLast(null); nav('/'); };

  const goNext = () => {
    setAutoActive(false);
    setLast(null);
    if (!nextTask) { nav('/'); return; }
    if (nextTask.kind === 'review') { nav('/review'); return; }
    if (nextTask.subject === 'english') { nav(`/english/lesson/${nextTask.lessonId ?? 'eng-vb1-animals'}`); return; }
    if (nextTask.subject === 'math') { nav(`/math/lesson/${nextTask.lessonId ?? 'math-add-1'}`); return; }
    if (nextTask.subject === 'chinese') { nav(`/chinese/lesson/${nextTask.lessonId ?? 'ch-1'}`); return; }
    nav('/');
  };

  return (
    <div className="container-forest min-h-[calc(100dvh-3.5rem)] flex items-center justify-center py-8">
      {/* 自动跳转提示条：仅在「还有下一关」时显示 */}
      {nextTask && (
        <div className="fixed top-3 inset-x-3 sm:top-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-30
                        mx-auto max-w-md card-leaf px-4 py-2.5 flex items-center gap-3 animate-fadeIn
                        shadow-soft ring-1 ring-forest-200 animate-[slideUp_220ms_ease-out]">
          <span className="text-xl shrink-0" aria-hidden>⏭️</span>
          <span className="text-sm text-forest-700 flex-1 min-w-0 truncate">
            {autoLeft > 0
              ? <>2.5 秒后自动进入 <b>{nextTask.title.replace(/^.+?·\s?/, '')}</b>…</>
              : <>马上进入 <b>{nextTask.title.replace(/^.+?·\s?/, '')}</b></>}
          </span>
          <button
            type="button"
            onClick={goNext}
            className="btn-secondary tap shrink-0 !py-1.5 !px-3 !text-sm"
            aria-label="立刻进入下一关"
          >
            下一关 ⏭
          </button>
        </div>
      )}
      <LessonResult result={result} sticker={sticker} onNext={goNext} onHome={goHome} />
    </div>
  );
}
