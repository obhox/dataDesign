"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Wrench } from "lucide-react"
import { ReactFlowProvider } from "@xyflow/react"
import type { Part, Connection, LinkType, Component, HistoryState } from "@/lib/types"
import { LINK_TYPES, SAMPLE_DATA } from "@/lib/constants"
import { exportAsJSON, exportBOM } from "@/lib/utils/export"
import { Toolbar } from "./toolbar"
import { Canvas } from "./canvas"
import { ComponentLibrary } from "./component-library"
import { LinkTypeSelector } from "./link-type-selector"
import { PartEditor } from "./part-editor"
import { AIChat } from "./ai-chat"
import { AISuggestionsPanel } from "./ai-suggestions-panel"

export default function PrototypingMindMap() {
  const [parts, setParts] = useState<Part[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [selectedLinkType, setSelectedLinkType] = useState<LinkType>(LINK_TYPES[0])
  const [customLinkTypes, setCustomLinkTypes] = useState<LinkType[]>([])
  const [showAddLinkType, setShowAddLinkType] = useState(false)
  const [visibleLinkTypes, setVisibleLinkTypes] = useState<Set<string>>(
    new Set([...LINK_TYPES.map(lt => lt.id)])
  )
  const [searchingImage, setSearchingImage] = useState(false)
  const [imageResults, setImageResults] = useState<string[]>([])
  const [showImageResults, setShowImageResults] = useState(false)
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [expandedCategories, setExpandedCategories] = useState({
    mechanical: false,
    electrical: false,
    control: false,
    hydraulic: false,
    custom: false,
  })
  const [customComponents, setCustomComponents] = useState<Component[]>([])
  const [showAddComponent, setShowAddComponent] = useState(false)
  const [newComponent, setNewComponent] = useState({ name: "", color: "#f3f4f6" })
  const [arrangementMode, setArrangementMode] = useState<'hierarchical' | 'spatial' | 'grid'>('hierarchical')
  const [showAIChat, setShowAIChat] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId as keyof typeof prev] }))
  }

  const addCustomComponent = () => {
    if (newComponent.name.trim()) {
      const customComp: Component = {
        id: `custom-${Date.now()}`,
        name: newComponent.name,
        icon: Wrench,
        customColor: newComponent.color,
      }
      setCustomComponents([...customComponents, customComp])
      setNewComponent({ name: "", color: "#f3f4f6" })
      setShowAddComponent(false)
    }
  }

  const deleteCustomComponent = (id: string) => {
    setCustomComponents(customComponents.filter((c) => c.id !== id))
  }

  const saveToHistory = (newParts: Part[], newConnections: Connection[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({
      parts: JSON.parse(JSON.stringify(newParts)),
      connections: JSON.parse(JSON.stringify(newConnections)),
    })
    if (newHistory.length > 50) newHistory.shift()
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      setParts(JSON.parse(JSON.stringify(prevState.parts)))
      setConnections(JSON.parse(JSON.stringify(prevState.connections)))
      setHistoryIndex(historyIndex - 1)
      setSelectedPart(null)
      setSelectedConnection(null)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      setParts(JSON.parse(JSON.stringify(nextState.parts)))
      setConnections(JSON.parse(JSON.stringify(nextState.connections)))
      setHistoryIndex(historyIndex + 1)
      setSelectedPart(null)
      setSelectedConnection(null)
    }
  }

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setParts(data.parts || [])
          setConnections(data.connections || [])
          setCustomLinkTypes(data.customLinkTypes || [])
          setCustomComponents(data.customComponents || [])
          saveToHistory(data.parts || [], data.connections || [])
        } catch (error) {
          alert("Error loading file")
        }
      }
      reader.readAsText(file)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [historyIndex, history])

  const handleComponentDragStart = (e: React.DragEvent, component: Component) => {
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData("component", JSON.stringify(component))
  }

  const handlePartsChange = (newParts: Part[]) => {
    setParts(newParts)
    saveToHistory(newParts, connections)
  }

  const handleConnectionsChange = (newConnections: Connection[]) => {
    setConnections(newConnections)
    saveToHistory(parts, newConnections)
  }

  const deletePart = (id: number) => {
    const newParts = parts.filter((p) => p.id !== id)
    const newConnections = connections.filter((c) => c.from !== id && c.to !== id)
    setParts(newParts)
    setConnections(newConnections)
    saveToHistory(newParts, newConnections)
    if (selectedPart?.id === id) setSelectedPart(null)
  }

  const updatePartProperty = (id: number, property: string, value: any) => {
    const newParts = parts.map((p) => (p.id === id ? { ...p, [property]: value } : p))
    setParts(newParts)
    if (selectedPart?.id === id) setSelectedPart({ ...selectedPart, [property]: value })
  }

  const savePartEdits = () => {
    if (selectedPart) {
      saveToHistory(parts, connections)
    }
  }

  const loadSample = () => {
    setParts(SAMPLE_DATA.parts as Part[])
    setConnections(SAMPLE_DATA.connections as Connection[])
    saveToHistory(SAMPLE_DATA.parts as Part[], SAMPLE_DATA.connections as Connection[])
  }

  const searchImage = async () => {
    if (!selectedPart?.name) return
    setSearchingImage(true)
    setShowImageResults(true)
    setImageResults([`https://via.placeholder.com/200x200/4A90E2/ffffff?text=${encodeURIComponent(selectedPart.name)}`])
    setSearchingImage(false)
  }

  const selectImage = (url: string) => {
    if (selectedPart) {
      updatePartProperty(selectedPart.id, "imageUrl", url)
      setShowImageResults(false)
      setImageResults([])
    }
  }

  const toggleLinkTypeVisibility = (linkTypeId: string) => {
    const newVisibleLinkTypes = new Set(visibleLinkTypes)
    if (newVisibleLinkTypes.has(linkTypeId)) {
      newVisibleLinkTypes.delete(linkTypeId)
    } else {
      newVisibleLinkTypes.add(linkTypeId)
    }
    setVisibleLinkTypes(newVisibleLinkTypes)
  }

  const autoArrangeParts = () => {
    if (parts.length === 0) return

    let newParts: Part[]

    if (arrangementMode === 'hierarchical') {
      // Hierarchical arrangement - optimized for connection visualization
      const connectionCounts = new Map<string, number>()
      
      // Count connections for each part
      parts.forEach(part => {
        const count = connections.filter(conn => 
          conn.from === part.id || conn.to === part.id
        ).length
        connectionCounts.set(part.id.toString(), count)
      })
      
      // Sort parts by connection count (most connected first)
      const sortedParts = [...parts].sort((a, b) => 
        (connectionCounts.get(b.id.toString()) || 0) - (connectionCounts.get(a.id.toString()) || 0)
      )
      
      // Create hierarchical layout
      const levels = Math.ceil(Math.sqrt(parts.length))
      const levelHeight = 250
      const startY = 100
      const centerX = 400
      
      newParts = sortedParts.map((part, index) => {
        const level = Math.floor(index / levels)
        const positionInLevel = index % levels
        const levelWidth = Math.min(levels, sortedParts.length - level * levels)
        const spacing = Math.max(200, 800 / levelWidth)
        const startX = centerX - (levelWidth - 1) * spacing / 2
        
        return {
          ...part,
          x: startX + positionInLevel * spacing,
          y: startY + level * levelHeight,
        }
      })
      
      // Switch to spatial mode for next click
      setArrangementMode('spatial')
    } else if (arrangementMode === 'spatial') {
      // Spatial/circular arrangement
      const centerX = 400
      const centerY = 300
      const radius = Math.max(150, parts.length * 20) // Dynamic radius based on part count
      
      newParts = parts.map((part, index) => {
        const angle = (index / parts.length) * 2 * Math.PI
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        
        return {
          ...part,
          x,
          y,
        }
      })
      
      // Switch to grid mode for next click
      setArrangementMode('grid')
    } else {
      // Grid arrangement
      const gridSize = Math.ceil(Math.sqrt(parts.length))
      const spacing = 200
      const startX = 100
      const startY = 100

      newParts = parts.map((part, index) => {
        const row = Math.floor(index / gridSize)
        const col = index % gridSize
        
        return {
          ...part,
          x: startX + col * spacing,
          y: startY + row * spacing,
        }
      })
      
      // Switch to hierarchical mode for next click
      setArrangementMode('hierarchical')
    }

    setParts(newParts)
    saveToHistory(newParts, connections)
  }

  return (
    <ReactFlowProvider>
      <div className="w-full h-screen bg-white relative overflow-hidden">
        <Toolbar
          onLoadSample={loadSample}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onExportJSON={() => exportAsJSON(parts, connections, customLinkTypes, customComponents)}
          onImportJSON={importFromJSON}
          onExportBOM={() => exportBOM(parts)}
          onAutoArrange={autoArrangeParts}
          parts={parts}
          onToggleAIChat={() => setShowAIChat(!showAIChat)}
          showAIChat={showAIChat}
        />

        <Canvas
          parts={parts}
          connections={connections.filter(conn => visibleLinkTypes.has(conn.linkType))}
          selectedPart={selectedPart}
          selectedConnection={selectedConnection}
          selectedLinkType={selectedLinkType}
          customComponents={customComponents}
          onPartsChange={handlePartsChange}
          onConnectionsChange={handleConnectionsChange}
          onPartSelect={setSelectedPart}
          onConnectionSelect={setSelectedConnection}
          onCanvasDrop={() => {}}
        />

        <div className="absolute top-0 right-0 w-64 h-full bg-white border-l border-gray-200 shadow-2xl overflow-y-auto z-10 p-4">
          <div className="space-y-4">
            <ComponentLibrary
              expandedCategories={expandedCategories}
              customComponents={customComponents}
              showAddComponent={showAddComponent}
              newComponent={newComponent}
              onToggleCategory={toggleCategory}
              onComponentDragStart={handleComponentDragStart}
              onAddCustomComponent={addCustomComponent}
              onDeleteCustomComponent={deleteCustomComponent}
              onSetShowAddComponent={setShowAddComponent}
              onSetNewComponent={setNewComponent}
            />
            <LinkTypeSelector
              selectedLinkType={selectedLinkType}
              customLinkTypes={customLinkTypes}
              onSelectLinkType={setSelectedLinkType}
              showAddLinkType={showAddLinkType}
              onSetShowAddLinkType={setShowAddLinkType}
              visibleLinkTypes={visibleLinkTypes}
              onToggleLinkTypeVisibility={toggleLinkTypeVisibility}
            />
            <AISuggestionsPanel
              parts={parts}
              connections={connections}
              onApplySuggestion={(suggestion) => {
                console.log('Applying suggestion:', suggestion)
                // Handle suggestion application logic here
              }}
              onDismissSuggestion={(suggestionId) => {
                console.log('Dismissing suggestion:', suggestionId)
              }}
            />
          </div>
        </div>

        {selectedPart && (
          <PartEditor
            part={selectedPart}
            onUpdateProperty={updatePartProperty}
            onDelete={deletePart}
            onClose={() => {
              savePartEdits()
              setSelectedPart(null)
            }}
            onSearchImage={searchImage}
            searchingImage={searchingImage}
            showImageResults={showImageResults}
            imageResults={imageResults}
            onSelectImage={selectImage}
            onCancelImageSearch={() => {
              setShowImageResults(false)
              setImageResults([])
            }}
          />
        )}

        {showAIChat && (
          <div className="absolute bottom-4 right-4 w-96 h-96 z-30">
            <AIChat
              parts={parts}
              connections={connections}
              onSuggestionApply={(suggestion) => {
                // Handle AI suggestions here if needed
                console.log('AI Suggestion:', suggestion)
              }}
            />
          </div>
        )}
      </div>
    </ReactFlowProvider>
  )
}
