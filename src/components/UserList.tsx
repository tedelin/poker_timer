'use client'

import { DiceAnimation } from '@/components/DiceAnimation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { User } from '@/types/types'

interface UserListProps {
  users: User[]
  toggleUserPresence: (userId: number) => void
}

export function UserList({ users, toggleUserPresence }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No users fetched yet
      </div>
    )
  }

  const registeredUsers = users.filter((user) => !user.isLateRegistration)

  if (registeredUsers.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No pre-registered users available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="mb-2 text-lg font-medium">Pre-registered Users</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {registeredUsers.map((user) => (
          <div
            key={user.id}
            className={`flex items-center space-x-4 rounded-lg border border-border p-3 transition-colors ${
              !user.isPresent && !user.isRolling
                ? 'cursor-pointer hover:bg-accent/50'
                : 'hover:bg-accent/20'
            }`}
            onClick={() => {
              if (!user.isPresent && !user.isRolling) {
                toggleUserPresence(user.id)
              }
            }}
          >
            <Checkbox
              id={`user-${user.id}`}
              checked={user.isPresent}
              onCheckedChange={() =>
                !user.isPresent &&
                !user.isRolling &&
                toggleUserPresence(user.id)
              }
              disabled={user.isPresent || user.isRolling}
              className="pointer-events-none" // Prevent checkbox from capturing clicks
            />
            <Avatar>
              <AvatarImage
                src={user.avatar || '/placeholder.svg'}
                alt={user.name}
              />
              <AvatarFallback>
                {user.firstName?.substring(0, 1)}
                {user.lastName?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {user.firstName} ({user.login})
                {user.tableId && (
                  <Badge variant="outline" className="ml-2">
                    Table {user.tableId}
                  </Badge>
                )}
              </div>
            </div>
            {user.isRolling && (
              <DiceAnimation
                isRolling={user.isRolling}
                finalNumber={user.tableId || 1}
                onAnimationComplete={() => {}}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
