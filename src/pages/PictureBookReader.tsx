import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { BookScene } from '@/components/lesson/BookScene';
import { Mascot } from '@/components/characters/Mascot';
import { getPictureBook } from '@/data/pictureBooks';
import { speak, speakAuto, stopSpeaking } from '@/lib/speech';

/** 翻页阅读器：原创绘本逐页读，整句听读 + 点单词发音，读完结算（若来自每日任务则完成任务）。 */
export function PictureBookReader() {
  const { bookId = '' } = useParams();
  const [params] = useSearchParams();
  const taskId = params.get('task') ?? undefined;
  const nav = useNavigate();
  const book = getPictureBook(bookId);

  const [page, setPage] = useState(0);
  const startRef = useRef(Date.now());
  const total = book?.pages.length ?? 0;

  // 切页自动朗读当前英文句
  useEffect(() => {
    if (!book) return;
    stopSpeaking();
    const t = setTimeout(() => speakAuto(book.pages[page].en), 400);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [page, bookId]);

  useEffect(() => () => stopSpeaking(), []);

  if (!book) {
    return (
      <div className="container-forest pt-10 text-center">
        <p className="type-h2">找不到这本绘本 😶</p>
        <button className="btn-primary-lg mt-4" onClick={() => nav('/english/books')}>回到绘本馆</button>
      </div>
    );
  }

  const isLast = page === total - 1;
  const isFirst = page === 0;

  const finish = async () => {
    stopSpeaking();
    const minutes = Math.max(1, Math.round((Date.now() - startRef.current) / 60000) || book.durationMin);
    const stickerId = 'corgi-cheer';
    const { completeTask, awardSticker, setLastResult, tasks } = useAppStore.getState();
    const task = taskId ? tasks.find((t) => t.id === taskId) : undefined;
    const res = task ? await completeTask(task.id, { correct: total, total, minutes }) : { coins: undefined, steps: undefined };
    await awardSticker(stickerId, '读完一本英语绘本', 'daily_task');
    setLastResult({
      taskId: task?.id ?? book.id,
      correct: total,
      total,
      minutes,
      coins: res.coins,
      steps: res.steps,
      stickerId,
      newKnowledge: '英语绘本阅读',
      mode: 'normal',
    });
    nav(task ? `/lesson/result/${task.id}` : '/english/books');
  };

  const cur = book.pages[page];

  return (
    <div className="container-forest pt-4 pb-6">
      {/* 顶栏 */}
      <header className="flex items-center gap-3">
        <button className="btn-ghost tap shrink-0" onClick={() => nav(taskId ? '/' : '/english/books')} aria-label="返回">
          ← {taskId ? '计划' : '绘本馆'}
        </button>
        <div className="min-w-0 flex-1">
          <div className="font-display font-bold text-forest-800 truncate">{book.titleCn}</div>
          <div className="text-xs text-forest-500">{book.level} · 第 {page + 1} / {total} 页</div>
        </div>
      </header>

      {/* 进度条 */}
      <div className="mt-3 h-1.5 rounded-full bg-forest-100 overflow-hidden">
        <div className="h-full bg-forest-500 transition-all" style={{ width: `${((page + 1) / total) * 100}%` }} />
      </div>

      {/* 插画：画布里只放插画（不再叠加 caption，避免挡住角色脸） */}
      <div className="mt-4">
        <BookScene scene={cur.scene} className="aspect-[4/3] w-full" />
      </div>

      {/* 文字条 + 听读按钮：放在画布下方独立区域，手机/iPad 都看得见且不挡动物 */}
      <div className="mt-4 card-leaf p-4 md:p-5">
        <div className="font-display font-extrabold text-lg md:text-2xl text-forest-800 leading-snug flex flex-wrap justify-center gap-x-2 gap-y-0.5">
          {cur.en.split(/\s+/).filter(Boolean).map((w, i) => (
            <button
              key={i}
              onClick={() => speakAuto(w.replace(/[.,!?;:()"'-]/g, ''))}
              className="hover:bg-sun-400/40 rounded-md px-1 transition cursor-pointer"
              title={`点击听 ${w}`}
            >
              {w}
            </button>
          ))}
        </div>
        <p className="text-center text-forest-700/90 mt-1.5 text-sm md:text-base">{cur.cn}</p>
        <div className="mt-2.5 flex justify-center gap-2">
          <button onClick={() => speakAuto(cur.en)} className="btn-primary tap inline-flex items-center gap-1 px-4 py-2 text-sm" aria-label="听整句">
            <span className="text-lg">🔊</span> 听整句
          </button>
          <button onClick={() => speak(cur.en, { lang: 'en-US', rate: 0.6, pitch: 1 })} className="btn-secondary tap inline-flex items-center gap-1 px-3 py-2 text-sm" aria-label="慢慢听">
            <span className="text-base">🐢</span> 慢速
          </button>
        </div>
        <p className="text-[11px] text-forest-500 text-center mt-1.5">💡 点任何一个英文单词都能听发音</p>
      </div>

      {/* 翻页控制（normal flow，紧贴 BookScene 下方，不再 fixed，避免遮挡 caption 里的听读按钮） */}
      <div className="mt-4">
        <div className="max-w-md mx-auto card p-3 flex items-center justify-between gap-2 shadow-lift">
          <button
            className="btn-secondary tap disabled:opacity-40"
            disabled={isFirst}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            ‹ 上一页
          </button>
          {isLast ? (
            <button className="btn-primary-lg tap flex-1" onClick={finish}>✅ 读完啦</button>
          ) : (
            <button className="btn-primary tap flex-1" onClick={() => setPage((p) => Math.min(total - 1, p + 1))}>
              下一页 ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
