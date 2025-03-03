import { Minus, Plus, Users } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

function PlayersCount() {
  const [players, setPlayers] = useState(0)

  return (
    <div className="group flex flex-row items-center justify-center text-center">
      <Button
        className="invisible bg-transparent group-hover:visible"
        onClick={() => setPlayers(players - 1)}
      >
        <Minus />
      </Button>
      <Users />
      <input
        type="number"
        className="no-spinner ml-2 w-[2ch] appearance-none border-none bg-transparent font-bold outline-none ring-0 focus:outline-none focus:ring-0"
        value={players}
        onChange={(e) => setPlayers(Number(e.target.value))}
      />
      <Button
        className="invisible bg-transparent group-hover:visible"
        onClick={() => setPlayers(players + 1)}
      >
        <Plus />
      </Button>
    </div>
  )
}

export default PlayersCount
