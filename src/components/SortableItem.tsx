import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import LevelRow from './LevelRow'
import { Button } from './ui/button'
import { Grip } from 'lucide-react'
import { Level } from '@/app/types/levels'

export default function SortableItem({
  level,
  onUpdate,
  onDelete,
}: {
  level: Level
  onUpdate: (updatedLevel: Level) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: level.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="grid grid-cols-[auto_auto_auto_auto_auto_auto] gap-4 rounded-md p-4"
    >
      <Button
        {...listeners}
        className="w-10 border-none bg-transparent text-white shadow-none hover:bg-red-200"
      >
        <Grip />
      </Button>
      <LevelRow level={level} onUpdate={onUpdate} onDelete={onDelete} />
    </div>
  )
}
