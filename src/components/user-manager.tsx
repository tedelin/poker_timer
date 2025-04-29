'use client'

import { LateRegistration } from '@/components/late-registration'
import { TableAssignment } from '@/components/table-assignment'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserList } from '@/components/user-list'
import { Table, User } from '@/types/types'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export function UserManager() {
  const [eventId, seteventId] = useState<number>(0)
  const [tableCount, setTableCount] = useState<number>(3)
  const [users, setUsers] = useState<User[]>([])
  const [presentUsers, setPresentUsers] = useState<User[]>([])
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<'fetch' | 'mark' | 'assign'>('fetch')
  const { data: session } = useSession()

  const fetchUsers = async () => {
    let page = 1
    let page_size = 100
    setLoading(true)
    try {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
      }
      const params = new URLSearchParams()
      params.append('page[number]', page.toString())
      params.append('page[size]', page_size.toString())
      const url = `https://api.intra.42.fr/v2/events/${eventId}/events_users?${params}`
      const response = await fetch(url, { headers })
      const data = await response.json()
      const formattedUsers = data.map((user: any) => ({
        id: user.id,
        name: `${user.user.first_name} ${user.user.last_name}`,
        firstName: user.user.usual_first_name ?? user.user.first_name,
        login: user.user.login,
        lastName: user.user.last_name,
        avatar: user.user.image.link,
        isPresent: false,
        tableId: null,
        isRolling: false,
      }))

      setUsers(formattedUsers)
      setPresentUsers([])
      setStep('mark')
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserPresence = (userId: number) => {
    // Find the user
    const user = users.find((u) => u.id === userId)
    if (!user || user.isPresent) return

    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isRolling: true } : u))
    )

    // Assign to a random table
    setTimeout(() => {
      const randomTableIndex = Math.floor(Math.random() * tables.length)
      const tableId = tables[randomTableIndex].id

      // Update user with table assignment
      setUsers(
        users.map((u) =>
          u.id === userId
            ? { ...u, isPresent: true, tableId, isRolling: false }
            : u
        )
      )

      const updatedTables = [...tables]
      const userToAdd = users.find((u) => u.id === userId)
      if (userToAdd) {
        updatedTables[randomTableIndex].players.push({
          ...userToAdd,
          isPresent: true,
          tableId,
        })
        setTables(updatedTables)
      }

      // Update present users
      const updatedPresentUsers = users
        .filter((u) => u.id === userId || u.isPresent)
        .map((u) => (u.id === userId ? { ...u, isPresent: true, tableId } : u))
      setPresentUsers(updatedPresentUsers)
    }, 2000)
  }

  const addLatePlayer = (player: User) => {
    const newPlayer = { ...player, isRolling: true }

    setUsers([...users, newPlayer])

    setTimeout(() => {
      if (tables.length > 0) {
        const randomTableIndex = Math.floor(Math.random() * tables.length)
        const tableId = tables[randomTableIndex].id

        const playerWithTable = {
          ...newPlayer,
          tableId,
          isPresent: true,
          isRolling: false,
        }

        setUsers((users) =>
          users.map((u) => (u.id === newPlayer.id ? playerWithTable : u))
        )

        setPresentUsers((prev) => [...prev, playerWithTable])

        const updatedTables = [...tables]
        updatedTables[randomTableIndex].players.push(playerWithTable)
        setTables(updatedTables)
      }
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <Tabs
        defaultValue={step}
        value={step}
        onValueChange={(value) => setStep(value as any)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fetch">Setup</TabsTrigger>
          <TabsTrigger value="mark" disabled={users.length === 0}>
            Attendance
          </TabsTrigger>
          <TabsTrigger value="assign" disabled={presentUsers.length === 0}>
            Table Assignment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fetch">
          <Card>
            <CardHeader>
              <CardTitle>Setup Tables & Fetch Users</CardTitle>
              <CardDescription>
                Configure your event and fetch participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tableCount">Number of Tables</Label>
                  <Input
                    id="tableCount"
                    type="number"
                    value={tableCount}
                    onChange={(e) =>
                      setTableCount(Number.parseInt(e.target.value) || 3)
                    }
                    min={1}
                    max={20}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="eventId">Event Id</Label>
                  <Input
                    id="eventId"
                    type="number"
                    value={eventId}
                    onChange={(e) =>
                      seteventId(Number.parseInt(e.target.value) || 10)
                    }
                    min={1}
                    max={100}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                onClick={() => {
                  // Create empty tables first
                  const newTables: Table[] = Array.from(
                    { length: tableCount },
                    (_, i) => ({
                      id: i + 1,
                      name: `Table ${i + 1}`,
                      players: [],
                    })
                  )
                  setTables(newTables)
                  fetchUsers()
                }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Setup Tables & Fetch Users'}
              </Button>

              {tables.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {tables.length} tables configured
                </p>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="mark">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                Check users who are present or add late arrivals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <UserList
                  users={users}
                  toggleUserPresence={toggleUserPresence}
                />

                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="mb-4 text-lg font-medium">
                    Late Registration
                  </h3>
                  <LateRegistration onAddPlayer={addLatePlayer} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setStep('assign')}
                disabled={presentUsers.length === 0}
              >
                View Table Assignments
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="assign">
          <Card>
            <CardHeader>
              <CardTitle>Table Assignment</CardTitle>
              <CardDescription>View table assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <TableAssignment tables={tables} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
