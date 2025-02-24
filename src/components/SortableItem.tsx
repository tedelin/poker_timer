import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import LevelRow from './LevelRow'
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
    <tr ref={setNodeRef} style={style} {...attributes}>
      <td {...listeners} className="text-center">
        {level.break ? 'Break' : level.id}
      </td>
      <LevelRow level={level} onUpdate={onUpdate} onDelete={onDelete} />
    </tr>
  )
}
