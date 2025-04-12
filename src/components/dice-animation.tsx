"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface DiceAnimationProps {
  isRolling: boolean
  finalNumber: number
  onAnimationComplete: () => void
}

export function DiceAnimation({ isRolling, finalNumber, onAnimationComplete }: DiceAnimationProps) {
  const [currentFace, setCurrentFace] = useState(1)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRolling) {
      interval = setInterval(() => {
        setCurrentFace(Math.floor(Math.random() * 6) + 1)
      }, 100)

      // Stop after 1.5 seconds and show the final number
      setTimeout(() => {
        if (interval) clearInterval(interval)
        setCurrentFace(finalNumber)
        setTimeout(onAnimationComplete, 500) // Give a moment to see the final number
      }, 1500)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRolling, finalNumber, onAnimationComplete])

  if (!isRolling && finalNumber === 0) return null

  return (
    <motion.div
      className="w-12 h-12 bg-background rounded-lg shadow-md flex items-center justify-center"
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: isRolling ? [1, 1.2, 1] : 1,
        rotate: isRolling ? [0, 360, 720, 1080] : 0,
        y: isRolling ? [0, -20, 0] : 0,
      }}
      transition={{
        duration: isRolling ? 1.5 : 0.3,
        ease: "easeInOut",
      }}
    >
      <div className="relative w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
        {/* Dice dots based on current face */}
        {currentFace === 1 && <div className="bg-white rounded-full w-2 h-2 absolute"></div>}

        {currentFace === 2 && (
          <>
            <div className="bg-white rounded-full w-2 h-2 absolute top-2 left-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute bottom-2 right-2"></div>
          </>
        )}

        {currentFace === 3 && (
          <>
            <div className="bg-white rounded-full w-2 h-2 absolute top-2 left-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute bottom-2 right-2"></div>
          </>
        )}

        {currentFace === 4 && (
          <>
            <div className="bg-white rounded-full w-2 h-2 absolute top-2 left-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute top-2 right-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute bottom-2 left-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute bottom-2 right-2"></div>
          </>
        )}

        {currentFace === 5 && (
          <>
            <div className="bg-white rounded-full w-2 h-2 absolute top-2 left-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute top-2 right-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute bottom-2 left-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute bottom-2 right-2"></div>
          </>
        )}

        {currentFace === 6 && (
          <>
            <div className="bg-white rounded-full w-2 h-2 absolute top-2 left-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute top-2 right-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute left-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute right-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute bottom-2 left-2"></div>
            <div className="bg-white rounded-full w-2 h-2 absolute bottom-2 right-2"></div>
          </>
        )}
      </div>
    </motion.div>
  )
}
