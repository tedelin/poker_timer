'use client'

import { DiceAnimation } from '@/components/dice-animation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from '@/types/types'
import type React from 'react'
import { useState } from 'react'

interface LateRegistrationProps {
  onAddPlayer: (player: User) => void
}

export function LateRegistration({ onAddPlayer }: LateRegistrationProps) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim() === '') return

    setIsSubmitting(true)

    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    const newPlayer: User = {
      id: Date.now(), // Use timestamp as a unique ID
      name: name.trim(),
      firstName,
      lastName,
      avatar: '',
      isPresent: true,
      tableId: null,
      isRolling: true,
      isLateRegistration: true,
    }

    onAddPlayer(newPlayer)

    setName('')

    setTimeout(() => {
      setIsSubmitting(false)
    }, 2100)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter player name"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button type="submit" disabled={!name.trim() || isSubmitting}>
          {isSubmitting ? 'Assigning...' : 'Add Late Player'}
        </Button>
        {isSubmitting && (
          <DiceAnimation
            isRolling={true}
            finalNumber={1}
            onAnimationComplete={() => {}}
          />
        )}
      </div>
    </form>
  )
}
