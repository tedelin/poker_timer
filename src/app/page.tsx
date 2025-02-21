'use client'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface Level {
  id: number
  duration: number
  sb: number
  bb: number
}

function Level({
  level,
  onUpdate,
  onDelete,
}: {
  level: Level
  onUpdate: (updatedLevel: Level) => void
  onDelete: () => void
}) {
  function handleInputChange(key: keyof Level, value: number) {
    onUpdate({ ...level, [key]: value })
  }

  return (
    <div className="flex items-center gap-2">
      <div>{level.id}</div>
      <input
        type="number"
        value={level.duration}
        onChange={(e) => handleInputChange('duration', Number(e.target.value))}
      />
      <input
        type="number"
        value={level.sb}
        onChange={(e) => handleInputChange('sb', Number(e.target.value))}
      />
      <input
        type="number"
        value={level.bb}
        onChange={(e) => handleInputChange('bb', Number(e.target.value))}
      />
      <Button onClick={onDelete}>Delete</Button>
    </div>
  )
}

export default function TimerSettings() {
  const [levels, setLevels] = useState<Level[]>([])

  function handleAddLevel(duration: number, bb: number) {
    setLevels((prevLevels) => [
      ...prevLevels,
      {
        id: prevLevels.length + 1,
        duration,
        bb,
        sb: bb / 2,
      },
    ])
  }

  function handleUpdateLevel(updatedLevel: Level) {
    setLevels((prevLevels) =>
      prevLevels.map((level) =>
        level.id === updatedLevel.id ? updatedLevel : level
      )
    )
  }

  function handleDeleteLevel(levelId: number) {
    setLevels((prevLevels) => {
      const updatedLevels = prevLevels.filter((l) => l.id !== levelId)

      return updatedLevels.map((level, index) => ({
        ...level,
        id: index + 1,
      }))
    })
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 font-bold">
        <div>Round</div>
        <div>Duration (min)</div>
        <div>Small Blind</div>
        <div>Big Blind</div>
      </div>
      {levels.map((level) => (
        <Level
          key={level.id}
          level={level}
          onUpdate={handleUpdateLevel}
          onDelete={() => handleDeleteLevel(level.id)}
        />
      ))}
      <div className="mt-4 flex w-full gap-2">
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
