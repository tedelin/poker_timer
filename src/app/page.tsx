'use client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type Level = {
  id: number
  duration: number
  bb: number
  sb: number
}

export function Level({ level }) {
  const [duration, setDuration] = useState(0)
  const [sb, setSb] = useState(0)
  const [bb, setBb] = useState(0)

  return (
    <div>
      <div>{level.id}</div>
      <input
        type="number"
        onChange={(e) => setDuration(e.target.value)}
        value={duration}
      />
      <input
        type="number"
        onChange={(e) => setDuration(e.target.value)}
        value={sb}
      />
      <input
        type="number"
        onChange={(e) => setDuration(e.target.value)}
        value={bb}
      />
    </div>
  )
}

export default function TimerSettings() {
  const [levels, setLevels] = useState<Level[]>([])
  let nextId = 0

  function handleAddLevel(duration: number, bb: number) {
    setLevels([
      ...levels,
      {
        id: nextId++,
        duration: duration,
        bb: bb,
        sb: bb / 2,
      },
    ])
  }

  function handleChangeLevel(level: Level) {
    setLevels(
      levels.map((t) => {
        if (t.id === level.id) {
          return level
        } else {
          return t
        }
      })
    )
  }

  function handleDeleteLevel(levelId: number) {
    setLevels(levels.filter((l) => l.id !== levelId))
  }
  return (
    <div>
      <div className="grid grid-cols-4 grid-rows-3 gap-4">
        <div>Round</div>
        <div>Duration (min)</div>
        <div>Small Blind</div>
        <div>Big Blind</div>
      </div>
      {levels.map((level, index) => (
        <Level key={index} level={level} />
      ))}
      <div className="w-full">
        <Button className="w-100" onClick={() => handleAddLevel(15, 10)}>
          Add Level
        </Button>
        <Button className="w-100">Add Break</Button>
        <Button>Save Config</Button>
        <Button>Reset</Button>
      </div>
    </div>
  )
}
