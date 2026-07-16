type ControlsProps = {
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
}

export function Controls({ onPrev, onNext, hasPrev }: ControlsProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous card"
        className="h-14 flex-1 rounded-2xl border-2 border-track bg-white text-lg font-extrabold text-muted transition active:translate-y-0.5 disabled:opacity-40"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next card"
        className="h-14 flex-[2] rounded-2xl bg-primary text-lg font-extrabold text-white shadow-[0_4px_0_0_var(--color-primary-dark)] transition active:translate-y-1 active:shadow-[0_0px_0_0_var(--color-primary-dark)]"
      >
        Next
      </button>
    </div>
  )
}
