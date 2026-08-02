import clsx from 'clsx';

interface Props {
  label: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

/** 每页 ONLY 一个最高强调按钮（森林深绿实心）。其余动作请使用次级样式。 */
export function ContinueLearningButton({ label, onClick, className, icon }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx('btn-primary-lg w-full sm:w-auto', className)}
    >
      {icon}
      <span>{label}</span>
      <span aria-hidden className="text-xl">→</span>
    </button>
  );
}
