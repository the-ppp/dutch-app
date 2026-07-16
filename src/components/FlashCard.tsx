type FlashCardProps = {
  front: string
  back: string
  frontLabel: string
  backLabel: string
  flipped: boolean
  onFlip: () => void
}

export function FlashCard({ front, back, frontLabel, backLabel, flipped, onFlip }: FlashCardProps) {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-label={
        flipped ? `${backLabel}: ${back}. Tap to show ${frontLabel}.` : `${frontLabel}: ${front}. Tap to reveal ${backLabel}.`
      }
      className="relative w-full max-w-sm aspect-[3/4] [perspective:1200px] focus:outline-none"
    >
      <div
        className="relative h-full w-full rounded-3xl shadow-xl transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-white border border-track px-6 [backface-visibility:hidden]">
          <span className="text-xs font-bold uppercase tracking-widest text-muted">{frontLabel}</span>
          <span className="text-center text-4xl font-extrabold text-ink break-words">{front}</span>
          <span className="mt-4 text-xs font-semibold text-muted">Tap to reveal</span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-accent-light border border-accent/30 px-6 [backface-visibility:hidden]"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-accent-dark">{backLabel}</span>
          <span className="text-center text-4xl font-extrabold text-ink break-words">{back}</span>
          <span className="mt-4 text-xs font-semibold text-accent-dark">Tap to flip back</span>
        </div>
      </div>
    </button>
  )
}
