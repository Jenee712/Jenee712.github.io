import type { ReactNode } from 'react';
import type { AvatarKey } from '@/types';
import { Mascot } from '@/components/characters/Mascot';

interface Props {
  mascot: AvatarKey;
  title: string;
  storyLine?: string;
  stepLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** 关卡舞台：左侧原创角色引导 + 故事线，右侧内容区。每个关卡只突出一个主操作（由 footer 控制）。 */
export function LearningStage({ mascot, title, storyLine, stepLabel, children, footer }: Props) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl">
      <div className="card-barn p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-3">
          <Mascot name={mascot} size={56} animated={false} />
          <div className="min-w-0">
            <h2 className="type-h3 truncate">{title}</h2>
            {storyLine && <p className="text-xs text-forest-500 truncate">📖 {storyLine}</p>}
          </div>
          {stepLabel && <span className="ml-auto pill shrink-0 !px-2 sm:!px-3">{stepLabel}</span>}
        </div>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-5 flex justify-end">{footer}</div>}
      </div>
    </div>
  );
}
