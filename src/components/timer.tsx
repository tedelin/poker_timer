'use client'

import React, { useState, useEffect } from 'react'
import { LevelsArray } from '../app/types/levels'
import { Button } from './ui/button'
import { Pause, Play, SkipForward, TimerReset } from 'lucide-react'
import FullScreenBtn from './fullscreen'

function FormatTime({ time }: { time: number }) {
  const minutes = Math.floor((time / 1000 / 60) % 60)
  const seconds = Math.floor((time / 1000) % 60)

  return (
    <div className="gap-4 text-9xl">
      {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </div>
  )
}

export default function Timer({ levels }: { levels: LevelsArray }) {
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
    setCurrentLevelIndex(0)
    setTimeRemaining((levels[0]?.duration || 0) * 60 * 1000)
  }

  const currentLevel = levels[currentLevelIndex]
  const nextLevel = levels[currentLevelIndex + 1]

  return (
    <div className="flex grow flex-col items-center gap-4 bg-gray-900 text-white">
      <div className="text-5xl font-bold">
        Level {currentLevel?.id || 'N/A'}
      </div>
      <div>
        Blinds: {currentLevel?.sb}/{currentLevel?.bb}
      </div>

      <FormatTime time={timeRemaining} />
      {nextLevel && (
        <div className="gap-4">
          Next: {nextLevel?.sb}/{nextLevel?.bb}
        </div>
      )}
      <div className="flex flex-row gap-4">
        <Button onClick={handleStartPause}>
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
        <Button onClick={handleNextLevel}>
          <SkipForward />
          Next Level
        </Button>
        <Button onClick={handleReset}>
          <TimerReset />
          Reset
        </Button>
        <FullScreenBtn />
      </div>
    </div>
  )
}
