import { Level } from '@/app/types/levels'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Minus } from 'lucide-react'

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
      <div className="text-center">{level.break ? 'Break' : level.id}</div>
      <Input
        type="number"
        value={level.duration}
        onChange={(e) => handleInputChange('duration', Number(e.target.value))}
      />
      {level.break ? (
        <>
          <div></div>
          <div></div>
        </>
      ) : (
        <>
          <Input
            type="number"
            value={level.sb}
            onChange={(e) => handleInputChange('sb', Number(e.target.value))}
          />
          <Input
            type="number"
            value={level.bb}
            onChange={(e) => handleInputChange('bb', Number(e.target.value))}
          />
        </>
      )}
      <Button
        onClick={onDelete}
        className="w-10 border-none bg-transparent text-white shadow-none hover:bg-red-200"
      >
        <Minus className="text-center text-red-500" />
      </Button>
    </>
  )
}
