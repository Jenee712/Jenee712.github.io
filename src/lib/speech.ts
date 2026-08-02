/* 语音播放层。
 *
 * 策略（按家长要求：要地道、年轻的女声）：
 *   1) 优先播放「预生成的百度 TTS MP3」（src/lib/audioMap.json 映射），
 *      声音自然、稳定，且密钥不进浏览器。
 *   2) 映射里没有的文本（如动态生成的数学题面），退回浏览器原生 Web Speech API。
 *
 * 浏览器原生 TTS 仍用于古诗词/成语、动态中文题面等未预生成的内容。 */

import audioMap from './audioMap.json';

// 文本 -> /audio/<hash>.mp3
const AUDIO: Record<string, string> = audioMap as Record<string, string>;

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

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    Object.keys(voiceCache).forEach((k) => delete voiceCache[k]);
  };
}

// ---- HTMLAudio 播放（预生成 MP3）----
let currentAudio: HTMLAudioElement | null = null;
function stopAudio() {
  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.src = ''; } catch {}
    currentAudio = null;
  }
}
function playFile(url: string): Promise<void> {
  return new Promise((resolve) => {
    const a = new Audio(url);
    currentAudio = a;
    let done = false;
    const finish = () => { if (done) return; done = true; if (currentAudio === a) currentAudio = null; resolve(); };
    a.onended = finish;
    a.onerror = finish;
    a.play().catch(() => finish());
    // 安全兜底：最长 12s 强制结束
    setTimeout(finish, 12000);
  });
}

// ---- 浏览器原生 TTS（兜底）----
function webSpeak(text: string, opts?: { lang?: string; rate?: number; pitch?: number }): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = opts?.lang ?? 'en-US';
    u.rate = opts?.rate ?? 0.8;
    u.pitch = opts?.pitch ?? 1.1;
    const v = pickVoice(u.lang);
    if (v) u.voice = v;
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    u.onend = finish;
    u.onerror = finish;
    window.speechSynthesis.speak(u);
    setTimeout(finish, 1000 + text.length * 120);
  });
}

// 单段文本的统一播放：有 MP3 用 MP3，否则浏览器原生。
// opts 里带自定义 lang/rate/pitch 时（如「慢慢听」按钮）走浏览器原生，以保留调速能力。
function playText(text: string, opts?: { lang?: string; rate?: number; pitch?: number }): Promise<void> {
  const key = text.trim();
  if (!opts && AUDIO[key]) {
    stopAudio();
    return playFile(AUDIO[key]);
  }
  if (opts) {
    // 明确指定了语种/语速/音调：直接用浏览器原生
    let lang = opts.lang;
    let rate = opts.rate;
    let pitch = opts.pitch;
    if (lang === undefined) {
      if (isChinese(text)) lang = 'zh-TW';
      else lang = 'en-US';
    }
    if (rate === undefined) rate = isChinese(text) ? 0.7 : 0.8;
    if (pitch === undefined) pitch = 1.1;
    return webSpeak(text, { lang, rate, pitch });
  }
  // 无 opts 且没预生成音频：自动判别语种用浏览器原生
  if (isChinese(text)) return webSpeak(text, { lang: 'zh-TW', rate: 0.7, pitch: 1.0 });
  if (isEnglish(text)) {
    const isSentence = /\s/.test(text.trim());
    return webSpeak(text, { rate: isSentence ? SENTENCE_RATE : WORD_RATE, pitch: 1.1 });
  }
  return webSpeak(text);
}

const WORD_RATE = 0.8;
const SENTENCE_RATE = 0.8 * 0.9;

/** 读出一段文字（默认英文 en-US，语速 0.8 适合儿童） */
export function speak(text: string, opts?: { lang?: string; rate?: number; pitch?: number }) {
  playText(text, opts);
}

/** 自动检测语言并朗读（中文用 zh-TW，英文用 en-US）。优先用预生成 MP3。 */
export function speakAuto(text: string) {
  playText(text);
}

/** 停止当前朗读（MP3 与浏览器原生都停） */
export function stopSpeaking() {
  stopAudio();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * 顺序朗读多段文字（串行播放，靠上一段 ended 串接）。
 * 适用于「看答案」面板：先逐个念出 4 个选项，每个选项「英文 + 中文」成对。
 * 每段优先用预生成 MP3，没有则退回浏览器原生。
 */
export async function speakSequence(texts: string[], gapMs = 220) {
  if (typeof window === 'undefined') return;
  if (!texts.length) { stopSpeaking(); return; }
  stopSpeaking();
  await new Promise((r) => setTimeout(r, 80));
  for (const t of texts) {
    await playText(t);
    await new Promise((r) => setTimeout(r, gapMs));
  }
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
  return /[一-鿿]/.test(text);
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
  s = s.replace(/[=＝]\s*[?？]/g, ' 等于几 ');
  s = s.replace(/(\d)\s*[+＋]\s*(\d)/g, '$1 加 $2');
  s = s.replace(/(\d)\s*[-−–]\s*(\d)/g, '$1 减 $2');
  s = s.replace(/(\d)\s*[×*✕]\s*(\d)/g, '$1 乘以 $2');
  s = s.replace(/(\d)\s*[÷]\s*(\d)/g, '$1 除以 $2');
  s = s.replace(/(\d)\s*[=＝]\s*(\d)/g, '$1 等于 $2');
  s = s.replace(/(\d)\s*[>＞]\s*(\d)/g, '$1 大于 $2');
  s = s.replace(/(\d)\s*[<＜]\s*(\d)/g, '$1 小于 $2');
  s = s.replace(/_+/g, '');
  s = s.replace(/[○〇◯□]/g, ' 圈 ');
  return s.replace(/\s{2,}/g, ' ').trim();
}
