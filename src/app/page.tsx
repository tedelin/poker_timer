'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Level } from './types/levels'
import Timer from '../components/timer'
import { CircleMinus, Coffee, Plus } from 'lucide-react'

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
    <div className="grid grid-cols-5 gap-4">
      <div>{level.break ? 'Break' : level.id}</div>
      <Input
        type="number"
        value={level.duration}
        onChange={(e) => handleInputChange('duration', Number(e.target.value))}
      />
      {level.break ? (
        <>
          <div></div>
          <div></div>
        </>
      ) : (
        <>
          <Input
            type="number"
            value={level.sb}
            onChange={(e) => handleInputChange('sb', Number(e.target.value))}
          />
          <Input
            type="number"
            value={level.bb}
            onChange={(e) => handleInputChange('bb', Number(e.target.value))}
          />
        </>
      )}

      <Button onClick={onDelete}>
        <CircleMinus />
      </Button>
    </div>
  )
}

export default function TimerSettings() {
  const [levels, setLevels] = useState<Level[]>([])
  const [isReady, setIsReady] = useState<boolean>(false)

  function handleAddBreak(duration: number) {
    setLevels((prevLevels) => [
      ...prevLevels,
      {
        id: prevLevels.length + 1,
        duration,
        break: true,
      },
    ])
  }

  function handleAddLevel(duration: number, bb: number) {
    setLevels((prevLevels) => [
      ...prevLevels,
      {
        id: prevLevels.length + 1,
        duration,
        break: false,
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
    <div className="flex grow flex-col items-center gap-4">
      <div>42Poker</div>
      <div className="grid grid-cols-5 gap-4 overflow-hidden bg-green-400 font-bold">
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
      <div className="flex items-center gap-4">
        <Button className="" onClick={() => handleAddLevel(15, 10)}>
          <Plus />
          Add Level
        </Button>
        <Button className="" onClick={() => handleAddBreak(15)}>
          <Coffee />
          Add Break
        </Button>
      </div>
      <div>
        {/* <Button onClick={saveConfig}>Save Config</Button>
        <Button onClick={resetLevels}>Reset</Button>
        <Input type="file" accept="application/json" onChange={loadConfig} /> */}
        <Button className="bg-green-600" onClick={() => setIsReady(true)}>
          Start Timer
        </Button>
      </div>
    </div>
  )
}
