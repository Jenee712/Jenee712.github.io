interface Props {
  coins?: number;
  steps?: number;
  stickerTitle?: string;
}

/** 结算页的奖励小结（金币 / 步数 / 贴纸）。 */
export function RewardSummary({ coins, steps, stickerTitle }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {coins != null && (
        <span className="pill pill-sun">🪙 +{coins} 金币</span>
      )}
      {steps != null && (
        <span className="pill">🌿 +{steps} 步</span>
      )}
      {stickerTitle && (
        <span className="pill">⭐ 新贴纸：{stickerTitle}</span>
      )}
    </div>
  );
}
