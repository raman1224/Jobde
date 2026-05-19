// app/recruiter/messages/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Send, Search, User, Phone, Video, 
  MoreVertical, Paperclip, Smile,
  MessageSquare
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
  candidate: {
    id: string
    name: string
    email: string
    image?: string
  }
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function MessagesPage() {
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
      fetchMessages(selectedConversation.candidate.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/recruiter/messages/conversations")
      const data = await res.json()
      setConversations(data)
      if (data.length > 0) setSelectedConversation(data[0])
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (candidateId: string) => {
    try {
      const res = await fetch(`/api/recruiter/messages/${candidateId}`)
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const res = await fetch("/api/recruiter/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedConversation.candidate.id,
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
    c.candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="h-[calc(100vh-120px)] overflow-hidden">
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
                    <User className="h-12 w-12 mx-auto mb-4 text-slate-400" />
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
                          <AvatarImage src={conv.candidate.image} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                            {conv.candidate.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold truncate">{conv.candidate.name}</p>
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
          <Card className="md:col-span-2 h-[calc(100vh-120px)] overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.candidate.image} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                        {selectedConversation.candidate.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedConversation.candidate.name}</p>
                      <p className="text-xs text-slate-500">{selectedConversation.candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(100%-130px)]">
                  {messages.map((message) => {
                    const isOwn = message.senderId !== selectedConversation.candidate.id
                    return (
                      <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] ${isOwn ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-800"} rounded-lg p-3`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button size="icon" variant="ghost">
                      <Smile className="h-4 w-4" />
                    </Button>
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