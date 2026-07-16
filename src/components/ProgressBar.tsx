type ProgressBarProps = {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : ((current + 1) / total) * 100
  // Fixed to fit the widest possible "current / total" (both at max digit count),
  // so the counter's width never changes and the bar next to it never resizes.
  const counterWidthCh = String(total).length * 2 + 3

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div
        className="h-3.5 flex-1 rounded-full bg-track overflow-hidden"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className="shrink-0 text-right text-sm font-bold tabular-nums text-muted"
        style={{ width: `${counterWidthCh}ch` }}
      >
        {current + 1} / {total}
      </span>
    </div>
  )
}
