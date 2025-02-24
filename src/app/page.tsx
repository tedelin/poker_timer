'use client'

import { Button } from '@/components/ui/button'
import { Coffee, Download, Plus, RotateCcw, Upload } from 'lucide-react'
import { useState } from 'react'
import Timer from '../components/timer'
import { Level } from './types/levels'

import LevelsTable from '@/components/LevelsTable'

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

  function handleAddLevel(duration: number) {
    let bb = 10
    if (levels.length >= 1) {
      bb = levels[levels.length - 1].bb * 2
    }
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
    return <Timer setIsReady={setIsReady} levels={levels} />
  }

  return (
    <div className="flex max-h-full grow flex-col items-center gap-4 bg-zinc-900 text-white">
      <div className="mt-3 text-xl font-bold">42Poker - Tournament Timer</div>

      <div className="scrollbar-none h-dvh max-h-dvh overflow-y-auto rounded-md">
        <LevelsTable levels={levels} setLevels={setLevels} />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="font-bold text-green-600 hover:bg-green-200"
          onClick={() => handleAddLevel(15)}
        >
          <Plus />
          Add Level
        </Button>
        <Button
          variant="ghost"
          className="font-bold text-indigo-700 hover:bg-indigo-200"
          onClick={() => handleAddBreak(15)}
        >
          <Coffee />
          Add Break
        </Button>
      </div>

      <div className="mb-2 flex items-center gap-4">
        <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
          <Upload />
          Load Config
          <input
            type="file"
            className="hidden"
            accept="application/json"
            onChange={loadConfig}
          />
        </label>
        <Button variant="ghost" onClick={resetLevels}>
          <RotateCcw />
          Reset
        </Button>
        <Button variant="ghost" onClick={saveConfig} className="font-bold">
          <Download />
          Save Config
        </Button>
      </div>
      <Button
        className="mb-10 w-96 bg-green-600 font-bold hover:bg-green-700"
        onClick={() => setIsReady(true)}
      >
        Start Timer
      </Button>
    </div>
  )
}

export default TimerSettings
