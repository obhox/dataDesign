"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Loader2,
  Wrench,
  BarChart3
} from 'lucide-react'
import type { Part, Connection } from '@/lib/types'

interface Suggestion {
  id: string
  type: 'optimization' | 'part' | 'process' | 'warning'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  category: string
  actionable: boolean
}

interface AISuggestionsPanelProps {
  parts: Part[]
  connections: Connection[]
  onApplySuggestion?: (suggestion: Suggestion) => void
  onDismissSuggestion?: (suggestionId: string) => void
}

export function AISuggestionsPanel({ 
  parts, 
  connections, 
  onApplySuggestion,
  onDismissSuggestion 
}: AISuggestionsPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastAnalyzed, setLastAnalyzed] = useState<string>('')

  // Generate suggestions when parts or connections change
  useEffect(() => {
    const currentState = JSON.stringify({ parts: parts.length, connections: connections.length })
    if (currentState !== lastAnalyzed && parts.length > 0) {
      generateSuggestions()
      setLastAnalyzed(currentState)
    }
  }, [parts, connections, lastAnalyzed])

  const generateSuggestions = async () => {
    if (parts.length === 0) return

    setIsLoading(true)
    try {
      // Generate different types of suggestions
      const [processSuggestions, partSuggestions, efficiencyAnalysis] = await Promise.all([
        generateProcessSuggestions(),
        generatePartSuggestions(),
        generateEfficiencyAnalysis()
      ])

      const allSuggestions = [
        ...processSuggestions,
        ...partSuggestions,
        ...efficiencyAnalysis
      ]

      setSuggestions(allSuggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateProcessSuggestions = async (): Promise<Suggestion[]> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Generate 2-3 specific process optimization suggestions',
          category: 'suggestion',
          parts,
          connections
        })
      })

      if (response.ok) {
        const data = await response.json()
        return parseAISuggestions(data.response, 'process')
      }
    } catch (error) {
      console.error('Error generating process suggestions:', error)
    }
    return []
  }

  const generatePartSuggestions = async (): Promise<Suggestion[]> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Suggest 1-2 additional parts that would improve this system',
          category: 'suggestion',
          parts,
          connections
        })
      })

      if (response.ok) {
        const data = await response.json()
        return parseAISuggestions(data.response, 'part')
      }
    } catch (error) {
      console.error('Error generating part suggestions:', error)
    }
    return []
  }

  const generateEfficiencyAnalysis = async (): Promise<Suggestion[]> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Identify 1-2 potential efficiency issues or bottlenecks',
          category: 'analysis',
          parts,
          connections
        })
      })

      if (response.ok) {
        const data = await response.json()
        return parseAISuggestions(data.response, 'optimization')
      }
    } catch (error) {
      console.error('Error generating efficiency analysis:', error)
    }
    return []
  }

  const parseAISuggestions = (aiResponse: string, type: Suggestion['type']): Suggestion[] => {
    // Simple parsing logic - in a real app, you might want more sophisticated parsing
    const lines = aiResponse.split('\n').filter(line => line.trim())
    const suggestions: Suggestion[] = []

    let currentSuggestion: Partial<Suggestion> = {}
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Look for numbered items or bullet points
      if (trimmedLine.match(/^\d+\./) || trimmedLine.match(/^[-•*]/)) {
        // Save previous suggestion if exists
        if (currentSuggestion.title) {
          suggestions.push({
            id: `${type}-${suggestions.length}`,
            type,
            title: currentSuggestion.title || '',
            description: currentSuggestion.description || '',
            impact: determineImpact(currentSuggestion.description || ''),
            category: type,
            actionable: true
          })
        }
        
        // Start new suggestion
        currentSuggestion = {
          title: trimmedLine.replace(/^\d+\.|\s*[-•*]\s*/, '').substring(0, 60) + '...',
          description: trimmedLine
        }
      } else if (trimmedLine && currentSuggestion.title) {
        // Add to description
        currentSuggestion.description += ' ' + trimmedLine
      }
    })

    // Add the last suggestion
    if (currentSuggestion.title) {
      suggestions.push({
        id: `${type}-${suggestions.length}`,
        type,
        title: currentSuggestion.title,
        description: currentSuggestion.description || '',
        impact: determineImpact(currentSuggestion.description || ''),
        category: type,
        actionable: true
      })
    }

    return suggestions.slice(0, 3) // Limit to 3 suggestions per type
  }

  const determineImpact = (description: string): 'low' | 'medium' | 'high' => {
    const highImpactKeywords = ['critical', 'major', 'significant', 'bottleneck', 'failure']
    const mediumImpactKeywords = ['improve', 'optimize', 'enhance', 'reduce', 'increase']
    
    const lowerDesc = description.toLowerCase()
    
    if (highImpactKeywords.some(keyword => lowerDesc.includes(keyword))) {
      return 'high'
    } else if (mediumImpactKeywords.some(keyword => lowerDesc.includes(keyword))) {
      return 'medium'
    }
    return 'low'
  }

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="h-4 w-4" />
      case 'part': return <Wrench className="h-4 w-4" />
      case 'process': return <BarChart3 className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: Suggestion['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
    }
  }

  const handleApplySuggestion = (suggestion: Suggestion) => {
    onApplySuggestion?.(suggestion)
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
  }

  const handleDismissSuggestion = (suggestionId: string) => {
    onDismissSuggestion?.(suggestionId)
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
  }

  if (parts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Add some parts to your prototyping system to get AI-powered suggestions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Suggestions
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Analyzing your system...</span>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Your system looks good! No immediate suggestions.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateSuggestions}
              className="mt-2"
            >
              Refresh Analysis
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSuggestionIcon(suggestion.type)}
                      <span className="font-medium text-sm">{suggestion.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getImpactColor(suggestion.impact)}`}
                      >
                        {suggestion.impact}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismissSuggestion(suggestion.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                    {suggestion.description}
                  </p>
                  
                  {suggestion.actionable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="text-xs"
                    >
                      Apply Suggestion
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        <Separator className="my-3" />
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateSuggestions}
          disabled={isLoading}
          className="w-full text-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Refresh Suggestions'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}