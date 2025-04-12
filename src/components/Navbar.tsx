import { Clock, Users } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">42Poker</h1>
            <div className="ml-10 hidden space-x-8 md:flex">
              <Link
                href="/event"
                className="flex items-center text-foreground transition-colors hover:text-muted-foreground"
              >
                <Users className="mr-2 h-5 w-5" />
                <span>Table Manager</span>
              </Link>
              <Link
                href="/"
                className="flex items-center text-foreground transition-colors hover:text-muted-foreground"
              >
                <Clock className="mr-2 h-5 w-5" />
                <span>Timer</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
