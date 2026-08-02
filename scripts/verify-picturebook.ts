import { getDayPlan } from '@/data/plan60';

function eng(day: number) {
  return getDayPlan(day).filter((t) => t.subject === 'english');
}

for (const d of [1, 7, 49, 50, 55, 60]) {
  const e = eng(d);
  console.log(`--- Day ${d} 英语任务 (${e.length}) ---`);
  e.forEach((t) => console.log(`  [${t.kind}] ${t.title}  |  ${t.detail}`));
}
