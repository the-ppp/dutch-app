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
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-track bg-white text-xl font-extrabold text-muted shadow-[0_3px_0_0_var(--color-track)] transition active:translate-y-[3px] active:shadow-[0_0px_0_0_var(--color-track)] disabled:opacity-40"
      >
        <span aria-hidden="true">←</span>
      </button>

      <button
        type="button"
        onClick={onMarkWrong}
        aria-label={`Mark wrong. ${wrongCount} wrong so far.`}
        className={`flex h-14 flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-danger text-base font-extrabold text-danger transition ${
          currentMark === 'wrong' ? 'bg-danger-light' : 'bg-white'
        } ${currentMark === 'correct' ? 'translate-y-[3px]' : 'shadow-[0_3px_0_0_var(--color-danger)]'}`}
      >
        <span aria-hidden="true">✕</span>
        <span className="tabular-nums">{wrongCount}</span>
      </button>

      <button
        type="button"
        onClick={onMarkCorrect}
        aria-label={`Mark correct. ${correctCount} correct so far.`}
        className={`flex h-14 flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-primary text-base font-extrabold text-primary transition ${
          currentMark === 'correct' ? 'bg-primary-light' : 'bg-white'
        } ${currentMark === 'wrong' ? 'translate-y-[3px]' : 'shadow-[0_3px_0_0_var(--color-primary)]'}`}
      >
        <span className="tabular-nums">{correctCount}</span>
        <span aria-hidden="true">✓</span>
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next card"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-accent bg-white text-xl font-extrabold text-accent shadow-[0_3px_0_0_var(--color-accent)] transition active:translate-y-[3px] active:shadow-[0_0px_0_0_var(--color-accent)] disabled:opacity-40"
      >
        <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
