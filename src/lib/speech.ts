/* 浏览器原生 TTS（Web Speech API），零依赖零成本。
   英语关卡用来读出英文句子/单词，语文模块读出古诗词/成语。
   Safari / Chrome / iPad 均原生支持。 */

const voiceCache: Record<string, SpeechSynthesisVoice | null> = {};

function pickVoice(lang = 'en-US'): SpeechSynthesisVoice | null {
  if (voiceCache[lang] !== undefined) return voiceCache[lang];
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = lang.split('-')[0];
  voiceCache[lang] =
    voices.find((v) => v.lang === lang && /female|google|samantha|karen|tessa|moira|ting|mei|hui/i.test(v.name)) ||
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(langPrefix)) ||
    null;
  return voiceCache[lang];
}

// 部分浏览器（Safari）异步加载 voice 列表
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    Object.keys(voiceCache).forEach((k) => delete voiceCache[k]);
  };
}

/** 读出一段文字（默认英文 en-US，语速 0.8 适合儿童） */
export function speak(text: string, opts?: { lang?: string; rate?: number; pitch?: number }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts?.lang ?? 'en-US';
  u.rate = opts?.rate ?? 0.8;
  u.pitch = opts?.pitch ?? 1.1;
  const v = pickVoice(u.lang);
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

// 英文朗读语速（Web Speech API：1.0 = 正常，越小越慢）
const WORD_RATE = 0.8;          // 单词原速，保持不动
const SENTENCE_RATE = 0.8 * 0.9; // 句子 = 单词语速的 0.9 倍（0.72），即比单词更慢

/** 自动检测语言并朗读（中文用 zh-TW，英文用 en-US）。
 *  英文句子（含空格的多词，如 "I can run"）用较慢的 0.72 倍速；
 *  英文单词（无空格）保持原速 0.8 不变 —— 按家长要求句子放慢、单词不变。 */
export function speakAuto(text: string) {
  if (isChinese(text)) {
    speak(text, { lang: 'zh-TW', rate: 0.7, pitch: 1.0 });
  } else if (isEnglish(text)) {
    const isSentence = /\s/.test(text.trim());
    speak(text, { rate: isSentence ? SENTENCE_RATE : WORD_RATE });
  } else {
    speak(text);
  }
}

/** 停止当前朗读 */
export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 顺序朗读多段文字（用 onend 串接，避免 cancel 阻断）。
 * 适用于「看答案」面板：先逐个念出 4 个选项，再念正确答案。
 * 自动判别每段语种并用 speakAuto。
 * 传一个空数组等价于 stopSpeaking。
 */
export function speakSequence(texts: string[], gapMs = 220) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!texts.length) { stopSpeaking(); return; }
  stopSpeaking();
  // 用串行 setTimeout 替代 onend —— 某些浏览器 (Safari) 的 onend 偶发不触发
  const delayFor = (t: string) => {
    if (isChinese(t)) return 80 * Math.max(1, t.length) + gapMs;
    if (isEnglish(t)) return 120 * Math.max(1, t.length) + gapMs;
    return 80 * Math.max(1, t.length) + gapMs;
  };
  const queue = texts.slice();
  const play = () => {
    const cur = queue.shift();
    if (!cur) return;
    const u = new SpeechSynthesisUtterance(cur);
    // 同样走 speakAuto 的语速/音调策略
    if (isChinese(cur)) {
      u.lang = 'zh-TW'; u.rate = 0.7; u.pitch = 1.0;
    } else if (isEnglish(cur)) {
      const isSentence = /\s/.test(cur.trim());
      u.lang = 'en-US'; u.rate = isSentence ? SENTENCE_RATE : WORD_RATE; u.pitch = 1.1;
    } else {
      u.lang = 'en-US'; u.rate = 0.8; u.pitch = 1.0;
    }
    const v = pickVoice(u.lang);
    if (v) u.voice = v;
    u.onend = () => {
      if (queue.length) setTimeout(play, gapMs);
    };
    u.onerror = () => {
      if (queue.length) setTimeout(play, gapMs);
    };
    window.speechSynthesis.speak(u);
  };
  setTimeout(play, 80);
}

/** 检测浏览器是否支持 TTS */
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** 判断一段文字是否为英文（用于决定是否显示小喇叭按钮） */
export function isEnglish(text: string): boolean {
  return /^[a-zA-Z]/.test(text.trim());
}

/** 判断一段文字是否为中文（用于决定用中文语音朗读） */
export function isChinese(text: string): boolean {
  return /[\u4e00-\u9fff]/.test(text);
}

/** 判断一段文字是否可朗读（英文或中文） */
export function isSpeakable(text: string): boolean {
  return isEnglish(text) || isChinese(text);
}

/**
 * 把题目文字转成适合 TTS 朗读的口语文本。
 * 数学题里的 + − × ÷ = > < 直接交给语音引擎多半会被跳过或读错，
 * 这里统一换成中文说法。只在「数字 符号 数字」的上下文替换，
 * 避免误伤英文里的连字符（well-known）等。
 */
export function toSpokenText(text: string): string {
  let s = text;
  // 「= ?」「= ？」→ 等于几
  s = s.replace(/[=＝]\s*[?？]/g, ' 等于几 ');
  // 数字之间的运算符
  s = s.replace(/(\d)\s*[+＋]\s*(\d)/g, '$1 加 $2');
  s = s.replace(/(\d)\s*[-−–]\s*(\d)/g, '$1 减 $2');
  s = s.replace(/(\d)\s*[×*✕]\s*(\d)/g, '$1 乘以 $2');
  s = s.replace(/(\d)\s*[÷]\s*(\d)/g, '$1 除以 $2');
  s = s.replace(/(\d)\s*[=＝]\s*(\d)/g, '$1 等于 $2');
  s = s.replace(/(\d)\s*[>＞]\s*(\d)/g, '$1 大于 $2');
  s = s.replace(/(\d)\s*[<＜]\s*(\d)/g, '$1 小于 $2');
  // 填空下划线（多种长度：____ / _____ 等）—— 不交给 TTS，否则会被读成「底線/下划线」噪音
  s = s.replace(/_+/g, '');
  // 填空圈
  s = s.replace(/[○〇◯□]/g, ' 圈 ');
  // 压缩多余空格
  return s.replace(/\s{2,}/g, ' ').trim();
}
