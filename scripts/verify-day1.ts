import { getDayPlan, getDayDef, dayOfSummer, PLAN_TOTAL_DAYS } from '@/data/plan60';
import { englishBank } from '@/data/englishBank';

console.log('今日(2026-08-01) 是暑期第', dayOfSummer(), '天 / 共', PLAN_TOTAL_DAYS, '天');
console.log('\n========== 第一天(2026-07-01) 今日飞行计划 ==========');
const d1 = getDayPlan(1);
d1.forEach((t, i) =>
  console.log(
    `${String(i + 1).padStart(2, '0')}. [${t.subject.padEnd(8)}] ${t.title}\n    └ 细节: ${t.detail} · ${t.durationMin} 分钟 · lessonId=${t.lessonId}`,
  ),
);

const def = getDayDef(1);
console.log('\n第 1 天主题:', def.theme);
console.log('数学课 ID:', def.mathIds.join(', '));
console.log('语文课 ID:', def.chineseId);
console.log('英语课 ID:', def.englishId);

const sh = englishBank.find((l) => l.id === 'eng-ph-sh');
console.log('\n========== 逐题详解：「英语 · 拼讀 · sh 音」==========');
if (sh) {
  console.log('课程 id:', sh.id, '| 类型:', sh.kind, '| 预计时长:', sh.durationMin, '分钟');
  sh.steps.forEach((s, i) => {
    console.log(`\n  第 ${i + 1} 关 · 互动形式 [${s.ui}]`);
    console.log(`    题目: ${s.prompt}`);
    console.log(`    答案: ${JSON.stringify(s.answer)}`);
    if (s.choices) console.log(`    选项: ${JSON.stringify(s.choices)}`);
    if (s.hint) console.log(`    提示: ${s.hint}`);
  });
}

console.log('\n========== 验证：前 7 天英语是否逐天不同 ==========');
for (let d = 1; d <= 7; d++) {
  const e = getDayPlan(d).find((t) => t.subject === 'english');
  console.log(`  第 ${d} 天英语: ${e?.title}  (lessonId=${e?.lessonId})`);
}
