'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'

interface User {
  login: string
  profile_picture_url: string
  present: boolean
}

function UserRow({ user }: { user: User }) {
  return (
    <div className="mx-8 flex flex-grow flex-row items-center justify-center">
      <Image
        className="rounded-full"
        loader={() => user.profile_picture_url}
        alt="profile_picture"
        height={50}
        width={50}
        src={user.profile_picture_url}
      />
      <div className="text-center">{user.login}</div>
      <Checkbox />
    </div>
  )
}

function EventUser() {
  const [eventId, setEventId] = useState(0)
  const [users, setUsers] = useState<User[]>([])
  const { data: session } = useSession()

  async function fetchUsers(eventId: number) {
    const url = `https://api.intra.42.fr/v2/events/${eventId}/events_users?size=100`
    const headers = {
      Authorization: `Bearer ${session.accessToken}`,
    }

    try {
      const response = await fetch(url, { headers })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log(data)
      setUsers(
        data.map((entry: any) => ({
          login: entry.user.login,
          profile_picture_url: entry.user.image.versions.small, // Assuming profile picture URL is in `image_url` field
        }))
      )
    } catch (error) {
      console.error('Error fetching data:', error)
      return []
    }
  }

  function addPlayer() {}

  return (
    <div className="flex flex-grow flex-col">
      <Input
        type="number"
        value={eventId}
        onChange={(e) => setEventId(Number(e.target.value))}
      />
      <Button onClick={() => fetchUsers(eventId)}>Submit</Button>
      <div className="scrollbar-none flex h-dvh max-h-dvh flex-col gap-4 overflow-y-auto">
        {users && users.map((user, id) => <UserRow user={user} key={id} />)}
      </div>
      <Button onClick={() => addPlayer()}>Add Player</Button>
    </div>
  )
}

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="flex grow flex-col items-center bg-zinc-900 text-white">
        <button onClick={() => signOut()}>Sign out</button>
        <EventUser />
      </div>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
