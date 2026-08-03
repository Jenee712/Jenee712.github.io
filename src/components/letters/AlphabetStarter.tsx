import { useEffect, useState } from 'react';
import { speakSequence, stopSpeaking } from '@/lib/speech';
import { ALPHABET_DAYS } from '@/data/alphabet';
import { useAppStore } from '@/store/useAppStore';

export function AlphabetStarter({ compact = false }: { compact?: boolean }) {
  const base = import.meta.env.BASE_URL;
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
          <h2 id={compact ? 'abc-english-heading' : 'abc-home-heading'} className="alphabet-title">9天认识 A 到 Z</h2>
          <p className="alphabet-copy">每天最多3个新字母，看图、认大小写、听女声发音。</p>
        </div>
        <div className="alphabet-badge" aria-hidden>A–Z</div>
      </div>

      <div className="alphabet-day-tabs" role="tablist" aria-label="A到Z字母学习计划">
        {ALPHABET_DAYS.map((group) => {
          const label = group.letters.map((letter) => letter.upper).join('');
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
              <span>第{group.day}天</span>
              <b>{label}</b>
            </button>
          );
        })}
      </div>

      <div className="alphabet-grid">
        {selected.letters.map((item, index) => (
          <button
            type="button"
            key={item.upper}
            className={`letter-card letter-card-tone-${(index + selectedDay) % 3} ${active === item.upper ? 'letter-card-active' : ''}`}
            onClick={() => {
              setActive(item.upper);
              stopSpeaking();
              speakSequence([item.upper, item.word], 280);
            }}
            aria-label={`点击听 ${item.upper}，${item.word}`}
          >
            <span className="letter-pair"><b>{item.upper}</b><small>{item.lower}</small></span>
            <span className="letter-picture-wrap">
              {item.image
                ? <img src={`${base}assets/alphabet/${item.image}`} alt={`${item.upper} for ${item.word}`} className="letter-picture" />
                : <span className="letter-emoji" role="img" aria-label={item.cn}>{item.emoji}</span>}
            </span>
            <span className="letter-word"><b>{item.word}</b><small>{item.cn}</small></span>
            <span className="letter-listen">🔊 点击听发音</span>
          </button>
        ))}
      </div>

      {!compact && (
        <div className="alphabet-tip">
          <span aria-hidden>🐾</span>
          <p><b>第{selectedDay}天小目标：</b>能指出 {selected.letters.map((letter) => letter.upper).join('、')}，并跟读 {selected.letters.map((letter) => letter.word).join('、')}。</p>
        </div>
      )}
    </section>
  );
}
