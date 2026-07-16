import { useEffect, useRef, useState } from 'react'
import words from './data/words.json'
import { FlashCard } from './components/FlashCard'
import { ProgressBar } from './components/ProgressBar'
import { Controls } from './components/Controls'

function shuffledIndices(length: number) {
  const arr = Array.from({ length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const SWIPE_THRESHOLD = 60

function App() {
  const [order, setOrder] = useState<number[]>(() => words.map((_, i) => i))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)

  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const justSwiped = useRef(false)

  const wordIndex = order[pos]
  const card = words[wordIndex]

  function goNext() {
    setFlipped(false)
    setPos((p) => (p + 1 >= order.length ? 0 : p + 1))
  }

  function goPrev() {
    setFlipped(false)
    setPos((p) => Math.max(0, p - 1))
  }

  function toggleShuffle() {
    setIsShuffled((s) => {
      const next = !s
      setOrder(next ? shuffledIndices(words.length) : words.map((_, i) => i))
      setPos(0)
      setFlipped(false)
      return next
    })
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null

    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      justSwiped.current = true
      if (dx < 0) goNext()
      else goPrev()
      setTimeout(() => {
        justSwiped.current = false
      }, 50)
    }
  }

  function handleFlip() {
    if (justSwiped.current) return
    setFlipped((f) => !f)
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5">
      <header
        className="flex items-center gap-3 pt-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <ProgressBar current={pos} total={order.length} />
        <button
          type="button"
          onClick={toggleShuffle}
          aria-pressed={isShuffled}
          aria-label={isShuffled ? 'Shuffle on, tap to turn off' : 'Shuffle off, tap to turn on'}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl transition ${
            isShuffled ? 'bg-accent-light text-accent-dark' : 'bg-track text-muted'
          }`}
        >
          🔀
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center py-6">
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="flex w-full justify-center">
          <FlashCard dutch={card.dutch} english={card.english} flipped={flipped} onFlip={handleFlip} />
        </div>
      </main>

      <footer className="pb-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <Controls onPrev={goPrev} onNext={goNext} hasPrev={pos > 0} />
      </footer>
    </div>
  )
}

export default App
