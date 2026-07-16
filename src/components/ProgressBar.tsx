type ProgressBarProps = {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : ((current + 1) / total) * 100

  return (
    <div
      className="relative h-8 w-full overflow-hidden bg-muted"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      <div
        className="h-full bg-primary transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.25)]">
        {current + 1} / {total}
      </span>
    </div>
  )
}
