// 七個年級的定義：幼兒園 K + 小一～小六 (G1–G6)
// 這是「7 套不同年級學習玩耍工作台」的頂層開關；內容（英文/數學）按 grade 切換。

export type GradeKey = 'K' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6';

export interface GradeDef {
  key: GradeKey;
  label: string;        // 小一
  fullLabel: string;    // 小一 (G1)
  ageRange: string;     // 6–7 歲
  tagline: string;      // 一句話定位（標準版核心科目）
  emoji: string;
}

export const GRADES: GradeDef[] = [
  { key: 'K',  label: '幼兒園', fullLabel: '幼兒園 K',    ageRange: '3–5 歲',   tagline: '玩中學：認字卡、數數、唱遊',         emoji: '🧸' },
  { key: 'G1', label: '小一',   fullLabel: '小一 (G1)',   ageRange: '6–7 歲',   tagline: '英語拼讀 + 10 以內加減',            emoji: '🌱' },
  { key: 'G2', label: '小二',   fullLabel: '小二 (G2)',   ageRange: '7–8 歲',   tagline: '100 以內進退位 + 簡單句型',         emoji: '🌿' },
  { key: 'G3', label: '小三',   fullLabel: '小三 (G3)',   ageRange: '8–9 歲',   tagline: '乘除法 + 閱讀與口語表達',           emoji: '🍃' },
  { key: 'G4', label: '小四',   fullLabel: '小四 (G4)',   ageRange: '9–10 歲',  tagline: '分數小數 + 應用題',                emoji: '🌳' },
  { key: 'G5', label: '小五',   fullLabel: '小五 (G5)',   ageRange: '10–11 歲', tagline: '面積體積 + 段落寫作',              emoji: '🌲' },
  { key: 'G6', label: '小六',   fullLabel: '小六 (G6)',   ageRange: '11–12 歲', tagline: '比例幾何 + 自主閱讀',              emoji: '🌴' },
];

export const DEFAULT_GRADE: GradeKey = 'G1';

export function gradeDef(key: GradeKey): GradeDef {
  return GRADES.find((g) => g.key === key) ?? GRADES[1];
}

export function isGradeKey(v: string): v is GradeKey {
  return GRADES.some((g) => g.key === v);
}
