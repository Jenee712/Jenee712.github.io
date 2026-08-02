import clsx from 'clsx';
import type { KnowledgeCollection as KC, KnowledgeItem } from '@/types';

function Item({ it }: { it: KnowledgeItem }) {
  return (
    <div className={clsx('rounded-barn px-3 py-2 text-center font-display font-bold ring-1',
      it.mastered ? 'bg-forest-500 text-cream-50 ring-forest-600' : 'bg-cream-50 text-forest-500 ring-forest-100')}>
      <span className="block text-lg leading-none">{it.label}</span>
      {it.mastered
        ? <span className="text-[10px] opacity-90">{it.rewardDecor === 'animal' ? '🐾' : it.rewardDecor === 'building' ? '🏡' : '🌱'} 已解锁</span>
        : <span className="text-[10px] opacity-70">学习中</span>}
    </div>
  );
}

/** 成长图鉴 · 知识收藏：已掌握 / 正在学习 / 即将解锁。首次接触不立即解锁。 */
export function KnowledgeCollection({ collection }: { collection: KC }) {
  const sections: { key: keyof KC; title: string }[] = [
    { key: 'letters', title: '字母' },
    { key: 'words', title: '单词' },
    { key: 'sentences', title: '句型' },
    { key: 'math', title: '数学' },
  ];
  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <div key={s.key}>
          <h4 className="type-h3 mb-2">{s.title} · 我会了</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {(collection[s.key] as KnowledgeItem[]).map((it) => <Item key={it.id} it={it} />)}
          </div>
        </div>
      ))}
      <div>
        <h4 className="type-h3 mb-2 text-forest-500">正在学习</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {collection.learning.map((it) => <Item key={it.id} it={it} />)}
        </div>
      </div>
      <div>
        <h4 className="type-h3 mb-2 text-forest-400">即将解锁</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 opacity-80">
          {collection.upcoming.map((it) => <Item key={it.id} it={it} />)}
        </div>
      </div>
    </div>
  );
}
