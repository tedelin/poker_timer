'use client'

import { Cog, Pause, Play, SkipForward, TimerReset } from 'lucide-react'
import { useEffect, useState } from 'react'
import useSound from 'use-sound'
import { LevelsArray } from '../app/types/levels'
import FormatTime from './FormatTime'
import FullScreenBtn from './fullscreen'
import TimerProgressBar from './ProgressBar'
import { Button } from './ui/button'

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
  const [isRunning, setIsRunning] = useState(false)
  const [readySound] = useSound('/sounds/en/ready.mp3')
  const [startSound] = useSound('/sounds/en/start.mp3')
  const [nextLevelSound] = useSound('/sounds/en/warning.mp3')
  const [warningBreakSound] = useSound('/sounds/en/warning_break.mp3')

  async function generateVoice(text: string, voiceId: string) {
    const response = await fetch('/api/generate-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice_id: voiceId }),
    })
    if (!response.ok) {
      alert('Erreur lors de la génération de la voix')
      return
    }
    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    const audio = new Audio(audioUrl)
    audio.play()
  }

  useEffect(() => {
    readySound()
  }, [readySound])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (timeRemaining == 1 && nextLevel.break) {
      warningBreakSound()
    }

    if (timeRemaining == 300000) {
      nextLevelSound()
    }

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
  }, [isRunning, timeRemaining, currentLevelIndex])

  function handleStartPause() {
    if (currentLevelIndex == 0 && !isRunning) {
      startSound()
    }
    setIsRunning((prev) => !prev)
  }

  function handleNextLevel() {
    if (!nextLevel) return
    generateVoice(
      `Your attention please, blinds are up! Blinds are now ${nextLevel.sb} ${nextLevel.bb}`,
      'pqHfZKP75CvOlQylNhV4'
    )
    setCurrentLevelIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      if (nextIndex >= levels.length) {
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
      <p>Next Break: </p>

      <FormatTime time={timeRemaining} />
      <TimerProgressBar level={currentLevel} isRunning={isRunning} />
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
            </>
          ) : (
            <>
              <Play />
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={handleNextLevel}>
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
