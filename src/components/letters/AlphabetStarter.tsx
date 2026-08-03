import { useState } from 'react';

const LETTERS = [
  { letter: 'A', lower: 'a', word: 'apple', cn: '苹果', image: 'a-apple.png', tone: 'letter-card-apple' },
  { letter: 'B', lower: 'b', word: 'bear', cn: '小熊', image: 'b-bear.png', tone: 'letter-card-bear' },
  { letter: 'C', lower: 'c', word: 'cat', cn: '小猫', image: 'c-cat.png', tone: 'letter-card-cat' },
] as const;

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.72;
  utterance.pitch = 1.12;
  window.speechSynthesis.speak(utterance);
}

export function AlphabetStarter({ compact = false }: { compact?: boolean }) {
  const base = import.meta.env.BASE_URL;
  const [active, setActive] = useState<string>('A');

  return (
    <section className={`alphabet-starter ${compact ? 'alphabet-starter-compact' : ''}`} aria-labelledby={compact ? 'abc-english-heading' : 'abc-home-heading'}>
      <div className="alphabet-heading">
        <div>
          <span className="alphabet-kicker">🌟 第1级·字母启蒙</span>
          <h2 id={compact ? 'abc-english-heading' : 'abc-home-heading'} className="alphabet-title">从 A B C 开始认识英文字母</h2>
          <p className="alphabet-copy">看图片、认大小写、点一点听发音。</p>
        </div>
        <div className="alphabet-badge" aria-hidden>ABC</div>
      </div>

      <div className="alphabet-grid">
        {LETTERS.map((item) => (
          <button
            type="button"
            key={item.letter}
            className={`letter-card ${item.tone} ${active === item.letter ? 'letter-card-active' : ''}`}
            onClick={() => { setActive(item.letter); speak(`${item.letter}. ${item.word}.`); }}
            aria-label={`点击听 ${item.letter}，${item.word}`}
          >
            <span className="letter-pair"><b>{item.letter}</b><small>{item.lower}</small></span>
            <span className="letter-picture-wrap">
              <img src={`${base}assets/alphabet/${item.image}`} alt={`${item.letter} for ${item.word}`} className="letter-picture" />
            </span>
            <span className="letter-word"><b>{item.word}</b><small>{item.cn}</small></span>
            <span className="letter-listen">🔊 点击听发音</span>
          </button>
        ))}
      </div>

      {!compact && (
        <div className="alphabet-tip">
          <span aria-hidden>🐾</span>
          <p><b>今天的小目标：</b>能指出 A、B、C，并跟读 apple、bear、cat。</p>
        </div>
      )}
    </section>
  );
}
