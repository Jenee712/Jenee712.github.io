// 七级难度定义：Level 1–7。
// 难度逐级提升，不再绑定实际年级，孩子可按能力自由选择。

export type GradeKey = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';

export interface GradeDef {
  key: GradeKey;
  label: string;        // 小一
  fullLabel: string;    // 小一 (G1)
  ageRange: string;     // 6–7 岁
  tagline: string;      // 一句话定位（标准版内核科目）
  emoji: string;
}

export const GRADES: GradeDef[] = [
  { key: 'L1', label: '第 1 级', fullLabel: '第 1 级 · Level 1', ageRange: '难度 ★☆☆☆☆', tagline: 'ABC 字母启蒙 + 认字卡、数数、唱游', emoji: '🌱' },
  { key: 'L2', label: '第 2 级', fullLabel: '第 2 级 · Level 2', ageRange: '难度 ★★☆☆☆', tagline: '英语拼读 + 10 以内加减', emoji: '🌿' },
  { key: 'L3', label: '第 3 级', fullLabel: '第 3 级 · Level 3', ageRange: '难度 ★★★☆☆', tagline: '100 以内进退位 + 简单句型', emoji: '🍃' },
  { key: 'L4', label: '第 4 级', fullLabel: '第 4 级 · Level 4', ageRange: '难度 ★★★★☆', tagline: '乘除法 + 阅读与口语表达', emoji: '🌳' },
  { key: 'L5', label: '第 5 级', fullLabel: '第 5 级 · Level 5', ageRange: '难度 ★★★★☆', tagline: '分数小数 + 应用题', emoji: '🌲' },
  { key: 'L6', label: '第 6 级', fullLabel: '第 6 级 · Level 6', ageRange: '难度 ★★★★★', tagline: '面积体积 + 段落写作', emoji: '🌴' },
  { key: 'L7', label: '第 7 级', fullLabel: '第 7 级 · Level 7', ageRange: '难度 ★★★★★', tagline: '比例几何 + 自主阅读', emoji: '🏔️' },
];

export const DEFAULT_GRADE: GradeKey = 'L1';

export function gradeDef(key: GradeKey): GradeDef {
  return GRADES.find((g) => g.key === key) ?? GRADES[0];
}

export function isGradeKey(v: string): v is GradeKey {
  return GRADES.some((g) => g.key === v);
}
