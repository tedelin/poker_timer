import { LevelsArray } from '@/types/levels'

export function loadConfig(
  event: React.ChangeEvent<HTMLInputElement>,
  setLevels: (levels: LevelsArray) => void
) {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!e.target?.result) return

    try {
      const loadedLevels = JSON.parse(e.target.result as string)
      setLevels(loadedLevels)
    } catch (error) {
      console.error('Error parsing JSON:', error)
    }
  }

  reader.readAsText(file)
}

export function saveConfig(levels: LevelsArray) {
  const fileData = JSON.stringify(levels)
  const blob = new Blob([fileData], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = 'levels.json'
  link.href = url
  link.click()
}
