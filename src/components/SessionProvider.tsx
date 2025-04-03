'use client'

import { SessionProvider } from 'next-auth/react' // Or your custom session provider

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>
}
