type ModeBarProps = {
  isShuffled: boolean
  onToggleShuffle: () => void
  direction: 'nl-en' | 'en-nl'
  onToggleDirection: () => void
}

export function ModeBar({ isShuffled, onToggleShuffle, direction, onToggleDirection }: ModeBarProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onToggleShuffle}
        aria-pressed={isShuffled}
        aria-label={isShuffled ? 'Random order, tap to switch to normal order' : 'Normal order, tap to switch to random order'}
        className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-bold transition ${
          isShuffled ? 'bg-accent-light text-accent-dark' : 'bg-track text-muted'
        }`}
      >
        <span aria-hidden="true">{isShuffled ? '🔀' : '🔢'}</span>
        {isShuffled ? 'Random' : 'In order'}
      </button>

      <button
        type="button"
        onClick={onToggleDirection}
        aria-label={
          direction === 'nl-en' ? 'Dutch to English, tap to switch to English to Dutch' : 'English to Dutch, tap to switch to Dutch to English'
        }
        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-track text-sm font-bold text-muted transition"
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
