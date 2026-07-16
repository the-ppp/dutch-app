import { useEffect, useRef, useState } from 'react'
import words from './data/words.json'
import { FlashCard } from './components/FlashCard'
import { ProgressBar } from './components/ProgressBar'
import { Controls } from './components/Controls'
import { ModeBar } from './components/ModeBar'
import { SettingsButton } from './components/SettingsButton'
import { PracticeSettingsModal } from './components/PracticeSettingsModal'
import { ResultsModal } from './components/ResultsModal'

type Direction = 'nl-en' | 'en-nl'
type Judgment = 'correct' | 'wrong'
type CardSnapshot = {
  front: string
  back: string
  frontLabel: string
  backLabel: string
  number: number
  flipped: boolean
}
type SlideTransition = { id: number; direction: 'forward' | 'backward'; outgoing: CardSnapshot } | null

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
  const [order, setOrder] = useState<number[]>(() => shuffledIndices(words.length))
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [slideTransition, setSlideTransition] = useState<SlideTransition>(null)
  const [direction, setDirection] = useState<Direction>('nl-en')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [results, setResults] = useState<(Judgment | null)[]>(() => Array(order.length).fill(null))
  const [showResults, setShowResults] = useState(false)

  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const justSwiped = useRef(false)
  const transitionIdRef = useRef(0)

  const wordIndex = order[pos]
  const card = words[wordIndex]

  const front = direction === 'nl-en' ? card.dutch : card.english
  const back = direction === 'nl-en' ? card.english : card.dutch
  const frontLabel = direction === 'nl-en' ? 'Dutch' : 'English'
  const backLabel = direction === 'nl-en' ? 'English' : 'Dutch'

  const correctCount = results.filter((r) => r === 'correct').length
  const wrongCount = results.filter((r) => r === 'wrong').length
  const answeredCount = results.filter((r) => r !== null).length
  const hasNext = pos < answeredCount
  const currentMark = results[pos]

  function beginSlide(dir: 'forward' | 'backward') {
    transitionIdRef.current += 1
    setSlideTransition({
      id: transitionIdRef.current,
      direction: dir,
      outgoing: { front, back, frontLabel, backLabel, number: pos + 1, flipped },
    })
  }

  function beginSession(newOrder: number[]) {
    setOrder(newOrder)
    setPos(0)
    setFlipped(false)
    setResults(Array(newOrder.length).fill(null))
    setShowResults(false)
  }

  function goNext() {
    if (pos >= answeredCount) return
    beginSlide('forward')
    setFlipped(false)
    setPos((p) => p + 1)
  }

  function goPrev() {
    beginSlide('backward')
    setFlipped(false)
    setPos((p) => Math.max(0, p - 1))
  }

  function toggleDirection() {
    setDirection((d) => (d === 'nl-en' ? 'en-nl' : 'nl-en'))
    setFlipped(false)
  }

  function mark(judgment: Judgment) {
    setResults((r) => {
      const next = [...r]
      next[pos] = judgment
      return next
    })
    setFlipped(false)
    beginSlide('forward')
    if (pos + 1 >= order.length) {
      setShowResults(true)
    } else {
      setPos((p) => p + 1)
    }
  }

  function markWrong() {
    mark('wrong')
  }

  function markCorrect() {
    mark('correct')
  }

  function startPractice(size: number) {
    beginSession(shuffledIndices(words.length).slice(0, size))
    setSettingsOpen(false)
  }

  function handleRepeat() {
    beginSession(order)
  }

  function handleNewCards() {
    beginSession(shuffledIndices(words.length).slice(0, order.length))
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (settingsOpen || showResults) return
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [settingsOpen, showResults, pos, order.length, results])

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
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <ProgressBar current={pos} total={order.length} />
      </div>

      <div className="flex flex-1 flex-col px-5">
        <div className="flex items-center justify-between pt-3">
          <ModeBar direction={direction} onToggleDirection={toggleDirection} />
          <SettingsButton onClick={() => setSettingsOpen(true)} />
        </div>

        <main className="flex flex-1 flex-col items-center justify-center py-6">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex w-full justify-center px-4 [overflow-x:clip]"
          >
            <div className="relative w-full max-w-sm aspect-[3/4]">
              {slideTransition && (
                <div
                  key={`out-${slideTransition.id}`}
                  className="absolute inset-0 pointer-events-none"
                  aria-hidden="true"
                  style={{
                    animation: `${
                      slideTransition.direction === 'forward' ? 'card-slide-out-left' : 'card-slide-out-right'
                    } 200ms ease-out forwards`,
                  }}
                >
                  <FlashCard {...slideTransition.outgoing} onFlip={() => {}} />
                </div>
              )}
              <div
                key={pos}
                className="absolute inset-0"
                style={
                  slideTransition
                    ? {
                        animation: `${
                          slideTransition.direction === 'forward' ? 'card-slide-in-from-right' : 'card-slide-in-from-left'
                        } 200ms ease-out forwards`,
                      }
                    : undefined
                }
                onAnimationEnd={() => setSlideTransition(null)}
              >
                <FlashCard
                  front={front}
                  back={back}
                  frontLabel={frontLabel}
                  backLabel={backLabel}
                  flipped={flipped}
                  onFlip={handleFlip}
                  number={pos + 1}
                />
              </div>
            </div>
          </div>
        </main>

        <footer className="pb-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <Controls
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={pos > 0}
            hasNext={hasNext}
            onMarkWrong={markWrong}
            onMarkCorrect={markCorrect}
            wrongCount={wrongCount}
            correctCount={correctCount}
            currentMark={currentMark}
          />
        </footer>
      </div>

      {settingsOpen && (
        <PracticeSettingsModal
          totalWords={words.length}
          currentSize={order.length}
          onConfirm={startPractice}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {showResults && (
        <ResultsModal correctCount={correctCount} wrongCount={wrongCount} onRepeat={handleRepeat} onNewCards={handleNewCards} />
      )}
    </div>
  )
}

export default App
