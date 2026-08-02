import type { LessonResultSummary, AnimalSticker } from '@/types';
import { AnimatedStickerPreview } from '@/components/stickers/AnimatedStickerPreview';
import { RewardSummary } from '@/components/ui/RewardSummary';
import { ContinueLearningButton } from '@/components/ui/ContinueLearningButton';

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-2 py-2">
      <div className="text-[11px] text-forest-500">{label}</div>
      <div className="font-display font-bold text-forest-800 text-sm leading-tight">{value}</div>
    </div>
  );
}

interface Props {
  result: LessonResultSummary;
  sticker?: AnimalSticker;
  onNext: () => void;
  onHome: () => void;
}

/** 关卡结算页内容。每次结算只显示一张主贴纸（规格【十三】）。 */
export function LessonResult({ result, sticker, onNext, onHome }: Props) {
  const acc = result.total ? Math.round((result.correct / result.total) * 100) : 100;
  const title =
    acc >= 100 ? '今天的森林任务完成啦！'
    : acc >= 60 ? '已经找到方法啦，真棒！'
    : '再试一次，你会更厉害！';

  return (
    <div className="mx-auto max-w-md text-center space-y-4">
      <div className="card-barn p-6 animate-pop">
        <div className="text-5xl" aria-hidden>🌟</div>
        <h2 className="type-h2 mt-2">{title}</h2>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Stat label="学习时间" value={`${result.minutes} 分`} />
          <Stat label="正确率" value={`${acc}%`} />
          <Stat label="新掌握" value={result.newKnowledge ?? '继续加油'} />
        </div>
        <div className="mt-4"><RewardSummary coins={result.coins} steps={result.steps} stickerTitle={sticker?.title} /></div>

        {sticker && (
          <div className="mt-4">
            <p className="text-sm text-forest-500">新朋友加入贴纸册</p>
            <div className="grid place-items-center my-2">
              <AnimatedStickerPreview sticker={sticker} size={160} />
            </div>
            <p className="font-display font-bold text-forest-800">{sticker.title} · {sticker.emotion}</p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <button type="button" onClick={onHome} className="btn-secondary tap">回到首页</button>
        <ContinueLearningButton label="下一关" onClick={onNext} />
      </div>
    </div>
  );
}
