"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Zap, Mic, MicOff, Trash2, Moon, Sun, Share2, Download, Brain } from "lucide-react"
import { useChat } from "ai/react"
import { useTheme } from "next-themes"

export default function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } = useChat({
    api: "/api/chat",
  })

  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [typingMessage, setTypingMessage] = useState("")
  const [showTyping, setShowTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsRecording(false)
      }

      recognitionInstance.onerror = () => {
        setIsRecording(false)
      }

      recognitionInstance.onend = () => {
        setIsRecording(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [setInput])

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages, showTyping])

  // Progressive disclosure - show typing indicator
  useEffect(() => {
    if (isLoading) {
      setShowTyping(true)
      const messages = ["Thinking...", "Processing your request...", "Analyzing...", "Almost ready..."]
      let index = 0
      const interval = setInterval(() => {
        setTypingMessage(messages[index])
        index = (index + 1) % messages.length
      }, 1000)

      return () => {
        clearInterval(interval)
        setShowTyping(false)
      }
    }
  }, [isLoading])

  const startRecording = () => {
    if (recognition && !isRecording) {
      setIsRecording(true)
      recognition.start()
    }
  }

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop()
      setIsRecording(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setInput("")
  }

  const shareChat = async () => {
    if (messages.length === 0) return

    const chatContent = messages
      .map((msg) => `${msg.role === "user" ? "You" : "Ether AI"}: ${msg.content}`)
      .join("\n\n")

    if (navigator.share && navigator.canShare && navigator.canShare({ title: "Ether AI Chat", text: chatContent })) {
      try {
        await navigator.share({
          title: "Ether AI Chat",
          text: chatContent,
        })
      } catch (err) {
        // Fallback to clipboard
        fallbackCopyToClipboard(chatContent)
      }
    } else {
      fallbackCopyToClipboard(chatContent)
    }
  }

  const fallbackCopyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert("Chat copied to clipboard!")
      })
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand("copy")
        alert("Chat copied to clipboard!")
      } catch (err) {
        alert("Failed to copy chat")
      }
      document.body.removeChild(textArea)
    }
  }

  const exportChat = () => {
    if (messages.length === 0) return

    const chatContent = messages
      .map((msg) => `${msg.role === "user" ? "You" : "Ether AI"}: ${msg.content}`)
      .join("\n\n")

    const blob = new Blob([chatContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ether-ai-chat-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    console.log("Theme changed to:", newTheme) // Debug log
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    handleSubmit(e)
  }

  const currentTheme = resolvedTheme || theme

  return (
    <div className="h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse bg-gradient-to-r from-purple-500 to-pink-500">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Ether AI</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="rounded-lg hover:bg-muted transition-colors"
            title={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
          >
            {currentTheme === "dark" ? (
              <Sun className="w-4 h-4 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 text-blue-500" />
            )}
            
          </Button>

          {/* Share Chat */}
          {messages.length > 0 && (
            <>
              <Button
                onClick={shareChat}
                variant="ghost"
                size="sm"
                className="rounded-lg hover:bg-muted transition-colors"
                title="Share Chat"
              >
                <Share2 className="w-4 h-4" />
              </Button>

              <Button
                onClick={exportChat}
                variant="ghost"
                size="sm"
                className="rounded-lg hover:bg-muted transition-colors"
                title="Export Chat"
              >
                <Download className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Clear Chat Button */}
          {messages.length > 0 && (
            <Button
              onClick={clearChat}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="py-6 space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              {/* Large Chatbot Icon */}
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Welcome to Ether AI
              </h2>
              <p className="text-muted-foreground text-lg mb-6">Your intelligent companion is ready to help you ✨</p>
              <p className="text-sm text-muted-foreground">
              
              </p>
              <div className="mt-4 text-xs text-muted-foreground">Current theme: {currentTheme}</div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0">
                  <AvatarFallback className="bg-transparent">
                    <div className="text-lg">🧠</div>
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
              </div>

              {message.role === "user" && (
                <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 flex-shrink-0">
                  <AvatarFallback className="bg-transparent">
                    <div className="text-lg">👤</div>
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Enhanced Typing Indicator */}
          {showTyping && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                <AvatarFallback className="bg-transparent">
                  <div className="text-lg">🧠</div>
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{typingMessage}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border backdrop-blur-sm bg-background/80 sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={onSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={isRecording ? "🎤 Listening..." : "Type your message or use voice..."}
              className="flex-1 rounded-2xl border-2 focus:border-purple-500 transition-all duration-300"
              disabled={isLoading || isRecording}
            />

            {/* Voice Button */}
            <Button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`rounded-2xl px-4 transition-all duration-300 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || isRecording}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-2xl px-6 disabled:opacity-50 transition-all duration-300 hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          {isRecording && (
            <div className="text-center mt-2 animate-pulse">
              <span className="text-sm text-red-500">🎤 I'm Listening...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
