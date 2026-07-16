type FlashCardProps = {
  dutch: string
  english: string
  flipped: boolean
  onFlip: () => void
}

export function FlashCard({ dutch, english, flipped, onFlip }: FlashCardProps) {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-label={flipped ? `English: ${english}. Tap to show Dutch.` : `Dutch: ${dutch}. Tap to reveal English.`}
      className="relative w-full max-w-sm aspect-[3/4] [perspective:1200px] focus:outline-none"
    >
      <div
        className="relative h-full w-full rounded-3xl shadow-xl transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front: Dutch */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-white border border-track px-6 [backface-visibility:hidden]">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">Dutch</span>
          <span className="text-center text-4xl font-extrabold text-ink break-words">{dutch}</span>
          <span className="mt-4 text-xs font-semibold text-muted">Tap to reveal</span>
        </div>

        {/* Back: English */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-accent-light border border-accent/30 px-6 [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-accent-dark">English</span>
          <span className="text-center text-4xl font-extrabold text-ink break-words">{english}</span>
          <span className="mt-4 text-xs font-semibold text-accent-dark">Tap to flip back</span>
        </div>
      </div>
    </button>
  )
}
