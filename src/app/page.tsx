'use client'

import QRCodeSVG from '@/assets/qrcode.svg'
import LevelsTable from '@/components/LevelsTable'
import Timer from '@/components/timer'
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
    let bb = 10
    let duration = 20
    if (levels.length >= 1 && !levels[levels.length - 1].break) {
      bb = levels[levels.length - 1]?.bb * 2
      duration = levels[levels.length - 1].duration
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

  if (isReady) {
    return <Timer setIsReady={setIsReady} levels={levels} />
  }

  return (
    <div className="flex max-h-full grow flex-col items-center gap-4 bg-zinc-900 text-white">
      {/* <div className="mt-3 text-xl font-bold">42Poker - Tournament Timer</div> */}
      <QRCodeSVG />
      <div className="scrollbar-none h-dvh max-h-dvh overflow-y-auto rounded-md">
        <LevelsTable levels={levels} setLevels={setLevels} />
      </div>

      <div className="flex items-center gap-4">
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
      <div className="mb-2 flex items-center gap-4">
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
        className="mb-10 w-96 bg-green-600 font-bold hover:bg-green-700"
        onClick={() => setIsReady(true)}
      >
        Start Timer
      </Button>
    </div>
  )
}

export default TimerSettings
