import { useEffect, useState } from 'react'

interface TimerProgressBarProps {
  duration: number // Duration in minutes
  isRunning: boolean
  onTimeUp?: () => void
}

export default function TimerProgressBar({
  duration,
  isRunning,
  onTimeUp,
}: TimerProgressBarProps) {
  const durationSeconds = duration * 60
  const [timePassed, setTimePassed] = useState(0)
  const progress = (timePassed / durationSeconds) * 100

  useEffect(() => {
    if (timePassed >= durationSeconds) {
      onTimeUp?.()
      return
    }

    let timer: NodeJS.Timeout

    if (isRunning) {
      timer = setInterval(() => {
        setTimePassed((prev) => prev + 0.1)
      }, 100)
    }

    return () => clearInterval(timer)
  }, [timePassed, durationSeconds, onTimeUp])

  return (
    <div className="relative mb-4 h-8 w-full max-w-2xl overflow-hidden rounded bg-zinc-800">
      <div
        className="h-full bg-green-500 transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
