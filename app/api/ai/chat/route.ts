import { NextRequest, NextResponse } from 'next/server'
import { geminiAI } from '@/lib/ai/gemini'
import type { Part, Connection } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { message, category, parts, connections, designType } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Google Gemini API key is not configured' },
        { status: 500 }
      )
    }

    let response: string
    let designData: any = null

    // Route to appropriate AI service method based on category
    switch (category) {
      case 'analysis':
        response = await geminiAI.analyzeWorkflowEfficiency(parts || [], connections || [])
        break
      
      case 'suggestion':
        if (message.toLowerCase().includes('part')) {
          response = await geminiAI.generatePartRecommendations(parts || [], message)
        } else {
          response = await geminiAI.generateProcessSuggestions(parts || [], connections || [])
        }
        break
      
      case 'troubleshooting':
        response = await geminiAI.generateTroubleshootingSuggestions(message, parts || [])
        break
      
      case 'designGeneration':
        const result = await geminiAI.generateDesign(message, designType)
        response = result.description
        designData = {
          parts: result.parts,
          connections: result.connections
        }
        break
      
      default:
        response = await geminiAI.generatePrototypingAdvice(message, {
          parts: parts || [],
          connections: connections || []
        })
        break
    }

    return NextResponse.json({ 
      response,
      ...(designData && { designData })
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    
    // Return a more specific error message based on the error type
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid or missing API key. Please check your Gemini API configuration.' },
          { status: 401 }
        )
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to process AI request. Please try again.' },
      { status: 500 }
    )
  }
}