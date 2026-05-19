// hooks/use-notifications.ts - FIXED (No NextAuth)
import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useSocket } from "@/components/providers/socket-provider"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export function useNotifications() {
  const { user } = useAuth()
  const { socket, isConnected } = useSocket()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return
    
    try {
      const response = await fetch("/api/notifications")
      const data = await response.json()
      const notificationsArray = Array.isArray(data) ? data : []
      setNotifications(notificationsArray)
      setUnreadCount(notificationsArray.filter((n: Notification) => !n.read).length)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }, [user])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!socket || !isConnected || !user) return

    const channel = socket.subscribe(`user-${user.id}`)
    
    channel.bind("new-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    return () => {
      channel.unbind("new-notification")
      socket.unsubscribe(`user-${user.id}`)
    }
  }, [socket, isConnected, user])

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      })
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" })
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
  }
}