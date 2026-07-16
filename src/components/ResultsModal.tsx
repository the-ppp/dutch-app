type ResultsModalProps = {
  correctCount: number
  wrongCount: number
  onRepeat: () => void
  onNewCards: () => void
}

const RING_SIZE = 140
const RING_STROKE = 14
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

export function ResultsModal({ correctCount, wrongCount, onRepeat, onNewCards }: ResultsModalProps) {
  const judged = correctCount + wrongCount
  const pct = judged === 0 ? 0 : Math.round((correctCount / judged) * 100)
  const dashOffset = RING_CIRCUMFERENCE * (1 - pct / 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-title"
        className="relative w-full max-w-xs rounded-3xl bg-white p-6 shadow-xl"
      >
        <h2 id="results-title" className="text-center text-xl font-extrabold text-ink">
          Nice work! 🎉
        </h2>

        <div className="relative mx-auto mt-6 h-[140px] w-[140px]">
          <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden="true">
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              strokeWidth={RING_STROKE}
              className="fill-none stroke-track"
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
              className="fill-none stroke-primary"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-extrabold tabular-nums text-primary">{pct}%</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <span className="flex items-center gap-1.5 text-lg font-extrabold text-primary">
            <span aria-hidden="true">✓</span>
            <span className="tabular-nums">{correctCount}</span>
          </span>
          <span className="flex items-center gap-1.5 text-lg font-extrabold text-danger">
            <span aria-hidden="true">✕</span>
            <span className="tabular-nums">{wrongCount}</span>
          </span>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onRepeat}
            className="h-14 flex-1 rounded-2xl border-2 border-track bg-white text-base font-extrabold text-ink transition active:translate-y-0.5"
          >
            Repeat cards
          </button>
          <button
            type="button"
            onClick={onNewCards}
            className="h-14 flex-1 rounded-2xl bg-primary text-base font-extrabold text-white shadow-[0_4px_0_0_var(--color-primary-dark)] transition active:translate-y-1 active:shadow-[0_0px_0_0_var(--color-primary-dark)]"
          >
            New cards
          </button>
        </div>
      </div>
    </div>
  )
}
