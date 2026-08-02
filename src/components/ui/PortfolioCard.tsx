import type { PortfolioItem } from '@/types';

const TYPE_META: Record<PortfolioItem['type'], { label: string; icon: string }> = {
  recording: { label: '跟读录音', icon: '🎤' },
  tracing_letter: { label: '字母描红', icon: '✏️' },
  tracing_word: { label: '单词描红', icon: '✏️' },
  math_drawing: { label: '数学操作', icon: '🔢' },
  drawing: { label: '作品', icon: '🎨' },
};

/** 我的作品袋 · 单个作品卡。 */
export function PortfolioCard({ item }: { item: PortfolioItem }) {
  const meta = TYPE_META[item.type];
  return (
    <div className="card p-3">
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-forest-50 text-lg" aria-hidden>{meta.icon}</span>
        <div className="min-w-0">
          <div className="font-display font-bold text-forest-800 text-sm truncate">{item.title}</div>
          <div className="text-[11px] text-forest-500">{item.subject === 'english' ? '英语' : '数学'} · {item.date}</div>
        </div>
      </div>
      {item.url && item.type === 'recording' && (
        <audio controls src={item.url} className="mt-2 w-full" aria-label={item.title} />
      )}
      {item.note && <p className="mt-2 text-xs text-forest-600">{item.note}</p>}
    </div>
  );
}
