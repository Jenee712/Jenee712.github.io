import { useEffect, useMemo, useState } from 'react';
import type { ReviewItem } from '@/types';
import { Mascot } from '@/components/characters/Mascot';
import { speakAuto, stopSpeaking } from '@/lib/speech';

interface Props {
  items: ReviewItem[];
  onResult: (itemId: string, result: 'ok' | 'retry') => void;
  onFinish: () => void;
}

/**
 * 复习小花园：每次 3–5 道薄弱点，用「浇水 / 让小树长大」包装，不展示错题数量与排名。
 * 第一次错给提示，不使用失败文案与红叉。
 */
export function ReviewGarden({ items, onResult, onFinish }: Props) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState<string | number | string[]>('');
  const [state, setState] = useState<'ask' | 'hint' | 'ok' | 'retry'>('ask');
  const [watered, setWatered] = useState(0);

  const item = items[idx];
  if (!item) return null;

  const isChoice = Array.isArray(item.choices);
  // 「听辨单词」：kind 是 word/sentence 且 answer 是单个字符串（来自 choices）
  // 不管 prompt 里有没有「听一听」字样，只要符合条件就显示大喇叭按钮
  const isWordChoice =
    isChoice &&
    typeof item.answer === 'string' &&
    (item.kind === 'word' || item.kind === 'sentence') &&
    !/^[a-zA-Z]$/.test(item.answer);
  const isLetterArray =
    !isChoice &&
    Array.isArray(item.answer) &&
    (item.answer as string[]).every((a) => typeof a === 'string' && /^[a-zA-Z]$/.test(a));
  const isNumberAnswer = typeof item.answer === 'number';
  const correctNorm = Array.isArray(item.answer)
    ? (item.answer as string[]).map((s) => s.trim().toLowerCase())
    : [String(item.answer).trim().toLowerCase()];

  // 進入每題時自動朗讀題目
  useEffect(() => {
    if (!item) return;
    const t = setTimeout(() => speakAuto(item.prompt), 350);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [item?.itemId]);

  const check = () => {
    let ok = false;
    if (isLetterArray) {
      const a = Array.isArray(input) ? input.map((s) => s.toLowerCase()) : [];
      ok = a.length === correctNorm.length && a.every((c, i) => c === correctNorm[i]);
    } else {
      const v = Array.isArray(input) ? String(input[0] ?? '') : String(input);
      ok = correctNorm.includes(v.trim().toLowerCase());
    }
    if (ok) {
      setState('ok');
      onResult(item.itemId, 'ok');
      setWatered((w) => w + 1);
    } else if (state === 'ask') {
      setState('hint');
    } else {
      setState('retry');
      onResult(item.itemId, 'retry');
    }
  };

  const next = () => {
    if (idx + 1 >= items.length) {
      onFinish();
      return;
    }
    setIdx(idx + 1);
    setInput(isLetterArray ? [] : '');
    setState('ask');
  };

  const isEmptyInput = isLetterArray
    ? !(Array.isArray(input) && input.length)
    : input === '' || input === undefined || input === null;

  return (
    <div className="mx-auto max-w-md">
      <div className="card-barn p-5 text-center">
        <Mascot name="rabbit" size={72} animated className={state === 'ok' ? 'animate-pop' : ''} />
        <h2 className="type-h3 mt-1">复习小花园</h2>
        <p className="text-sm text-forest-500">
          帮小苗浇浇水，让它快快长大 🌱（{idx + 1}/{items.length}）
        </p>

        <div className="mt-4 card p-4 text-left">
          <div className="flex items-center justify-center gap-2 text-center">
            <p className="type-body text-forest-800 flex-1">{item.prompt}</p>
            <button
              type="button"
              onClick={() => speakAuto(item.prompt)}
              className="w-9 h-9 rounded-full bg-forest-100 ring-1 ring-forest-300 text-forest-600 text-lg tap flex items-center justify-center hover:scale-110 transition shrink-0"
              aria-label="再聽一次題目"
            >
              🔊
            </button>
          </div>
          {item.hint && state === 'hint' && (
            <p className="mt-2 text-sm text-sun-500 text-center">💡 小提示：{item.hint}</p>
          )}

          {/* 「听辨单词/句子」专用大按钮：word/sentence 题让孩子先听再选 */}
          {isWordChoice && (
            <button
              type="button"
              onClick={() => speakAuto(String(item.answer))}
              className="mt-4 mx-auto flex items-center justify-center gap-2 rounded-barn bg-sun-100 ring-2 ring-sun-300 text-forest-800 px-5 py-3 tap hover:bg-sun-200 transition shadow-sm"
              aria-label="听一听单词发音"
            >
              <span className="text-3xl">🔊</span>
              <span className="font-display font-bold text-lg">听一听，再选</span>
            </button>
          )}

          {isChoice ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(item.choices as string[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setInput(c)}
                  className={`btn-secondary tap ${input === c ? 'ring-2 ring-forest-600' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          ) : isLetterArray ? (
            <LetterTapInput
              letters={item.answer as string[]}
              value={Array.isArray(input) ? input : []}
              onChange={setInput}
            />
          ) : isNumberAnswer ? (
            <div className="mt-3 flex justify-center gap-2 flex-wrap">
              {[3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setInput(n)}
                  className={`btn-secondary tap w-14 ${input === n ? 'ring-2 ring-forest-600' : ''}`}
                >
                  {n}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={String(input ?? '')}
              onChange={(e) => setInput(e.target.value)}
              className="mt-3 w-full text-center text-2xl font-display font-bold rounded-barn border-2 border-forest-300 focus:border-forest-600 focus:outline-none px-3 py-2"
              placeholder="在這裏輸入"
              autoFocus
            />
          )}
        </div>

        {state === 'ok' && (
          <div className="mt-3 space-y-1">
            <p className="font-display font-bold text-forest-600">🌱 浇好水啦，小苗长高一点！</p>
            {isLetterArray && (
              <p className="text-sm text-forest-600">
                拼對了：<span className="font-display font-bold text-forest-800">{(item.answer as string[]).join(' - ')}</span>
              </p>
            )}
          </div>
        )}
        {state === 'retry' && <p className="mt-3 text-sm text-forest-500">再试一次，你已经更靠近啦～</p>}

        <div className="mt-4 flex justify-center gap-3">
          {state === 'ask' || state === 'hint' ? (
            <button
              type="button"
              onClick={check}
              className="btn-primary tap"
              disabled={isEmptyInput}
            >
              {state === 'hint' ? '我记住啦' : '提交'}
            </button>
          ) : (
            <button type="button" onClick={next} className="btn-primary tap">
              {idx + 1 >= items.length ? '完成 🎉' : '下一题 →'}
            </button>
          )}
        </div>
        <div className="mt-3 text-xs text-forest-400">已浇水 {watered} 株</div>
      </div>
    </div>
  );
}

/** 「拼單詞」輸入：給 rv-sit 這種 answer 為字母數組的題用。
 *  字母盤含正確字母 + 隨機干擾項，點擊字母按順序排，點已選字母可單獨發音。 */
function LetterTapInput({
  letters,
  value,
  onChange,
}: {
  letters: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  // 用 version 作為 key，clearAll 時 bump 即可重置字母盤
  const [version, setVersion] = useState(0);

  const pop = () => {
    if (value.length === 0) return;
    onChange(value.slice(0, -1));
  };

  const clearAll = () => {
    if (value.length === 0) return;
    onChange([]);
    setVersion((v) => v + 1);
  };

  return (
    <div className="mt-3 space-y-3">
      {/* 字母盤 + 已拼：同一個 version 強綁一起，clearAll 只需 bump version 就能重置字母盤 */}
      <LetterPool key={version} letters={letters} value={value} onChange={onChange} />

      <div className="flex justify-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={pop}
          disabled={value.length === 0}
          className="btn-ghost tap text-sm disabled:opacity-40"
        >
          ⌫ 退一格
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={value.length === 0}
          className="btn-ghost tap text-sm disabled:opacity-40"
        >
          🧹 清空
        </button>
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => speakAuto(value.join(' '))}
            className="btn-ghost tap text-sm"
            aria-label="聽一聽拼到現在的單詞"
          >
            🔊 聽一聽
          </button>
        )}
      </div>
    </div>
  );
}

/** 字母盤 + 已拼區。外部用 key 重置可一次性清空。 */
function LetterPool({
  letters,
  value,
  onChange,
}: {
  letters: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const pool = useMemo(() => {
    const target = letters.map((l) => l.toLowerCase());
    const decoys: string[] = [];
    const seedPool = 'abcdefghijklmnopqrstuvwxyz';
    while (decoys.length < Math.max(2, letters.length)) {
      const c = seedPool[Math.floor(Math.random() * seedPool.length)];
      if (!target.includes(c) && !decoys.includes(c)) decoys.push(c);
    }
    const counts: Record<string, number> = {};
    for (const c of [...target, ...decoys]) counts[c] = (counts[c] ?? 0) + 1;
    const ordered = [...target, ...decoys].sort(() => Math.random() - 0.5);
    return ordered.map((c) => ({ letter: c, remaining: counts[c] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letters.join(',')]);

  const remaining = (c: string) => pool.find((p) => p.letter === c)?.remaining ?? 0;

  const tap = (c: string) => {
    if (remaining(c) <= 0) return;
    onChange([...value, c.toLowerCase()]);
    const idx = pool.findIndex((p) => p.letter === c);
    if (idx >= 0) pool[idx] = { ...pool[idx], remaining: pool[idx].remaining - 1 };
  };

  return (
    <>
      <div className="min-h-14 rounded-barn border-2 border-dashed border-forest-300 flex flex-wrap items-center justify-center gap-1.5 p-2 bg-forest-50/40">
        {value.length === 0 ? (
          <span className="text-forest-400 text-sm">按順序點下面的字母</span>
        ) : (
          value.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => speakAuto(c)}
              className="w-11 h-12 rounded-barn bg-forest-100 ring-1 ring-forest-300 font-display font-bold text-forest-800 text-xl hover:bg-forest-200 transition"
              title="點擊聽發音"
            >
              {c.toUpperCase()}
            </button>
          ))
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {pool.map((p, i) => (
          <button
            key={`${p.letter}-${i}`}
            type="button"
            onClick={() => tap(p.letter)}
            disabled={p.remaining <= 0}
            className={`w-12 h-12 rounded-barn font-display font-bold text-xl tap transition ${
              p.remaining > 0
                ? 'bg-cream-50 ring-1 ring-forest-300 text-forest-800 hover:bg-forest-100'
                : 'bg-forest-50 text-forest-300 ring-1 ring-forest-100 cursor-not-allowed'
            }`}
            aria-label={`選 ${p.letter.toUpperCase()}`}
          >
            {p.letter.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}
