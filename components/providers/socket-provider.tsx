// components/providers/socket-provider.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Pusher from "pusher-js"
import { useSession } from "next-auth/react"

interface SocketContextType {
  socket: Pusher | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Pusher | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user) return

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
      auth: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    })

    pusher.connection.bind("connected", () => {
      setIsConnected(true)
    })

    pusher.connection.bind("disconnected", () => {
      setIsConnected(false)
    })

    setSocket(pusher)

    return () => {
      pusher.disconnect()
    }
  }, [session])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}