import { getDayPlan } from '@/data/plan60';
import { getMathLesson } from '@/data/curriculum';

for (const d of [1, 8, 29, 60]) {
  const tasks = getDayPlan(d);
  const mathIds = tasks.filter((t) => t.subject === 'math' && t.kind === 'normal').map((t) => t.lessonId!);
  const resolved = mathIds.map((id) => {
    const l = getMathLesson(id, 'normal');
    return { reqId: id, gotId: l.id, title: l.title, matched: id === l.id };
  });
  console.log(`Day ${d}:`);
  resolved.forEach((r) => console.log(`   req=${r.reqId} -> got=${r.gotId} "${r.title}" matched=${r.matched}`));
  const uniqueGot = new Set(resolved.map((r) => r.gotId));
  console.log(`   unique resolved lessons = ${uniqueGot.size}`);
}
