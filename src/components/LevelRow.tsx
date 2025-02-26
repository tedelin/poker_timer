import { Level } from '@/app/types/levels'
import { Minus } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'

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
          <Minus className="text-center text-red-500" />
        </Button>
      </td>
    </>
  )
}
