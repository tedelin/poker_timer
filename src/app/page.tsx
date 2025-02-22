'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Level } from './types/levels'
import Timer from '../components/timer'

function LevelRow({
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
    <div className="grid grid-cols-4 gap-4">
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
  const [isReady, setIsReady] = useState<boolean>(false)

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

  function resetLevels() {
    setLevels([])
  }

  function loadConfig(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) return

      try {
        const loadedLevels = JSON.parse(e.target.result as string)
        setLevels(loadedLevels)
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }

    reader.readAsText(file)
  }

  function saveConfig() {
    const fileData = JSON.stringify(levels)
    const blob = new Blob([fileData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'levels.json'
    link.href = url
    link.click()
  }

  if (isReady) {
    return <Timer levels={levels} />
  }

  return (
    <div>
      <div>42Poker</div>
      <div className="grid grid-cols-4 gap-4 font-bold">
        <div>Round</div>
        <div>Duration (min)</div>
        <div>Small Blind</div>
        <div>Big Blind</div>
      </div>
      {levels.map((level) => (
        <LevelRow
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
        <Button onClick={saveConfig}>Save Config</Button>
        <Button onClick={resetLevels}>Reset</Button>
        <input type="file" accept="application/json" onChange={loadConfig} />
        <Button onClick={() => setIsReady(true)}>Start</Button>
      </div>
    </div>
  )
}
