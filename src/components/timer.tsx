'use client'

import FullScreenBtn from '@/components/FullscreenBtn'
import TimerProgressBar from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import { LevelsArray } from '@/types/levels'
import formatNumber from '@/utils/formatNumber'
import formatTime from '@/utils/formatTime'
import generateVoice from '@/utils/generateVoice'
import {
  Coffee,
  Cog,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  TimerReset,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import useSound from 'use-sound'
import { Input } from './ui/input'

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
  const [timeToBreak, setTimeToBreak] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [readySound] = useSound('/sounds/en/ready.mp3')
  const [startSound] = useSound('/sounds/en/start.mp3')
  const [nextLevelSound] = useSound('/sounds/en/warning.mp3')
  const [warningBreakSound] = useSound('/sounds/en/warning_break.mp3')
  const [beepSound] = useSound('/sounds/beep.mp3', { volume: 0.2 })
  const [breakSound] = useSound('/sounds/en/break.mp3')
  const shouldBlink = timeRemaining <= 5000
  const currentLevel = levels[currentLevelIndex]
  const nextLevel = levels[currentLevelIndex + 1]
  const [newBreak, setNewBreak] = useState(0)

  function handleStartPause() {
    if (currentLevelIndex == 0 && !isRunning) {
      startSound()
    }
    setIsRunning((prev) => !prev)
  }

  function handleLevelChange(change: number) {
    setCurrentLevelIndex((prevIndex) => {
      const nextIndex = prevIndex + change

      if (nextIndex >= levels.length || nextIndex < 0) {
        setIsRunning(false)
        return prevIndex
      }

      setTimeRemaining(levels[nextIndex].duration * 60 * 1000)
      setIsRunning(true)

      return nextIndex
    })
  }

  function handleReset() {
    setIsRunning(false)
    setTimeRemaining((currentLevel?.duration || 0) * 60 * 1000)
    updateTimeToBreak(currentLevelIndex)
  }

  function updateTimeToBreak(index: number) {
    if (levels[index].break) {
      setTimeToBreak(0)
      return
    }
    let totalTime = 0
    for (let i = index; i < levels.length; i++) {
      if (levels[i].break) break
      totalTime += levels[i].duration
    }
    totalTime = totalTime * 60 * 1000
    setTimeToBreak(totalTime)
  }

  function addBreak() {
    levels.splice(currentLevelIndex + 1, 0, {
      id: levels.length + 1,
      duration: newBreak,
      break: true,
    })
    updateTimeToBreak(currentLevelIndex)
  }

  function handleInputBreak(value: number) {
    if (value <= 0) value = 1
    else if (value > 1440) value = 1440
    else if (value > 100000000) value = 100000000
    setNewBreak(value)
  }

  useEffect(() => {
    readySound()
    updateTimeToBreak(0)
  }, [readySound])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (timeRemaining == 62000 && nextLevel?.break) {
      warningBreakSound()
    }

    if (timeRemaining == 300000) {
      nextLevelSound()
    }

    if (isRunning) {
      timer = setInterval(() => {
        if (timeRemaining > 0) {
          setTimeRemaining((prevTime) => {
            if (prevTime <= 5000) beepSound()
            if (prevTime <= 1000) {
              clearInterval(timer)
              handleLevelChange(1)
              return 0
            }
            return prevTime - 1000
          })
          if (timeToBreak > 0) {
            setTimeToBreak((prevTime) => {
              if (prevTime <= 1000) {
                clearInterval(timer)
                return 0
              }
              return prevTime - 1000
            })
          }
        }
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [isRunning, timeRemaining, timeToBreak, currentLevelIndex])

  useEffect(() => {
    if (currentLevelIndex <= 0 || currentLevelIndex >= levels.length) return

    const currentLevel = levels[currentLevelIndex]

    if (currentLevel.break) {
      breakSound()
      setTimeToBreak(0)
    } else {
      generateVoice(
        `Your attention please, blinds are up! Blinds are now ${currentLevel.sb} ${currentLevel.bb}`,
        'pqHfZKP75CvOlQylNhV4'
      )
      updateTimeToBreak(currentLevelIndex)
    }
  }, [currentLevelIndex])

  return (
    <div className="flex min-h-screen flex-grow flex-col items-center justify-center bg-zinc-900 px-4 text-white">
      <h2 className="mb-2 text-5xl font-bold">
        {currentLevel?.break ? 'Break' : `Level ${currentLevel?.id}`}
      </h2>
      <div className="mb-2 text-4xl">
        {currentLevel?.bb &&
          currentLevel?.sb &&
          `Blinds: ${formatNumber(currentLevel?.sb)} / ${formatNumber(currentLevel?.bb)}`}
      </div>
      {timeToBreak !== 0 && (
        <div className="mb-6 text-2xl tabular-nums text-gray-500">
          Time to next break: {formatTime(timeToBreak)}
        </div>
      )}
      <div
        className={`mb-6 leading-none ${shouldBlink ? 'animate-blink text-red-400' : ''} font-mono text-[20vmin] font-bold tabular-nums xl:text-[12rem]`}
      >
        {formatTime(timeRemaining)}
      </div>
      <TimerProgressBar level={currentLevel} isRunning={isRunning} />
      <div className="mb-6 mt-2 text-xl">
        {nextLevel?.bb && nextLevel?.sb
          ? `Next Blinds: ${formatNumber(nextLevel?.sb)} / ${formatNumber(nextLevel?.bb)}`
          : 'Next: Break'}
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-4">
        <Button variant="ghost" onClick={() => handleLevelChange(-1)}>
          <SkipBack />
        </Button>
        <Button variant="ghost" onClick={handleStartPause}>
          {isRunning ? (
            <>
              <Pause />
            </>
          ) : (
            <>
              <Play />
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={() => handleLevelChange(1)}>
          <SkipForward />
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          <TimerReset />
        </Button>
        <Button onClick={() => setIsReady(false)} variant="ghost">
          <Cog />
        </Button>
        <Input
          className="w-[50px]"
          value={newBreak}
          onChange={(e) => handleInputBreak(Number(e.target.value))}
        />
        <Button onClick={() => addBreak()}>
          Add Break
          <Coffee />
        </Button>
        <FullScreenBtn />
      </div>
    </div>
  )
}
