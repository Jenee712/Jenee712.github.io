import { getDayPlan } from '@/data/plan60';

for (const d of [1, 2, 8, 15, 29, 35, 50, 60]) {
  const tasks = getDayPlan(d);
  const math = tasks.filter((t) => t.subject === 'math' && t.kind === 'normal');
  console.log(`Day ${d}: math tasks = ${math.length}`);
  math.forEach((t) => console.log(`   - ${t.title}  (lessonId=${t.lessonId})`));
}
