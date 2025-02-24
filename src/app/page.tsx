'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Level } from './types/levels'
import Timer from '../components/timer'
import { Coffee, Plus } from 'lucide-react'

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import SortableItem from '@/components/SortableItem'
import { Input } from '@/components/ui/input'

function TimerSettings() {
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

  // Handle drag end and reordering
  function handleDragEnd(event: any) {
    const { active, over } = event
    if (active.id !== over.id) {
      setLevels((prevLevels) => {
        const oldIndex = prevLevels.findIndex((level) => level.id === active.id)
        const newIndex = prevLevels.findIndex((level) => level.id === over.id)
        const newArray = arrayMove(prevLevels, oldIndex, newIndex)
        return newArray.map((level, index) => ({
          ...level,
          id: index + 1,
        }))
      })
    }
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

  const sensors = useSensors(useSensor(PointerSensor))

  if (isReady) {
    return <Timer levels={levels} />
  }

  return (
    <div className="flex max-h-full grow flex-col items-center gap-4 bg-slate-900 text-white">
      <div className="mt-3 text-xl font-bold">42Poker - Tournament Timer</div>
      <div className="grid grid-cols-6 gap-4 rounded-md p-4 font-bold">
        <div className="text-center">Round</div>
        <div>Duration (min)</div>
        <div>Small Blind</div>
        <div>Big Blind</div>
        <div></div>
        <div></div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={levels} strategy={verticalListSortingStrategy}>
          <div className="scrollbar-none grid h-dvh grid-cols-1 gap-4 overflow-y-auto rounded-md p-4 font-bold">
            {levels.map((level) => (
              <SortableItem
                key={level.id}
                level={level}
                onUpdate={handleUpdateLevel}
                onDelete={() => handleDeleteLevel(level.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex items-center gap-4">
        <Button
          className="border-none bg-transparent font-bold text-green-600 shadow-none hover:bg-green-200"
          onClick={() => handleAddLevel(15, 10)}
        >
          <Plus />
          Add Level
        </Button>
        <Button
          className="border-none bg-transparent font-bold text-indigo-700 shadow-none hover:bg-indigo-200"
          onClick={() => handleAddBreak(15)}
        >
          <Coffee />
          Add Break
        </Button>
      </div>
      <Button
        className="mb-10 bg-green-600 font-bold hover:bg-green-700"
        onClick={() => setIsReady(true)}
      >
        Start Timer
      </Button>
      <div className="w-100 mb-10 grow bg-blue-700">
        <Button onClick={saveConfig}>Save Config</Button>
        <Button onClick={resetLevels}>Reset</Button>
        <Input type="file" accept="application/json" onChange={loadConfig} />
      </div>
    </div>
  )
}

export default TimerSettings
