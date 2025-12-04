"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Bot, User, Send, Loader2, Lightbulb, Wrench, BarChart3, AlertTriangle } from 'lucide-react'
import type { Part, Connection } from '@/lib/types'
import { AIResultPopup, useAIResultPopup, type AIResult } from './ai-result-popup'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  category?: 'suggestion' | 'analysis' | 'troubleshooting' | 'general'
}

interface AIChatProps {
  parts: Part[]
  connections: Connection[]
  onSuggestionApply?: (suggestion: any) => void
  onAIResult?: (result: AIResult) => void
}

const QUICK_ACTIONS = [
  { id: 'analyze', label: 'Analyze Architecture', icon: BarChart3, category: 'analysis' },
  { id: 'suggest', label: 'Suggest Components', icon: Lightbulb, category: 'suggestion' },
  { id: 'optimize', label: 'Optimize Design', icon: Wrench, category: 'suggestion' },
  { id: 'troubleshoot', label: 'Troubleshoot', icon: AlertTriangle, category: 'troubleshooting' },
]

export function AIChat({ parts, connections, onSuggestionApply, onAIResult }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI system architecture assistant. I can help you design scalable systems, analyze data flows, recommend components, and troubleshoot architectural issues. How can I assist you today?',
      timestamp: new Date(),
      category: 'general'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (content: string, category?: string, showPopup: boolean = true) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call the AI service based on category
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          category,
          parts,
          connections
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        category: category as any
      }

      setMessages(prev => [...prev, aiMessage])

      // Show AI result popup only if showPopup is true and callback is provided
      if (onAIResult && data.response && showPopup) {
        const resultType: AIResult['type'] = category === 'troubleshooting' ? 'error' : 
                                           category === 'suggestion' ? 'suggestion' : 
                                           category === 'analysis' ? 'info' : 'success'
        
        const aiResult: AIResult = {
          id: `ai-result-${Date.now()}`,
          type: resultType,
          title: `AI ${category || 'Response'}`,
          content: data.response,
          timestamp: new Date(),
          category: category as any,
          actions: category === 'suggestion' && onSuggestionApply ? [
            {
              label: 'Apply Suggestion',
              action: () => onSuggestionApply(data),
              variant: 'default'
            }
          ] : undefined
        }
        
        onAIResult(aiResult)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error while processing your request. Please make sure your API key is configured correctly and try again.',
        timestamp: new Date(),
        category: 'general'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    let message = ''
    switch (action.id) {
      case 'analyze':
        message = 'Please analyze my current system architecture and provide insights on scalability and reliability.'
        break
      case 'suggest':
        message = 'Can you suggest additional components that would complement my current system design?'
        break
      case 'optimize':
        message = 'How can I optimize this architecture for better performance and scalability?'
        break
      case 'troubleshoot':
        message = 'I\'m experiencing issues with my system architecture. Can you help troubleshoot?'
        break
    }
    sendMessage(message, action.category, false) // Don't show popup for quick actions
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'suggestion': return <Lightbulb className="h-3 w-3" />
      case 'analysis': return <BarChart3 className="h-3 w-3" />
      case 'troubleshooting': return <AlertTriangle className="h-3 w-3" />
      default: return <Bot className="h-3 w-3" />
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'suggestion': return 'bg-yellow-100 text-yellow-800'
      case 'analysis': return 'bg-blue-100 text-blue-800'
      case 'troubleshooting': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Architecture Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                disabled={isLoading}
                className="text-xs"
              >
                <Icon className="h-3 w-3 mr-1" />
                {action.label}
              </Button>
            )
          })}
        </div>

        <Separator />

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {message.category && message.type === 'ai' && (
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(message.category)}`}>
                        {getCategoryIcon(message.category)}
                        <span className="ml-1 capitalize">{message.category}</span>
                      </Badge>
                    )}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about system architecture, data flows, scalability, or components..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}