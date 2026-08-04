import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakSequence, stopSpeaking } from '@/lib/speech';
import { ALPHABET_DAYS, alphabetLessonId } from '@/data/alphabet';
import { useAppStore } from '@/store/useAppStore';

export function AlphabetStarter({ compact = false }: { compact?: boolean }) {
  const base = import.meta.env.BASE_URL;
  const navigate = useNavigate();
  const studyDay = useAppStore((state) => state.studyDay);
  const currentPlanDay = Math.min(9, Math.max(1, studyDay));
  const [selectedDay, setSelectedDay] = useState(currentPlanDay);
  const [active, setActive] = useState<string>('A');
  const selected = ALPHABET_DAYS[selectedDay - 1];

  useEffect(() => {
    setSelectedDay(currentPlanDay);
    setActive(ALPHABET_DAYS[currentPlanDay - 1].letters[0].upper);
  }, [currentPlanDay]);

  return (
    <section className={`alphabet-starter ${compact ? 'alphabet-starter-compact' : ''}`} aria-labelledby={compact ? 'abc-english-heading' : 'abc-home-heading'}>
      <div className="alphabet-heading">
        <div>
          <span className="alphabet-kicker">🌟 第1级·A–Z 字母启蒙</span>
          <h2 id={compact ? 'abc-english-heading' : 'abc-home-heading'} className="alphabet-title">A 到 Z · 26篇独立字母小课</h2>
          <p className="alphabet-copy">每个字母独立一篇：认大小写、描字母、看图学单词、听女声跟读。</p>
        </div>
        <div className="alphabet-badge" aria-hidden>A–Z</div>
      </div>

      <div className="alphabet-day-tabs" role="tablist" aria-label="A到Z字母小课分组">
        {ALPHABET_DAYS.map((group) => {
          return (
            <button
              type="button"
              key={group.day}
              role="tab"
              aria-selected={selectedDay === group.day}
              className={`alphabet-day-tab ${selectedDay === group.day ? 'alphabet-day-tab-active' : ''}`}
              onClick={() => {
                setSelectedDay(group.day);
                setActive(group.letters[0].upper);
                stopSpeaking();
              }}
            >
              <span>字母小课</span>
              <b>{group.letters[0].upper}–{group.letters.at(-1)?.upper}</b>
            </button>
          );
        })}
      </div>

      <div className="alphabet-grid">
        {selected.letters.map((item, index) => (
          <article
            key={item.upper}
            className={`letter-card letter-card-tone-${(index + selectedDay) % 3} ${active === item.upper ? 'letter-card-active' : ''}`}
          >
            <span className="letter-pair"><b>{item.upper}</b><small>{item.lower}</small></span>
            <span className="letter-picture-wrap">
              {item.image
                ? <img src={`${base}assets/alphabet/${item.image}`} alt={`${item.upper} for ${item.word}`} className="letter-picture" />
                : <span className="letter-emoji" role="img" aria-label={item.cn}>{item.emoji}</span>}
            </span>
            <span className="letter-word"><b>{item.word}</b><small>{item.cn}</small></span>
            <button
              type="button"
              className="letter-listen"
              onClick={() => {
                setActive(item.upper);
                stopSpeaking();
                speakSequence([item.upper, item.word], 280);
              }}
              aria-label={`听 ${item.upper}，${item.word} 的发音`}
            >🔊 听发音</button>
            <button
              type="button"
              className="letter-open-lesson"
              onClick={() => navigate(`/english/lesson/${alphabetLessonId(item.upper)}`)}
              aria-label={`学习字母 ${item.upper} 的独立小课`}
            >📖 学习 {item.upper} 这一篇 <span aria-hidden>→</span></button>
          </article>
        ))}
      </div>

      {!compact && (
        <div className="alphabet-tip">
          <span aria-hidden>🐾</span>
          <p><b>本组3篇小课：</b>{selected.letters.map((letter) => `${letter.upper} · ${letter.word}`).join('、')}。每篇都可单独进入学习。</p>
        </div>
      )}
    </section>
  );
}
