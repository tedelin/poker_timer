'use client'

import { Cog, Pause, Play, SkipForward, TimerReset } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LevelsArray } from '../app/types/levels'
import FullScreenBtn from './fullscreen'
import TimerProgressBar from './ProgressBar'
import { Button } from './ui/button'

function FormatTime({ time }: { time: number }) {
  const minutes = Math.floor((time / 1000 / 60) % 60)
  const seconds = Math.floor((time / 1000) % 60)

  return (
    <div className="mb-8 font-mono text-[20vmin] font-bold tabular-nums leading-none">
      {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
    </div>
  )
}

export default function Timer({
  levels,
  setIsReady,
}: {
  levels: LevelsArray
  setIsReady: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(
    (levels[0]?.duration || 0) * 60 * 1000
  )
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(timer)
            handleNextLevel()
            return 0
          }
          return prevTime - 1000
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [isRunning, timeRemaining])

  function handleStartPause() {
    setIsRunning((prev) => !prev)
  }

  function handleNextLevel() {
    if (currentLevelIndex < levels.length - 1) {
      const nextIndex = currentLevelIndex + 1
      setCurrentLevelIndex(nextIndex)
      setTimeRemaining(levels[nextIndex].duration * 60 * 1000)
      setIsRunning(true)
    } else {
      setIsRunning(false)
      alert('Tournament Ended!')
    }
  }

  function handleReset() {
    setIsRunning(false)
    setTimeRemaining((currentLevel?.duration || 0) * 60 * 1000)
  }

  const currentLevel = levels[currentLevelIndex]
  const nextLevel = levels[currentLevelIndex + 1]

  return (
    <div className="flex flex-grow flex-col items-center justify-center bg-zinc-900 px-4 text-white">
      <h2 className="mb-2 text-7xl font-bold">
        {currentLevel?.break ? 'Break' : `Level ${currentLevel?.id}`}
      </h2>
      <p className="mb-8 text-xl">
        {currentLevel?.bb &&
          `Blinds: ${currentLevel?.sb} / ${currentLevel?.bb}`}
      </p>

      <FormatTime time={timeRemaining} />
      <TimerProgressBar
        duration={currentLevel.duration}
        isRunning={isRunning}
        onTimeUp={() => alert("Time's up!")}
      />
      <div className="mb-8 text-lg">
        {nextLevel?.bb
          ? `Next: ${nextLevel?.sb} / ${nextLevel?.bb}`
          : 'Next: Break'}
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-4">
        <Button variant="ghost" onClick={handleStartPause}>
          {isRunning ? (
            <>
              <Pause />
              Pause
            </>
          ) : (
            <>
              <Play />
              Play
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={handleNextLevel}>
          <SkipForward />
          Next Level
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          <TimerReset />
          Reset
        </Button>
        <FullScreenBtn />
        <Button onClick={() => setIsReady(false)} variant="ghost">
          <Cog />
          Settings
        </Button>
      </div>
    </div>
  )
}
