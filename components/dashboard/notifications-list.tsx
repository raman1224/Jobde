// components/dashboard/notifications-list.tsx
"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, CheckCheck, Circle, Calendar, Briefcase, MessageSquare, UserPlus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { useSocket } from "@/components/providers/socket-provider"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  metadata?: any
}

const notificationIcons = {
  APPLICATION_UPDATE: Briefcase,
  INTERVIEW_SCHEDULED: Calendar,
  NEW_MESSAGE: MessageSquare,
  JOB_SAVED: Briefcase,
  JOB_ALERT: Bell,
  SYSTEM: Bell,
  PROFILE_VIEW: UserPlus,
}

export const NotificationsList = memo(function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { socket, isConnected } = useSocket()

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/notifications?limit=50")
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  useEffect(() => {
    if (!socket || !isConnected) return

    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev])
      toast.success(notification.title, { description: notification.message })
    }

    socket.bind("new-notification", handleNewNotification)
    return () => {
      socket.unbind("new-notification", handleNewNotification)
    }
  }, [socket, isConnected])

  const markAsRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success("All notifications marked as read")
    } catch (error) {
      toast.error("Failed to mark all as read")
    }
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" })
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success("Notification deleted")
    } catch (error) {
      toast.error("Failed to delete notification")
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-start gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up! New notifications will appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification, index) => {
            const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || Bell
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.03 }}
                className={`
                  relative p-4 border-b last:border-0 transition-all duration-200
                  hover:bg-muted/30 cursor-pointer
                  ${!notification.read ? "bg-primary/5" : ""}
                `}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center
                      ${!notification.read ? "bg-primary/20" : "bg-muted"}
                    `}>
                      <Icon className={`h-5 w-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-medium ${!notification.read ? "text-primary" : ""}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
})