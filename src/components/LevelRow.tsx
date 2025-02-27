import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Level } from '@/types/levels'
import { Trash2 } from 'lucide-react'

export default function LevelRow({
  level,
  onUpdate,
  onDelete,
}: {
  level: Level
  onUpdate: (updatedLevel: Level) => void
  onDelete: () => void
}) {
  function handleInputChange(key: keyof Level, value: number) {
    value = value | 0
    if (value <= 0) value = 1
    else if (value > 1440 && key == 'duration') value = 1440
    else if (value > 100000000) value = 100000000
    onUpdate({ ...level, [key]: value })
  }

  return (
    <>
      <td>
        <Input
          type="number"
          value={level.duration}
          onChange={(e) =>
            handleInputChange('duration', Number(e.target.value))
          }
        />
      </td>
      {level.break ? (
        <>
          <td></td>
          <td></td>
        </>
      ) : (
        <>
          <td>
            <Input
              type="number"
              value={level.sb}
              onChange={(e) => handleInputChange('sb', Number(e.target.value))}
            />
          </td>
          <td>
            <Input
              type="number"
              value={level.bb}
              onChange={(e) => handleInputChange('bb', Number(e.target.value))}
            />
          </td>
        </>
      )}
      <td>
        <Button
          onClick={onDelete}
          variant="ghost"
          className="w-10 hover:bg-red-200"
        >
          <Trash2 className="text-center text-red-500" />
        </Button>
      </td>
    </>
  )
}
