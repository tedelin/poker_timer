'use client'

import LevelsTable from '@/components/LevelsTable'
import Navbar from '@/components/Navbar'
import Timer from '@/components/Timer'
import { Button } from '@/components/ui/button'
import { loadConfig, saveConfig } from '@/lib/levelConfig'
import { LevelsArray } from '@/types/levels'
import { Coffee, Download, Plus, RotateCcw, Upload } from 'lucide-react'
import { useState } from 'react'

function TimerSettings() {
  const [levels, setLevels] = useState<LevelsArray>([])
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

  function handleAddLevel() {
    const bb = (levels[levels.length - 1]?.bb ?? 5) * 2
    const duration = levels[levels.length - 1]?.duration ?? 20
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

  if (isReady) {
    return <Timer setIsReady={setIsReady} levels={levels} />
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto max-h-[calc(100vh-160px)] overflow-y-auto px-4 pb-40 pt-8">
        <LevelsTable levels={levels} setLevels={setLevels} />
      </div>

      <div className="absolute bottom-10 left-0 w-full bg-background p-4">
        <div className="container mx-auto flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="font-bold text-green-600 hover:bg-green-200"
              onClick={() => handleAddLevel()}
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
          <div className="flex gap-4">
            <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
              <Upload />
              Load
              <input
                type="file"
                className="hidden"
                accept="application/json"
                onChange={(e) => loadConfig(e, setLevels)}
              />
            </label>
            <Button variant="ghost" onClick={resetLevels}>
              <RotateCcw />
              Reset
            </Button>
            <Button variant="ghost" onClick={() => saveConfig(levels)}>
              <Download />
              Save
            </Button>
          </div>
          <Button
            className="w-96 bg-green-600 font-bold text-foreground hover:bg-green-700"
            onClick={() => setIsReady(true)}
          >
            Start Timer
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TimerSettings
