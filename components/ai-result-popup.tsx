"use client"

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, Lightbulb, Copy, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface AIResult {
  id: string
  type: 'success' | 'error' | 'info' | 'suggestion'
  title: string
  content: string
  timestamp: Date
  category?: 'analysis' | 'optimization' | 'troubleshooting' | 'suggestion'
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'default' | 'outline' | 'secondary'
  }>
  data?: any // Additional data that can be used by actions
}

interface AIResultPopupProps {
  result: AIResult | null
  isVisible: boolean
  onClose: () => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  autoHide?: boolean
  autoHideDelay?: number
}

const getIcon = (type: AIResult['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />
    case 'suggestion':
      return <Lightbulb className="h-5 w-5 text-yellow-500" />
    default:
      return <Info className="h-5 w-5 text-gray-500" />
  }
}

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'analysis':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'optimization':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'troubleshooting':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'suggestion':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getPositionClasses = (position: AIResultPopupProps['position']) => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4'
    case 'top-right':
      return 'top-4 right-4'
    case 'bottom-left':
      return 'bottom-4 left-4'
    case 'bottom-right':
      return 'bottom-4 right-4'
    case 'center':
      return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    default:
      return 'top-4 right-4'
  }
}

export function AIResultPopup({
  result,
  isVisible,
  onClose,
  position = 'top-right',
  autoHide = false,
  autoHideDelay = 5000
}: AIResultPopupProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible && result) {
      setIsAnimating(true)
      
      if (autoHide && result.type !== 'error') {
        const timer = setTimeout(() => {
          onClose()
        }, autoHideDelay)
        
        return () => clearTimeout(timer)
      }
    } else {
      setIsAnimating(false)
    }
  }, [isVisible, result, autoHide, autoHideDelay, onClose])

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.content)
    }
  }

  const downloadResult = () => {
    if (result) {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ai-result-${result.id}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (!isVisible || !result) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed z-50 w-96 max-w-[calc(100vw-2rem)]',
        getPositionClasses(position),
        'transition-all duration-300 ease-in-out',
        isAnimating
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      )}
    >
      <Card className="shadow-lg border-2 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              {getIcon(result.type)}
              <CardTitle className="text-sm font-medium line-clamp-2">
                {result.title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            {result.category && (
              <Badge
                variant="outline"
                className={cn('text-xs', getCategoryColor(result.category))}
              >
                {result.category}
              </Badge>
            )}
            <span className="text-xs text-gray-500">
              {result.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <ScrollArea className="max-h-48 mb-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {result.content}
            </p>
          </ScrollArea>

          {(result.actions && result.actions.length > 0) && (
            <>
              <Separator className="mb-3" />
              <div className="flex flex-wrap gap-2">
                {result.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'default'}
                    size="sm"
                    onClick={action.action}
                    className="text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </>
          )}

          <Separator className="my-3" />
          
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-7 px-2 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadResult}
                className="h-7 px-2 text-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
            
            {autoHide && result.type !== 'error' && (
              <span className="text-xs text-gray-400">
                Auto-hide in {Math.ceil(autoHideDelay / 1000)}s
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for managing AI result popups
export function useAIResultPopup() {
  const [result, setResult] = useState<AIResult | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const showResult = (newResult: AIResult) => {
    setResult(newResult)
    setIsVisible(true)
  }

  const hideResult = () => {
    setIsVisible(false)
    // Clear result after animation completes
    setTimeout(() => setResult(null), 300)
  }

  const createResult = (
    type: AIResult['type'],
    title: string,
    content: string,
    options?: Partial<Omit<AIResult, 'id' | 'type' | 'title' | 'content' | 'timestamp'>>
  ): AIResult => {
    return {
      id: `ai-result-${Date.now()}`,
      type,
      title,
      content,
      timestamp: new Date(),
      ...options
    }
  }

  return {
    result,
    isVisible,
    showResult,
    hideResult,
    createResult
  }
}