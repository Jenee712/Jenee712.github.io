import clsx from 'clsx';
import type { TodayTask } from '@/types';

const SUBJECT_META: Record<TodayTask['subject'], { label: string; cls: string }> = {
  english: { label: '英语', cls: 'bg-sky-400/15 text-sky-500 ring-sky-400/30' },
  math: { label: '数学', cls: 'bg-sun-400/15 text-soil-500 ring-sun-400/30' },
  chinese: { label: '语文', cls: 'bg-forest-400/15 text-forest-600 ring-forest-400/30' },
  rest: { label: '伸展', cls: 'bg-forest-100 text-forest-700 ring-forest-200' },
  review: { label: '复习', cls: 'bg-forest-100 text-forest-700 ring-forest-200' },
};

const KIND_LABEL: Record<TodayTask['kind'], string> = {
  normal: '学习', rest: '休息', review: '复习', book: '绘本',
};

interface Props {
  task: TodayTask;
  isNext?: boolean;
  onStart: (t: TodayTask) => void;
}

/** 单个今日任务卡。展示学科 / 名称 / 摘要 / 时长 / 状态 / 是否需要录音或拖拽。 */
export function LearningTaskCard({ task, isNext, onStart }: Props) {
  const meta = SUBJECT_META[task.subject];
  const needRecord = task.lessonId?.includes('cvc') || task.kind === 'normal';
  const needDrag = task.lessonId?.includes('math');
  const isReview = task.title.startsWith('🔁');
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onStart(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStart(task); }
      }}
      aria-label={`${task.done ? '再玩一次' : '开始'} ${task.title}`}
      className={clsx(
        'card flex items-center gap-3 p-3 cursor-pointer select-none transition',
        'hover:ring-2 hover:ring-forest-300 active:scale-[0.99]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-500',
        isNext && 'ring-2 ring-forest-500',
      )}
    >
      <span className={clsx('pill !rounded-full !px-2.5 !py-1 !text-xs !font-bold', meta.cls)}>{meta.label}</span>
      {isReview && (
        <span className="pill !rounded-full !px-2.5 !py-1 !text-xs !font-bold bg-sun-400/20 text-soil-600 ring-sun-400/40">🔁 复习</span>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-display font-bold text-forest-800 truncate">{task.title}</div>
        <div className="text-xs text-forest-500 truncate">{task.detail}</div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-forest-500">
          <span className="pill !py-0.5 !px-2">⏱ {task.durationMin} 分</span>
          <span className="pill !py-0.5 !px-2">{KIND_LABEL[task.kind]}</span>
          {needRecord && <span className="pill !py-0.5 !px-2">🎤 录音</span>}
          {needDrag && <span className="pill !py-0.5 !px-2">✋ 拖拽</span>}
        </div>
      </div>
      {task.done ? (
        <span className="flex shrink-0 flex-col items-center gap-0.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-500 text-cream-50 text-lg" aria-hidden>✓</span>
          <span className="text-[10px] text-forest-500">再玩</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onStart(task); }}
          className="btn-secondary tap shrink-0"
          aria-label={`开始 ${task.title}`}
        >
          {isNext ? '继续' : '开始'}
        </button>
      )}
    </div>
  );
}
