/**
 * 采集全站「会被朗读」的文本，供 scripts/gen-audio.mjs 用百度 TTS 预生成 MP3。
 * 直接用 esbuild 打包本文件（解析 @/types 等），在 Node 里跑出字符串清单。
 * 这里只做数据采集，不依赖浏览器。
 */
import { englishBank } from '../src/data/englishBank';
import { pictureBooks } from '../src/data/pictureBooks';

const set = new Set<string>();

function add(s?: string) {
  if (!s) return;
  s = s.trim();
  if (s.length === 0) return;
  set.add(s);
}

function addWords(sentence: string) {
  // 把英文句子拆成单词，单独生成立项（跟读/点词按钮会逐个念）
  for (const w of sentence.split(/\s+/)) {
    const clean = w.replace(/[.,!?;:()"'_-]/g, '').trim();
    if (clean && /^[a-zA-Z]+$/.test(clean)) add(clean);
  }
}

function isChinese(s: string) {
  return /[一-鿿]/.test(s);
}
function isEnglish(s: string) {
  return /[a-zA-Z]/.test(s) && !isChinese(s);
}

for (const lesson of englishBank) {
  for (const step of lesson.steps) {
    const ans = Array.isArray(step.answer) ? step.answer.join('') : String(step.answer ?? '');
    add(ans);
    if (Array.isArray(step.choices)) step.choices.forEach((c) => add(c));
    if (Array.isArray(step.choicesCn)) step.choicesCn.forEach((c) => { if (c && isChinese(c)) add(c); });

    const prompt = String(step.prompt ?? '');
    // 引号里的英文短语（如 "cat"、"I can run"）会被单独的喇叭按钮朗读
    const quoted = prompt.match(/"([^"]+)"/g) || [];
    for (const q of quoted) {
      const p = q.slice(1, -1).trim();
      if (isEnglish(p)) add(p);
    }
    // 纯英文题面（如填空挖空后的整句）也会被朗读
    if (prompt && isEnglish(prompt)) add(prompt.replace(/_+/g, ' ').trim());
    // 英文句子里的每个单词
    if (isEnglish(ans) && /\s/.test(ans)) addWords(ans);
    if (Array.isArray(step.choices)) {
      for (const c of step.choices) if (isEnglish(c) && /\s/.test(c)) addWords(c);
    }
  }
}

for (const book of pictureBooks) {
  for (const page of book.pages) {
    add(page.en);
    if (page.cn) add(page.cn);
    addWords(page.en);
  }
}

// 稳定排序，方便 diff
export const spokenStrings: string[] = [...set].sort();
