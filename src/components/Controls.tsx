type ControlsProps = {
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
  onMarkWrong: () => void
  onMarkCorrect: () => void
  wrongCount: number
  correctCount: number
  currentMark: 'correct' | 'wrong' | null
}

export function Controls({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onMarkWrong,
  onMarkCorrect,
  wrongCount,
  correctCount,
  currentMark,
}: ControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous card"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-track bg-white text-xl font-extrabold text-muted transition active:translate-y-0.5 disabled:opacity-40"
      >
        <span aria-hidden="true">←</span>
      </button>

      <button
        type="button"
        onClick={onMarkWrong}
        aria-label={`Mark wrong. ${wrongCount} wrong so far.`}
        className={`flex h-14 flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 text-base font-extrabold transition active:translate-y-0.5 ${
          currentMark === 'wrong' ? 'border-danger bg-danger-light text-danger' : 'border-track bg-white text-muted'
        }`}
      >
        <span aria-hidden="true">✕</span>
        <span className="tabular-nums">{wrongCount}</span>
      </button>

      <button
        type="button"
        onClick={onMarkCorrect}
        aria-label={`Mark correct. ${correctCount} correct so far.`}
        className={`flex h-14 flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 text-base font-extrabold transition active:translate-y-0.5 ${
          currentMark === 'correct' ? 'border-primary bg-primary-light text-primary' : 'border-track bg-white text-muted'
        }`}
      >
        <span className="tabular-nums">{correctCount}</span>
        <span aria-hidden="true">✓</span>
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next card"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-white text-xl font-extrabold text-accent transition active:translate-y-0.5 disabled:opacity-40"
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
