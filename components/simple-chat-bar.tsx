"use client"

import React, { useState } from 'react'
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

  const clearMessages = () => {
    setMessages([])
    setIsExpanded(false)
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-80">
      {/* Expanded Chat Window */}
      {isExpanded && (
        <Card className="mb-2 shadow-lg border-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-600" />
                AI Assistant
              </h3>
              <Button
                onClick={clearMessages}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bot className="h-3 w-3 text-blue-600" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-800 border'
                    }`}
                  >
                    {message.type === 'ai' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            // Custom styling for different elements
                            h1: ({ children }) => <h1 className="text-base font-bold mb-2 text-gray-800">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-sm font-semibold mb-1 text-gray-800">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-medium mb-1 text-gray-800">{children}</h3>,
                            p: ({ children }) => <p className="mb-2 last:mb-0 text-gray-700 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="mb-2 pl-4 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-2 pl-4 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-gray-700">{children}</li>,
                            code: ({ children, className }) => {
                              const isInline = !className
                              return isInline ? (
                                <code className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded text-xs font-mono">
                                  {children}
                                </code>
                              ) : (
                                <code className={className}>{children}</code>
                              )
                            },
                            pre: ({ children }) => (
                              <pre className="bg-gray-100 border rounded p-2 overflow-x-auto text-xs">
                                {children}
                              </pre>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-blue-200 pl-3 italic text-gray-600 mb-2">
                                {children}
                              </blockquote>
                            ),
                            strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                            em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="text-white">{message.content}</span>
                    )}
                  </div>
                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-3 w-3 text-gray-600" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="h-3 w-3 text-blue-600" />
                    </div>
                  </div>
                  <div className="bg-gray-50 border rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                      <span className="text-xs text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI about your design..."
          className="flex-1 text-sm"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="sm" 
          disabled={isLoading || !input.trim()}
          className="px-3"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}