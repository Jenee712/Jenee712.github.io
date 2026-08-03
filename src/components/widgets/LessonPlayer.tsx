import { useState, useEffect, useRef } from 'react';
import type { Lesson, LessonStep } from '@/types';
import { Mascot } from '@/components/characters/Mascot';
import { LearningStage } from '@/components/lesson/LearningStage';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { VoiceRecorder } from '@/components/ui/VoiceRecorder';
import { TracingCanvas } from '@/components/ui/TracingCanvas';
import { speak, speakAuto, speakSequence, stopSpeaking, isEnglish, isChinese, isSpeakable, toSpokenText } from '@/lib/speech';

interface Props {
  lesson: Lesson;
  subject: 'english' | 'math';
  storyLine: string;
  onComplete: (payload: { correct: number; total: number; minutes: number }) => void;
  onExit: () => void;
}

/** 通用关卡播放器：听音点选 / 字母拖拽 / 跟读录音 / 描红 / 数一数 / 数字键盘。鼓励式反馈，无失败惩罚。 */
export function LessonPlayer({ lesson, subject, storyLine, onComplete, onExit }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'good' | 'try'>('none');
  const [correctCount, setCorrectCount] = useState(0);
  const [tries, setTries] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const startRef = useRef(Date.now());
  const total = lesson.steps.length;
  const step = lesson.steps[stepIdx];
  const mascot = subject === 'english' ? 'deer' : 'bear';

  useEffect(() => { setTries(0); setFeedback('none'); setShowAnswer(false); startRef.current = Date.now(); stopSpeaking(); }, [stepIdx]);

  const goNext = () => {
    if (stepIdx + 1 < total) setStepIdx((s) => s + 1);
    else {
      const minutes = Math.max(1, Math.round((Date.now() - startRef.current) / 60000) || lesson.durationMin);
      onComplete({ correct: correctCount, total, minutes });
    }
  };

  const handle = (ok: boolean) => {
    setTries((t) => t + 1);
    if (ok) {
      setCorrectCount((c) => c + 1);
      setFeedback('good');
      setTimeout(goNext, 700);
    } else if (tries === 0) {
      setFeedback('try'); // 第一次错：提示，不扣分、不嘲笑
    } else {
      setFeedback('good'); // 第二次错：温和带过，不展示失败
      setTimeout(goNext, 600);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 md:p-6">
      <header className="lesson-focus-header">
        <button onClick={onExit} className="lesson-exit" aria-label="退出关卡">← <span>返回</span></button>
        <div className="flex-1 max-w-md">
          <div className="flex justify-between text-xs font-semibold text-forest-600 mb-1.5"><span>{lesson.title}</span><span>{stepIdx + 1} / {total}</span></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${((stepIdx + 1) / total) * 100}%` }} /></div>
        </div>
        <span className="hidden sm:inline text-sm text-forest-500">🐾 伙伴陪学</span>
      </header>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
      <LearningStage
        mascot={mascot}
        title={`${lesson.title}`}
        storyLine={storyLine}
        stepLabel={`第 ${stepIdx + 1} / ${total} 步`}
        footer={feedback === 'try' && step.hint ? (
          <div className="card-barn px-4 py-2 text-forest-700 flex items-center gap-2">
            <Mascot name="bird" size={32} />
            <span>小提示：{step.hint}</span>
          </div>
        ) : feedback === 'good' ? (
          <div className="text-forest-700 font-display font-bold flex items-center gap-2 animate-pop">👍 真棒，继续！</div>
        ) : null}
      >
        <StepView step={step} onResult={handle} />
      </LearningStage>
      <div className="mt-4 flex flex-col items-center gap-3">
        {showAnswer ? (
          <AnswerView step={step} onContinue={goNext} />
        ) : (
          <button onClick={() => setShowAnswer(true)} className="btn-ghost tap inline-flex items-center gap-2" aria-label="查看正确答案">
            <span>🙋</span> 看答案
          </button>
        )}
      </div>
      </div>
    </div>
  );
}

function StepView({ step, onResult }: { step: LessonStep; onResult: (ok: boolean) => void }) {
  switch (step.ui) {
    case 'tap_choice':  return <TapChoice step={step} onResult={onResult} />;
    case 'blend':       return <BlendStep step={step} onResult={onResult} />;
    case 'read_along':  return <ReadAlong step={step} onResult={onResult} />;
    case 'drag_count':  return <DragCount step={step} onResult={onResult} />;
    case 'number_pad':  return <NumberPad step={step} onResult={onResult} />;
    case 'order_words': return <OrderWords step={step} onResult={onResult} />;
    case 'trace_letter': return <TraceStep step={step} onResult={onResult} />;
    case 'trace_word':  return <TraceStep step={step} onResult={onResult} />;
    default:            return <TapChoice step={step} onResult={onResult} />;
  }
}

/**
 * 题目标题 + 「读题」按钮。
 * 一年级小孩多半读不懂题面（尤其数学应用题和算式），
 * 所以进入每一步自动朗读一遍，并常驻一个可重复点击的读题按钮。
 */
function PromptTitle({ step, autoSpeak = true, showButton = true }: { step: LessonStep; autoSpeak?: boolean; showButton?: boolean }) {
  // 填空题面（形如 填空：「____ is a book」）：把下划线换成 step.answer，
  // 整句「There is a book」用英文语音读 —— 孩子听到的就是要学的那句话，
  // 也能彻底避开把 ____ 喂给中文 TTS 出现的「底线/下划线」噪音。
  const blankSpoken = (() => {
    if (!/_/.test(step.prompt) || step.answer == null) return null;
    const m = step.prompt.match(/「([^」]*)」/);
    if (!m) return null;
    const inner = m[1].replace(/_+/g, String(step.answer)).replace(/\s+/g, ' ').trim();
    return isEnglish(inner) ? inner : null;
  })();
  const spoken = blankSpoken ?? toSpokenText(step.prompt);
  const canSpeak = isSpeakable(spoken);

  useEffect(() => {
    if (!autoSpeak || !canSpeak) return;
    // 延迟一点，等父组件切步骤时的 stopSpeaking() 先执行完
    const t = setTimeout(() => speakAuto(spoken), 350);
    return () => clearTimeout(t);
  }, [step.id]);

  return (
    <div className="text-center">
      <h2 className="type-h2">{step.prompt}</h2>
      {canSpeak && showButton && (
        <button
          onClick={() => speakAuto(spoken)}
          className="btn-secondary tap mt-3 inline-flex items-center gap-2"
          aria-label="再读一遍题目"
        >
          <span className="text-xl">🔊</span> 读题
        </button>
      )}
    </div>
  );
}

function TapChoice({ step, onResult }: { step: LessonStep; onResult: (ok: boolean) => void }) {
  const choices = step.choices ?? [];
  const phrases = extractEnglishPhrases(step.prompt);
  const anySpeakable = choices.some(isSpeakable);
  return (
    <div>
      <PromptTitle step={step} />
      {phrases.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {phrases.map((p, i) => (
            <button key={i} onClick={() => speak(p)} className="btn-secondary tap inline-flex items-center gap-2 text-base" aria-label={`听 ${p}`}>
              <span className="text-xl">🔊</span> <span className="font-display font-bold">{p}</span>
            </button>
          ))}
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {choices.map((c) => (
          <div key={c} className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => onResult(c === step.answer)}
              className="btn-secondary w-full min-h-[5.5rem] px-2 text-xl font-display font-bold tap whitespace-normal break-words leading-snug"
            >
              {c}
            </button>
            {isSpeakable(c) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = step.choices?.indexOf(c) ?? -1;
                  const cn = idx >= 0 ? step.choicesCn?.[idx] : undefined;
                  if (cn && isChinese(cn)) speakSequence([c, cn]); else speakAuto(c);
                }}
                className="text-xs text-forest-600 tap flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-100/70 hover:bg-forest-100 transition"
                aria-label={`听 ${c}`}
              >
                <span>🔊</span> 听
              </button>
            )}
          </div>
        ))}
      </div>
      {anySpeakable && <p className="type-meta mt-3 text-center">💡 点选项下面的小喇叭可以听每个答案</p>}
    </div>
  );
}

function BlendStep({ step, onResult }: { step: LessonStep; onResult: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<string[]>([]);
  const target = Array.isArray(step.answer) ? step.answer : [String(step.answer)];
  const decoys = step.decoys && step.decoys.length ? step.decoys : ['b', 'd', 'm'];
  const [pool, setPool] = useState<string[]>(shuffle([...target, ...decoys]));
  const complete = picked.length === target.length && picked.every((c, i) => c === target[i]);
  useEffect(() => {
    if (complete) {
      // 拼对了读出完整单词
      speakAuto(target.join(''));
      const t = setTimeout(() => onResult(true), 1000);
      return () => { clearTimeout(t); stopSpeaking(); };
    }
  }, [complete]);

  return (
    <div>
      <PromptTitle step={step} />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {picked.map((c, i) => (
          <span key={i} className="w-20 h-20 rounded-barn bg-sun-400/30 ring-2 ring-sun-500/40 flex items-center justify-center font-display font-extrabold text-3xl text-forest-800 animate-pop">{c}</span>
        ))}
        {Array.from({ length: target.length - picked.length }).map((_, i) => (
          <span key={`e${i}`} className="w-20 h-20 rounded-barn bg-cream-200 ring-1 ring-forest-200" />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {pool.map((c, i) => (
          <button key={i} onClick={() => { if (picked.length >= target.length) return; setPicked([...picked, c]); setPool(pool.filter((_, idx) => idx !== i)); }}
            className="w-16 h-16 rounded-barn bg-cream-50 ring-1 ring-forest-200 font-display font-extrabold text-2xl text-forest-800 tap hover:scale-105 transition" aria-label={`选 ${c}`}>{c}</button>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button onClick={() => { setPicked([]); setPool(shuffle([...target, ...decoys])); }} className="btn-ghost tap">↺ 重选</button>
      </div>
    </div>
  );
}

function ReadAlong({ step, onResult }: { step: LessonStep; onResult: (ok: boolean) => void }) {
  const text = String(step.answer);
  useEffect(() => {
    // 进入跟读步骤时自动读一遍，让孩子先听到正确发音（中英文都支持）
    if (isSpeakable(text)) {
      const t = setTimeout(() => speakAuto(text), 400);
      return () => { clearTimeout(t); stopSpeaking(); };
    }
  }, [text]);
  return (
    <div>
      {/* 跟读题的题面是「跟我读：<整段英文>」，用中文语音读会很怪，
          而且正文本身已经会自动朗读，这里只显示不发声 */}
      <PromptTitle step={step} autoSpeak={false} showButton={false} />
      <div className="mt-6 card-leaf p-8 text-center">
        <div className="font-display font-extrabold text-2xl md:text-3xl text-forest-800 leading-loose flex flex-wrap justify-center gap-1">
          {text.split(/\s+/).filter(Boolean).map((w, i) => (
            <button key={i} onClick={() => speakAuto(w.replace(/[.,!?;:"""()\-—，。！？；：、]/g, ''))}
              className="hover:bg-sun-400/30 rounded-md px-1 transition cursor-pointer"
              title={`点击听 ${w}`}>
              {w}
            </button>
          ))}
        </div>
        <p className="type-meta mt-3">💡 点任何一个单词都能听发音 · 点下方按钮听整句</p>
      </div>
      <div className="mt-6 flex flex-col items-center gap-3">
        {isSpeakable(text) && (
          <button onClick={() => speakAuto(text)} className="btn-primary-lg tap flex items-center gap-2" aria-label="听一听正确发音">
            <span className="text-2xl">🔊</span> 听一听
          </button>
        )}
        <VoiceRecorder onRecorded={() => onResult(true)} />
        <button onClick={() => onResult(true)} className="btn-ghost tap">跳过（家长协助）</button>
      </div>
    </div>
  );
}

function TraceStep({ step, onResult }: { step: LessonStep; onResult: (ok: boolean) => void }) {
  const letter = String(step.answer);
  return (
    <div>
      <PromptTitle step={step} />
      <div className="mt-6 flex justify-center">
        <TracingCanvas letter={letter} onDone={() => setTimeout(() => onResult(true), 400)} />
      </div>
      <div className="mt-3 flex justify-center">
        <button onClick={() => onResult(true)} className="btn-ghost tap">完成</button>
      </div>
    </div>
  );
}

function DragCount({ step, onResult }: { step: LessonStep; onResult: (ok: boolean) => void }) {
  const b1 = step.bagCount ?? 5;
  const b2 = step.bagCount2;
  const mode: 'add' | 'remove' = step.bagOp === 'remove' ? 'remove' : 'add';
  const target = Number(step.answer);
  const [bag1, setBag1] = useState(b1);
  const [bag2, setBag2] = useState(b2 ?? 0);
  const [tray, setTray] = useState(0);
  const reset = () => { setBag1(b1); setBag2(b2 ?? 0); setTray(0); };

  // 明确显示算式 + 一句话说明，让家长/孩子一眼知道"在算什幺、怎幺操作"
  const showExpr = mode === 'add' ? (b1 + ' + ' + (b2 ?? '?')) : (b1 + ' − ' + (b2 ?? '?'));
  const showTail = mode === 'add' ? '= ?' : '= ?';

  return (
    <div>
      <PromptTitle step={step} />
      {/* 算式卡：让"在算什幺"一目了然 */}
      <div className="mt-4 mx-auto max-w-md card-barn p-4 text-center">
        <div className="text-3xl sm:text-4xl font-display font-extrabold text-forest-800 tracking-wide">
          <span>{b1}</span>
          <span className={'mx-2 ' + (mode === 'add' ? 'text-sun-500' : 'text-soil-500')}>
            {mode === 'add' ? '+' : '−'}
          </span>
          <span>{b2 ?? '?'}</span>
          <span className="ml-2 text-forest-500">{showTail}</span>
        </div>
        <div className="mt-2 text-sm text-forest-700/90">
          {mode === 'add'
            ? '把两堆合在一起，托盘里一共有几个？'
            : '一共 ' + b1 + ' 个，把 ' + (b2 ?? '?') + ' 个拿走，还剩几个？'}
        </div>
      </div>

      <div className={'mt-5 grid gap-4 ' + (mode === 'add' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2')}>
        {/* 左：一堆（合起来=第一组；拿走=全部） */}
        <div className="card p-4 min-h-[10rem]">
          <div className="text-sm font-bold text-forest-700 mb-2">
            {mode === 'remove' ? '🍩 一共有 ' + b1 + ' 个' : '🍩 第一组'}
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: bag1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setBag1((x) => x - 1); setTray((t) => t + 1); }}
                className="w-11 h-11 rounded-full bg-sun-400/80 ring-2 ring-sun-500/50 text-xl tap shadow-sm"
                aria-label={mode === 'remove' ? '拿走一个' : '搬到托盘'}
              >●</button>
            ))}
            {bag1 === 0 && (
              <span className="text-forest-500 text-sm self-center">
                {mode === 'remove' ? '全拿走了' : '空了'}
              </span>
            )}
          </div>
        </div>

        {/* 中：合起来的第二组（仅加法显示） */}
        {mode === 'add' && (
          <div className="card p-4 min-h-[10rem]">
            <div className="text-sm font-bold text-forest-700 mb-2">🍩 第二组</div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: bag2 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setBag2((x) => x - 1); setTray((t) => t + 1); }}
                  className="w-11 h-11 rounded-full bg-sky-400/80 ring-2 ring-sky-500/50 text-xl tap shadow-sm"
                  aria-label="搬到托盘"
                >●</button>
              ))}
              {bag2 === 0 && <span className="text-forest-500 text-sm self-center">空了</span>}
            </div>
          </div>
        )}

        {/* 右：托盘（加法=合起来的结果）/ 拿走桶（减法） */}
        <div className="card-leaf p-4 min-h-[10rem]">
          <div className="text-sm font-bold text-forest-700 mb-2">
            {mode === 'remove' ? '🚮 拿走了' : '🍽 托盘里'}（共 {tray}）
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: tray }).map((_, i) => (
              <span
                key={i}
                className="w-11 h-11 rounded-full bg-forest-500 ring-2 ring-forest-700 text-xl text-cream-50 inline-flex items-center justify-center"
                aria-hidden
              >●</span>
            ))}
            {tray === 0 && (
              <span className="text-forest-500 text-sm self-center">
                {mode === 'remove' ? '还没拿' : '还没搬'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => onResult(mode === 'remove' ? bag1 === target : tray === target)}
          className="btn-primary-lg tap"
        >
          完成
        </button>
        <button onClick={reset} className="btn-secondary tap">↺ 重来</button>
      </div>
    </div>
  );
}

function NumberPad({ step, onResult }: { step: LessonStep; onResult: (ok: boolean) => void }) {
  const [val, setVal] = useState('');
  const target = String(step.answer);
  return (
    <div>
      <PromptTitle step={step} />
      <div className="mt-6 card-barn mx-auto max-w-xs h-20 flex items-center justify-center text-4xl font-display font-extrabold text-forest-800">{val || '?'}</div>
      <div className="mt-4 mx-auto max-w-xs grid grid-cols-3 gap-2">
        {['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map((k) => (
          <button key={k} onClick={() => {
            if (k === '⌫') { setVal((v) => v.slice(0, -1)); return; }
            if (k === '✓') { onResult(val === target); return; }
            setVal((v) => (v + k).slice(0, 3));
          }} className={k === '✓' ? 'h-16 rounded-barn text-2xl font-display font-bold tap bg-forest-700 text-cream-50' : 'h-16 rounded-barn text-2xl font-display font-bold tap bg-cream-50 ring-1 ring-forest-200 text-forest-800'} aria-label={`数字 ${k}`}>{k}</button>
        ))}
      </div>
    </div>
  );
}

function OrderWords({ step, onResult }: { step: LessonStep; onResult: (ok: boolean) => void }) {
  const raw = String(step.answer);
  // 中文（古诗/成语）按空格切只有 1 个 token，根本没东西可「排」。
  // 自动切换为「跟我读」模式：大字呈现 + 自动朗读 + 「我会读了」按钮确认。
  const tokens = raw.split(/\s+/).filter(Boolean);
  const isSingleToken = tokens.length <= 1;
  const isChineseText = isChinese(raw);

  if (isSingleToken && isChineseText) {
    return <ReciteView text={raw} onDone={() => onResult(true)} />;
  }

  const target = tokens;
  const [pool, setPool] = useState<string[]>(shuffle([...target]));
  const [built, setBuilt] = useState<string[]>([]);
  const complete = built.length === target.length && built.every((c, i) => c === target[i]);
  useEffect(() => {
    if (complete) {
      // 拼对了自动读一遍正确句子
      speakAuto(built.join(isSpeakable(built.join('')) && !isEnglish(built.join(' ')) ? '' : ' '));
      const t = setTimeout(() => onResult(true), 1200);
      return () => { clearTimeout(t); stopSpeaking(); };
    }
  }, [complete]);
  return (
    <div>
      <PromptTitle step={step} />
      <div className="mt-6 card-barn p-4 min-h-20 flex flex-wrap gap-2">
        {built.length === 0 && <span className="text-forest-500">按顺序点单词</span>}
        {built.map((w, i) => (
          <button key={i} onClick={() => speakAuto(w)} className="px-3 py-2 rounded-barn bg-forest-100 text-forest-800 font-display font-bold animate-pop hover:bg-forest-200 transition" title={`点击听 ${w}`}>{w}</button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {pool.map((w, i) => (
          <div key={`${w}-${i}`} className="flex flex-col items-center gap-1">
            <button onClick={() => { setBuilt([...built, w]); setPool(pool.filter((_, idx) => idx !== i)); }} className="px-4 py-2 rounded-barn bg-cream-50 ring-1 ring-forest-200 font-display font-bold text-forest-800 tap min-w-[3.5rem]" aria-label={`选 ${w}`}>{w}</button>
            <button onClick={(e) => { e.stopPropagation(); speakAuto(w); }} className="text-xs text-forest-600 tap flex items-center gap-1 px-2 py-0.5 rounded-full bg-forest-100/70 hover:bg-forest-100" aria-label={`听 ${w} 的发音`}>
              <span>🔊</span> 听
            </button>
          </div>
        ))}
      </div>
      {built.length > 0 && !complete && (
        <div className="mt-4 flex justify-center">
          <button onClick={() => speakAuto(built.join(isSpeakable(built.join('')) && !isEnglish(built.join(' ')) ? '' : ' '))} className="btn-ghost tap flex items-center gap-2" aria-label="听一听当前的句子">
            <span className="text-xl">🔊</span> 听一听
          </button>
        </div>
      )}
    </div>
  );
}

/** 「跟我读」视图：给中文古诗/成语的单 token 关卡用。
 *  大字呈现 + 自动朗读 + 「我会读了」按钮确认。 */
function ReciteView({ text, onDone }: { text: string; onDone: () => void }) {
  // 进入即朗读一次
  useEffect(() => {
    const t = setTimeout(() => speakAuto(text), 350);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [text]);

  // 中文（特别是繁体）字数多，自动放大到适合一行显示的字号
  const len = text.length;
  const sizeCls =
    len <= 4 ? 'text-4xl sm:text-5xl' :
    len <= 7 ? 'text-3xl sm:text-4xl' :
    len <= 14 ? 'text-2xl sm:text-3xl' :
    'text-xl sm:text-2xl';

  return (
    <div>
      <h2 className="type-h2 text-center">跟着读一遍：</h2>

      <div className="mt-6 card-leaf p-8 sm:p-10 text-center">
        <p className={`font-display font-bold text-forest-800 leading-relaxed tracking-wider ${sizeCls}`}>
          {text}
        </p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => speakAuto(text)}
            className="btn-secondary tap inline-flex items-center gap-2"
            aria-label="再听一次"
          >
            <span className="text-2xl">🔊</span> 再听一次
          </button>          <button
            onClick={onDone}
            className="btn-primary tap inline-flex items-center gap-2"
            aria-label="我会读了"
          >
            <span className="text-2xl">✅</span> 我会读了
          </button>
        </div>
        <p className="mt-4 type-meta text-center text-forest-600">💡 大声跟着读一读，读完按「我会读了」</p>
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 从提示文案里抠出英文短语（引号包围的，如 "get up"）。
 *  中文引号内容（如 "我"）不算，否则会被当英文读出奇怪发音。 */
function extractEnglishPhrases(text: string): string[] {
  const quoted = text.match(/"([^"]+)"/g) || [];
  return quoted
    .map((q) => q.slice(1, -1).trim())
    .filter((p) => p.length > 0 && /[a-zA-Z]/.test(p) && !/[\u4e00-\u9fff]/.test(p));
}

/** 「看答案」面板：显示正确答案 + 发音按钮 + 继续下一题。
 *  选择题会把每个选项的「英文 + 中文翻译」成对朗读，例如 "We go to school" → "我们去学校"。 */
function AnswerView({ step, onContinue }: { step: LessonStep; onContinue: () => void }) {
  let answerText = '';
  let speakText = '';
  // 选择题专用：自动 + 手动朗读时，依次「英文选项 + 中文翻译」成对念出
  const allSpeakTexts: string[] = [];
  const choices = Array.isArray(step.choices) ? step.choices : [];
  const choicesCn = Array.isArray(step.choicesCn) ? step.choicesCn : [];
  const pushPair = (en: string | number, cn?: string) => {
    const e = String(en);
    if (isSpeakable(e)) allSpeakTexts.push(e);
    if (cn && isChinese(cn)) allSpeakTexts.push(cn);
  };
  switch (step.ui) {
    case 'tap_choice':
      answerText = String(step.answer);
      speakText = isSpeakable(answerText) ? answerText : '';
      // 每个选项（英文 + 对应中文）成对加入朗读队列；正确答案已包含在选项里，不再重复
      choices.forEach((c, idx) => pushPair(c, choicesCn[idx]));
      break;
    case 'blend': {
      const a = Array.isArray(step.answer) ? step.answer.join('') : String(step.answer);
      answerText = a; speakText = a; break;
    }
    case 'read_along':
      answerText = String(step.answer); speakText = answerText; break;
    case 'order_words':
      answerText = String(step.answer); speakText = answerText; break;
    case 'drag_count':
    case 'number_pad':
      answerText = String(step.answer);
      // 纯数字答案原本不会发声，这里补成中文句子念出来
      speakText = `答案是 ${answerText}`;
      break;
    default:
      answerText = String(step.answer);
      speakText = isSpeakable(answerText) ? answerText : '';
  }
  useEffect(() => {
    // 进入「看答案」自动朗读：选择题把所有选项「英文 + 中文」成对念完；其他题只念答案
    const queue = allSpeakTexts.length ? allSpeakTexts : (speakText ? [speakText] : []);
    if (queue.length) {
      const t = setTimeout(() => speakSequence(queue), 300);
      return () => { clearTimeout(t); stopSpeaking(); };
    }
  }, []);
  return (
    <div className="w-full max-w-md mx-auto card-leaf p-5 text-center animate-pop">
      <div className="type-meta text-forest-600 mb-2">📖 正确答案</div>
      <div className="font-display font-extrabold text-2xl md:text-3xl text-forest-800 mb-3 break-words">{answerText}</div>
      {speakText && (
        <button onClick={() => speakSequence(allSpeakTexts.length ? allSpeakTexts : [speakText])} className="btn-secondary tap inline-flex items-center gap-2 mb-3" aria-label="听答案发音">
          <span className="text-xl">🔊</span> 听一听
        </button>
      )}
      <div>
        <button onClick={onContinue} className="btn-primary-lg tap">继续下一题 →</button>
      </div>
    </div>
  );
}
