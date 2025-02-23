import { useState } from 'react'
import { Button } from './ui/button'
import { Maximize, Minimize } from 'lucide-react'

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
    <Button onClick={toggleFullscreen}>
      {isFullscreen ? (
        <>
          <Minimize />
          Fullscreen
        </>
      ) : (
        <>
          <Maximize />
          Fullscreen
        </>
      )}
    </Button>
  )
}

export default FullScreenBtn
