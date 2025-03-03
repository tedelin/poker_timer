'use client'

import FullScreenBtn from '@/components/FullscreenBtn'
import TimerProgressBar from '@/components/ProgressBar'
import { Button } from '@/components/ui/button'
import { LevelsArray } from '@/types/levels'
import formatNumber from '@/utils/formatNumber'
import formatTime from '@/utils/formatTime'
import generateVoice from '@/utils/generateVoice'
import {
  Cog,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  TimerReset,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import useSound from 'use-sound'

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
  const [beepSound] = useSound('/sounds/beep.mp3')
  const [breakSound] = useSound('/sounds/en/break.mp3')
  const [breakOverSound] = useSound('/sounds/en/break_over.mp3')
  const shouldBlink = timeRemaining <= 15000
  const currentLevel = levels[currentLevelIndex]
  const nextLevel = levels[currentLevelIndex + 1]

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
      if (levels[prevIndex].break) breakOverSound()
      else if (!levels[nextIndex].break) {
        generateVoice(
          `Your attention please, blinds are up! Blinds are now ${nextLevel.sb} ${nextLevel.bb}`,
          'pqHfZKP75CvOlQylNhV4'
        )
        updateTimeToBreak(nextIndex)
      } else {
        breakSound()
        setTimeToBreak(0)
      }
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
            if (prevTime <= 15000) beepSound()
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

  return (
    <div className="flex flex-grow flex-col items-center justify-center bg-zinc-900 px-4 text-white">
      <h2 className="mb-2 text-5xl font-bold">
        {currentLevel?.break ? 'Break' : `Level ${currentLevel?.id}`}
      </h2>
      <div className="mb-2 text-3xl">
        {currentLevel?.bb &&
          currentLevel?.sb &&
          `${formatNumber(currentLevel?.sb)} / ${formatNumber(currentLevel?.bb)}`}
      </div>
      {timeToBreak !== 0 && (
        <div className="mb-6 text-base tabular-nums text-gray-500">
          Time to next break: {formatTime(timeToBreak)}
        </div>
      )}
      <div
        className={`mb-4 leading-none ${shouldBlink ? 'animate-blink text-red-400' : ''} font-mono text-[20vmin] font-bold tabular-nums`}
      >
        {formatTime(timeRemaining)}
      </div>
      <TimerProgressBar level={currentLevel} isRunning={isRunning} />
      <div className="mb-6 text-lg">
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
        <FullScreenBtn />
      </div>
    </div>
  )
}
