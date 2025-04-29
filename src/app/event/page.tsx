'use client'
import Navbar from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { UserManager } from '@/components/user-manager'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

function Event() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Poker Table Manager</h1>
          <p className="text-muted-foreground">
            Manage players and tables for your live event
          </p>
        </header>
        <UserManager />
      </div>
    </div>
  )
}

export default function EventPage() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn() // Force sign in to hopefully resolve error
    }
  }, [session])

  if (session) return <Event />

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => signIn()}>Login</Button>
      </div>
    </div>
  )
}
