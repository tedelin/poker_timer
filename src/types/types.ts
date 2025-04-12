export interface User {
  id: number
  name: string
  firstName?: string
  lastName?: string
  avatar: string
  isPresent: boolean
  tableId: number | null
  isRolling?: boolean
  isLateRegistration?: boolean
}

export interface Table {
  id: number
  name: string
  players: User[]
}
