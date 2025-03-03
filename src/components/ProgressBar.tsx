import { Level } from '@/types/levels'
import { useEffect, useState } from 'react'

interface TimerProgressBarProps {
  level: Level // Duration in minutes
  isRunning: boolean
}

export default function TimerProgressBar({
  level,
  isRunning,
}: TimerProgressBarProps) {
  const durationSeconds = level?.duration * 60
  const [timePassed, setTimePassed] = useState(0)
  const timeWarning = durationSeconds - timePassed <= 15
  const progress = (timePassed / durationSeconds) * 100

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isRunning) {
      timer = setInterval(() => {
        setTimePassed((prev) => prev + 0.1)
      }, 100)
    }

    return () => clearInterval(timer)
  }, [timePassed, durationSeconds, isRunning])

  useEffect(() => {
    setTimePassed(0)
  }, [level])

  return (
    <div className="relative mb-4 h-8 w-full max-w-2xl overflow-hidden rounded-lg bg-zinc-800">
      <div
        className={`h-full transition-all duration-100 ease-linear ${timeWarning ? 'bg-red-400' : 'bg-green-300'}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
