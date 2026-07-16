type ModeBarProps = {
  direction: 'nl-en' | 'en-nl'
  onToggleDirection: () => void
}

export function ModeBar({ direction, onToggleDirection }: ModeBarProps) {
  return (
    <div className="flex justify-start">
      <button
        type="button"
        onClick={onToggleDirection}
        aria-label={
          direction === 'nl-en' ? 'Dutch to English, tap to switch to English to Dutch' : 'English to Dutch, tap to switch to Dutch to English'
        }
        className="flex h-8 items-center gap-1.5 rounded-full bg-track px-3 text-xs font-bold text-muted transition"
      >
        {direction === 'nl-en' ? (
          <>
            <span aria-hidden="true">🇳🇱</span>
            <span aria-hidden="true">→</span>
            <span aria-hidden="true">🇬🇧</span>
          </>
        ) : (
          <>
            <span aria-hidden="true">🇬🇧</span>
            <span aria-hidden="true">→</span>
            <span aria-hidden="true">🇳🇱</span>
          </>
        )}
      </button>
    </div>
  )
}
