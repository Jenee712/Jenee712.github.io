import type { TodayTask } from '@/types';
import { LearningTaskCard } from './LearningTaskCard';

interface Props {
  tasks: TodayTask[];
  onStart: (t: TodayTask) => void;
}

/** 今日飞行计划：优先高亮下一个未完成的任务。 */
export function DailyTaskList({ tasks, onStart }: Props) {
  const nextId = tasks.find((t) => !t.done)?.id;
  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <LearningTaskCard key={t.id} task={t} isNext={t.id === nextId} onStart={onStart} />
      ))}
    </div>
  );
}
