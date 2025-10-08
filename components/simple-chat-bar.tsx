"use client"

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Send, Bot, User, Loader2, X } from 'lucide-react'

import type { Part, Connection } from '@/lib/types'

// Add CSS for syntax highlighting
import 'highlight.js/styles/github.css'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface DesignContext {
  parts: Part[]
  connections: Connection[]
}

interface SimpleChatBarProps {
  onSendMessage?: (message: string) => void
  designContext?: DesignContext
}

export function SimpleChatBar({ onSendMessage, designContext }: SimpleChatBarProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Drag state management
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 16, y: 16 }) // Default top-left position (top-4 left-4 = 16px)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setIsExpanded(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          category: 'prototypingAdvice',
          parts: designContext?.parts || [],
          connections: designContext?.connections || []
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error calling AI API:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }

    onSendMessage?.(input.trim())
  }

  // Drag event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true)
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      // Constrain to viewport bounds
      const maxX = window.innerWidth - 400 // popup width
      const maxY = window.innerHeight - 200 // approximate popup height
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add global mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  const clearMessages = () => {
    setMessages([])
    setIsExpanded(false)
  }

  return (
    <>
      {/* AI Result Popup - Modern Draggable */}
      {isExpanded && (
        <div 
          className={`fixed z-50 w-96 max-w-md ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            userSelect: isDragging ? 'none' : 'auto'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className={`backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl border border-white/20 shadow-2xl ${isDragging ? 'shadow-3xl scale-105' : ''} transition-all duration-300 overflow-hidden`}>
            {/* Modern Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between p-4 drag-handle cursor-move">
                <div className="flex items-center gap-3 pointer-events-none">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-gray-900 dark:text-white">AI Assistant</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Design Intelligence</p>
                  </div>
                </div>
                <Button
                  onClick={clearMessages}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 pointer-events-auto rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="p-4">
              <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-sm px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-200 hover:shadow-md ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200'
                          : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-200/50 shadow-gray-100'
                      }`}
                    >
                      {message.type === 'ai' ? (
                        <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-purple-700 prose-code:bg-purple-50 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              // Custom styling for different elements
                              h1: ({ children }) => <h1 className="text-lg font-bold mb-3 text-gray-900 border-b border-gray-200 pb-1">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-base font-semibold mb-2 text-gray-900">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-sm font-medium mb-2 text-gray-800">{children}</h3>,
                              p: ({ children }) => <p className="mb-3 last:mb-0 text-gray-800 leading-relaxed">{children}</p>,
                              ul: ({ children }) => <ul className="mb-3 pl-5 space-y-1">{children}</ul>,
                              ol: ({ children }) => <ol className="mb-3 pl-5 space-y-1">{children}</ol>,
                              li: ({ children }) => <li className="text-gray-800">{children}</li>,
                              code: ({ children, className }) => {
                                const isInline = !className
                                return isInline ? (
                                  <code className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs font-mono border border-purple-100">
                                    {children}
                                  </code>
                                ) : (
                                  <code className={className}>{children}</code>
                                )
                              },
                              pre: ({ children }) => (
                                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto text-xs shadow-inner">
                                  {children}
                                </pre>
                              ),
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-blue-300 pl-4 italic text-gray-700 mb-3 bg-blue-50/50 py-2 rounded-r-lg">
                                  {children}
                                </blockquote>
                              ),
                              strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                              em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <span className="text-white font-medium">{message.content}</span>
                      )}
                    </div>
                    {message.type === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-lg">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                        <span className="text-xs text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form - Centered at Bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-80">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl p-3 shadow-lg shadow-gray-200/50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI about your prototype..."
              className="flex-1 text-sm border-0 bg-gray-50/50 focus:bg-white transition-colors duration-200 rounded-xl"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="sm" 
              disabled={isLoading || !input.trim()}
              className="px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}