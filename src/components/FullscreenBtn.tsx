import { Maximize, Minimize } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

function FullScreenBtn() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }

  return (
    <Button
      className="hidden sm:block"
      variant="ghost"
      onClick={toggleFullscreen}
    >
      {isFullscreen ? (
        <>
          <Minimize />
        </>
      ) : (
        <>
          <Maximize />
        </>
      )}
    </Button>
  )
}

export default FullScreenBtn
