export interface Level {
  id: number
  duration: number
  break: boolean
  sb?: number
  bb?: number
}

export type LevelsArray = Level[]
