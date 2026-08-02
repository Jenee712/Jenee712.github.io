import { Mascot } from '@/components/characters/Mascot';

export function NotFoundPage() {
  return (
    <section className="container-forest py-16 text-center">
      <Mascot name="deer" size={140} animated />
      <h1 className="type-h1 mt-6">这里暂时没有路</h1>
      <p className="type-body text-forest-600/80 mt-2">小鹿正在找另一条回家的路。</p>
      <a href="/" className="btn-primary mt-6">回到首页</a>
    </section>
  );
}
