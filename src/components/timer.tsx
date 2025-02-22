'use client'

import React, { useState, useEffect } from 'react'
import { LevelsArray } from '../app/types/levels'

function FormatTime({ time }: { time: number }) {
  const minutes = Math.floor((time / 1000 / 60) % 60)
  const seconds = Math.floor((time / 1000) % 60)

  return (
    <div>
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

  return (
    <div>
      <h2>Level {currentLevel?.id || 'N/A'}</h2>
      <p>
        Blinds: {currentLevel?.sb}/{currentLevel?.bb}
      </p>
      <FormatTime time={timeRemaining} />
      <div>
        <button onClick={handleStartPause}>
          {isRunning ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleNextLevel}>Next Level</button>
      </div>
    </div>
  )
}
