import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, User } from '@/types/types'

interface TableAssignmentProps {
  tables: Table[]
}

export function TableAssignment({ tables }: TableAssignmentProps) {
  if (tables.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No tables have been set up yet
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {tables.map((table) => (
        <Card key={table.id} className="border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{table.name}</CardTitle>
              <Badge variant="outline">{table.players.length} players</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {table.players.map((player: User) => (
                <div key={player.id} className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={player.avatar || '/placeholder.svg'}
                      alt={player.name}
                    />
                    <AvatarFallback>
                      {player.firstName?.substring(0, 1)}
                      {player.lastName?.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {player.firstName} {player.lastName}
                      {player.isLateRegistration && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Late
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {table.players.length === 0 && (
                <p className="py-2 text-sm text-muted-foreground">
                  No players assigned
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
