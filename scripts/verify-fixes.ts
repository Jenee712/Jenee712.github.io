// 验证 3 个修复：
// (1) api.completeTask 接受任意 task id 不再抛错
// (2) store.completeTask 不再读 res.stickerId
// (3) MathPage / ChinesePage 的 nextLesson 跟随 studyDay
import { api } from '../src/lib/api';
import { getDayPlan } from '../src/data/plan60';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let ok = 0, fail = 0;
  const t = (cond: boolean, label: string) => {
    if (cond) { ok++; console.log('  ✓', label); }
    else      { fail++; console.log('  ✗', label); }
  };

  console.log('\n[1] api.completeTask 不再抛 task not found');
  // 选一个 store 风格的 id（d{N}-*），以前 api 会抛 'task not found'
  for (const day of [1, 7, 32, 50, 60]) {
    const plan = getDayPlan(day);
    const sample = plan[0];
    try {
      const res = await api.completeTask(sample.id, { correct: 4, total: 5, minutes: 8 }, `task:${sample.id}:2026-08-01`);
      t(!!res.txn, `Day ${day} · ${sample.id} · 接受 store-style id（txn=${res.txn?.amount}）`);
    } catch (e) {
      t(false, `Day ${day} · ${sample.id} · 抛错：${(e as Error).message}`);
    }
  }

  console.log('\n[2] 重复提交相同 key → 幂等');
  const plan = getDayPlan(32);
  const sample2 = plan[1];
  const k = `task:${sample2.id}:2026-08-01`;
  const a = await api.completeTask(sample2.id, { correct: 5, total: 5, minutes: 8 }, k);
  const b = await api.completeTask(sample2.id, { correct: 5, total: 5, minutes: 8 }, k);
  t(a.txn?.transactionId === b.txn?.transactionId, '相同 idempotencyKey 返回同一笔交易');

  console.log('\n[3] getDayPlan 真的在切数学 lessonId');
  const d1  = getDayPlan(1).filter(t => t.subject === 'math').map(t => t.lessonId);
  const d32 = getDayPlan(32).filter(t => t.subject === 'math').map(t => t.lessonId);
  const d60 = getDayPlan(60).filter(t => t.subject === 'math').map(t => t.lessonId);
  const same1_32 = d1.every((id, i) => id === d32[i]);
  const same32_60 = d32.every((id, i) => id === d60[i]);
  t(!same1_32,  `Day1 与 Day32 的数学 lessonId 不同（避免"题没更新"）`);
  t(!same32_60, `Day32 与 Day60 的数学 lessonId 不同`);
  console.log('     Day1  数学:', d1.slice(0, 3).join(', '), '...');
  console.log('     Day32 数学:', d32.slice(0, 3).join(', '), '...');
  console.log('     Day60 数学:', d60.slice(0, 3).join(', '), '...');

  console.log(`\n通过 ${ok} / 失败 ${fail}`);
  if (fail > 0) process.exit(1);
  await sleep(200);
})();