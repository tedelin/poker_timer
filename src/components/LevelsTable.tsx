import SortableItem from '@/components/SortableItem'
import { Level, LevelsArray } from '@/types/levels'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

export default function LevelsTable({
  levels,
  setLevels,
}: {
  levels: LevelsArray
  setLevels: React.Dispatch<React.SetStateAction<LevelsArray>>
}) {
  const sensors = useSensors(useSensor(PointerSensor))

  function handleUpdateLevel(updatedLevel: Level) {
    setLevels((prevLevels: LevelsArray) =>
      prevLevels.map((level) =>
        level.id === updatedLevel.id ? updatedLevel : level
      )
    )
  }

  function handleDeleteLevel(levelId: number) {
    setLevels((prevLevels: LevelsArray) => {
      const updatedLevels = prevLevels.filter((l) => l.id !== levelId)
      return updatedLevels.map((level, index) => ({
        ...level,
        id: index + 1,
      }))
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active.id !== over?.id) {
      setLevels((prevLevels: LevelsArray) => {
        const oldIndex = prevLevels.findIndex((level) => level.id === active.id)
        const newIndex = prevLevels.findIndex((level) => level.id === over?.id)
        const newArray = arrayMove(prevLevels, oldIndex, newIndex)
        return newArray.map((level, index) => ({
          ...level,
          id: index + 1,
        }))
      })
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table className="w-full table-auto border-separate border-spacing-4">
          <thead className="sticky top-0 bg-zinc-900 shadow-md">
            <tr>
              <th className="text-left">Round</th>
              <th className="text-left">Duration (min)</th>
              <th className="text-left">Small Blind</th>
              <th className="text-left">Big Blind</th>
              <th></th>
            </tr>
          </thead>

          <SortableContext
            items={levels}
            strategy={verticalListSortingStrategy}
          >
            <tbody>
              {levels.map((level) => (
                <SortableItem
                  key={level.id}
                  level={level}
                  onUpdate={handleUpdateLevel}
                  onDelete={() => handleDeleteLevel(level.id)}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
    </>
  )
}
