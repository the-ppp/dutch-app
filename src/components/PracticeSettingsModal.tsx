import { useEffect, useRef, useState } from 'react'

type PracticeSettingsModalProps = {
  totalWords: number
  currentSize: number
  onConfirm: (size: number) => void
  onClose: () => void
}

const MIN_SIZE = 10
const STEP = 10

export function PracticeSettingsModal({ totalWords, currentSize, onConfirm, onClose }: PracticeSettingsModalProps) {
  const maxSize = Math.max(MIN_SIZE, Math.floor(totalWords / STEP) * STEP)
  const [size, setSize] = useState(() => Math.min(currentSize, maxSize))
  const rangeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    rangeRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="practice-settings-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xs rounded-3xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-xl text-muted"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <h2 id="practice-settings-title" className="pr-8 text-lg font-extrabold text-ink">
          I just want to practice <span className="text-primary">{size}</span> words
        </h2>

        <input
          ref={rangeRef}
          type="range"
          min={MIN_SIZE}
          max={maxSize}
          step={STEP}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="mt-6 w-full"
          aria-label="Number of words to practice"
        />

        <button
          type="button"
          onClick={() => onConfirm(size)}
          className="mt-6 h-14 w-full rounded-2xl bg-primary text-lg font-extrabold text-white shadow-[0_4px_0_0_var(--color-primary-dark)] transition active:translate-y-1 active:shadow-[0_0px_0_0_var(--color-primary-dark)]"
        >
          Let's go
        </button>
      </div>
    </div>
  )
}
