import { useNavigate } from 'react-router-dom';
import { Mascot } from '@/components/characters/Mascot';
import { pictureBooks } from '@/data/pictureBooks';

/** 绘本馆：课余自由选读，像真实绘本 App 的书架。 */
export function PictureBookLibrary() {
  const nav = useNavigate();
  return (
    <div className="container-forest pt-6">
      <header className="card-leaf p-5 flex items-center gap-4">
        <Mascot name="deer" size={84} animated />
        <div>
          <h1 className="type-h1">📚 绘本馆</h1>
          <p className="type-body text-forest-700/90 mt-1">原创森林故事 · 翻页读 · 点单词听发音 · 整句跟读</p>
        </div>
      </header>

      <p className="type-meta mt-4">挑一本，慢慢翻。读完可以听整句，也可以点每一个英文单词听发音。</p>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {pictureBooks.map((b) => (
          <button
            key={b.id}
            onClick={() => nav(`/english/book/${b.id}`)}
            className="card p-3 text-left tap hover:ring-2 hover:ring-forest-300 active:scale-[0.99] transition flex flex-col"
            aria-label={`翻开 ${b.titleCn}`}
          >
            <div className={`relative aspect-[3/4] rounded-pebble bg-gradient-to-b ${b.coverBg} ring-1 ring-forest-200 overflow-hidden flex items-center justify-center`}>
              <Mascot name={b.coverChar} size={110} animated />
              <span className="absolute top-2 left-2 pill !py-0.5 !px-2 !text-[11px] bg-cream-50/90">{b.level}</span>
            </div>
            <div className="mt-2 font-display font-bold text-forest-800 leading-tight">{b.titleCn}</div>
            {b.titleEn && <div className="text-xs text-forest-500 truncate">{b.titleEn}</div>}
            <div className="text-[11px] text-forest-500 mt-0.5">{b.pages.length} 页 · ⏱ {b.durationMin} 分</div>
          </button>
        ))}
      </div>

      <p className="type-meta mt-6 text-center">💡 绘本也会出现在第 50–60 天的每日英语计划里，读完一样能收集贴纸！</p>
    </div>
  );
}
