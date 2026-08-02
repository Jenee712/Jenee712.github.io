import { getDayPlan } from '@/data/plan60';
import { getEnglishLesson } from '@/data/curriculum';

for (const d of [1, 3, 32, 55]) {
  const tasks = getDayPlan(d);
  const engIds = tasks.filter((t) => t.subject === 'english' && t.kind === 'normal').map((t) => t.lessonId!);
  const resolved = engIds.map((id) => {
    const l = getEnglishLesson(id, 'normal');
    return { reqId: id, gotId: l.id, matched: id === l.id };
  });
  const uniqueGot = new Set(resolved.map((r) => r.gotId));
  const matched = resolved.filter((r) => r.matched).length;
  console.log(`Day ${d}: eng tasks=${engIds.length}, matched=${matched}, uniqueResolved=${uniqueGot.size}`);
  resolved.slice(0, 2).forEach((r) => console.log(`   req=${r.reqId} -> got=${r.gotId} matched=${r.matched}`));
}
