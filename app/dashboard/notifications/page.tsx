// app/dashboard/notifications/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell, CheckCheck, Circle, Calendar, Briefcase, 
  Users, MessageSquare, Trash2, Eye, Loader2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  metadata?: any
}

export default function CandidateNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const markAllAsRead = async () => {
    setMarkingAll(true)
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success("All notifications marked as read")
    } catch (error) {
      toast.error("Failed to mark all as read")
    } finally {
      setMarkingAll(false)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" })
      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success("Notification deleted")
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "APPLICATION_UPDATE": return <Briefcase className="h-5 w-5 text-blue-500" />
      case "INTERVIEW_SCHEDULED": return <Calendar className="h-5 w-5 text-green-500" />
      case "JOB_ALERT": return <Bell className="h-5 w-5 text-orange-500" />
      case "NEW_MESSAGE": return <MessageSquare className="h-5 w-5 text-purple-500" />
      default: return <Bell className="h-5 w-5 text-slate-500" />
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "unread") return !n.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-lg mb-4" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-slate-500 mt-1">Stay updated with your job activity</p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead} 
              disabled={markingAll}
              className="gap-2"
            >
              {markingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
              Mark all as read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-slate-900">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                    <p className="text-slate-500">You're all caught up!</p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className={`transition-all cursor-pointer hover:shadow-md ${
                        !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/10" : ""
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold">{notification.title}</p>
                                <p className="text-sm text-slate-500 mt-1">{notification.message}</p>
                                <p className="text-xs text-slate-400 mt-2">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                                )}
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
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
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}