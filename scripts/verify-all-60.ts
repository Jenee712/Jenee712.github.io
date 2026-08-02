import { getDayPlan } from '@/data/plan60';

let miss = 0;
for (let d = 1; d <= 60; d++) {
  const t = getDayPlan(d, []);
  const eng = t.filter((x) => x.subject === 'english');
  if (eng.length !== 2) {
    console.log(`day ${d}: ${eng.length} 个英语模块 ❌`);
    miss++;
  }
}
console.log(miss === 0 ? '全部 60 天都是 2 个英语模块 ✅' : `${miss} 天异常`);

console.log('\n=== 抽样:每个英语段 1 天 ===');
[1, 8, 15, 22, 29, 36, 43, 50, 57].forEach((d) => {
  const t = getDayPlan(d, []);
  const eng = t.filter((x) => x.subject === 'english');
  console.log(`day ${d}: ${eng.map((e) => e.title).join(' + ')}`);
});
