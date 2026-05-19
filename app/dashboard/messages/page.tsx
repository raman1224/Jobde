// app/dashboard/messages/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Send, Search, User, Phone, Video, 
  MoreVertical, Paperclip, Smile, Building2,
  Clock, CheckCheck
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}

interface Conversation {
  id: string
  company: {
    id: string
    name: string
    logo?: string
  }
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function CandidateMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.company.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/candidate/messages/conversations")
      const data = await res.json()
      setConversations(Array.isArray(data) ? data : [])
      if (data.length > 0) setSelectedConversation(data[0])
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (companyId: string) => {
    try {
      const res = await fetch(`/api/candidate/messages/${companyId}`)
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const res = await fetch("/api/candidate/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedConversation.company.id,
          content: newMessage,
        }),
      })

      if (res.ok) {
        const message = await res.json()
        setMessages([...messages, message])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const filteredConversations = conversations.filter(c =>
    c.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-[600px] rounded-lg" />
            <Skeleton className="md:col-span-2 h-[600px] rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-slate-500 mt-1">Communicate with recruiters</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="h-[calc(100vh-200px)] overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-73px)]">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-500">No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedConversation?.id === conv.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <Avatar>
                          <AvatarImage src={conv.company.logo} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                            {conv.company.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold truncate">{conv.company.name}</p>
                            <span className="text-xs text-slate-400">
                              {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 truncate">{conv.lastMessage}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-blue-500">{conv.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 h-[calc(100vh-200px)] overflow-hidden">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.company.logo} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                        {selectedConversation.company.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedConversation.company.name}</p>
                      <p className="text-xs text-slate-500">Recruiter</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100%-130px)]">
                  {messages.map((message) => {
                    const isOwn = message.senderId !== selectedConversation.company.id
                    return (
                      <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] ${isOwn ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800"} rounded-lg p-3 shadow-sm`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isOwn ? "text-blue-200" : "text-slate-400"} text-xs`}>
                            <Clock className="h-3 w-3" />
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isOwn && message.read && <CheckCheck className="h-3 w-3 ml-1" />}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} className="bg-gradient-to-r from-blue-600 to-orange-500">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
                  <p className="text-slate-500">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

// Missing import
import { MessageSquare } from "lucide-react"