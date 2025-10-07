"use client"

import type React from "react"

import { useCallback, useEffect } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection as FlowConnection,
  type Node,
  type Edge,
  type NodeChange,
  type NodeTypes,
  ConnectionLineType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { Part, Connection, Component } from "@/lib/types"
import { CustomNode } from "./custom-node"
import { CustomEdge } from "./custom-edge"

interface CanvasProps {
  parts: Part[]
  connections: Connection[]
  selectedPart: Part | null
  selectedConnection: Connection | null
  selectedLinkType: any
  customComponents: Component[]
  onPartsChange: (parts: Part[]) => void
  onConnectionsChange: (connections: Connection[]) => void
  onPartSelect: (part: Part | null) => void
  onConnectionSelect: (conn: Connection | null) => void
  onCanvasDrop: (e: React.DragEvent) => void
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

export function Canvas({
  parts,
  connections,
  selectedPart,
  selectedConnection,
  selectedLinkType,
  customComponents,
  onPartsChange,
  onConnectionsChange,
  onPartSelect,
  onConnectionSelect,
  onCanvasDrop,
}: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { screenToFlowPosition } = useReactFlow()

  useEffect(() => {
    const newNodes: Node[] = parts.map((part) => ({
      id: part.id.toString(),
      type: "custom",
      position: { x: part.x || 0, y: part.y || 0 },
      data: { ...part, isSelected: selectedPart?.id === part.id, customComponents },
    }))
    setNodes(newNodes)
  }, [parts, selectedPart, customComponents, setNodes])

  useEffect(() => {
    const newEdges: Edge[] = connections.map((conn) => ({
      id: conn.id.toString(),
      source: conn.from.toString(),
      target: conn.to.toString(),
      type: "custom",
      data: { ...conn },
      style: {
        stroke: conn.color || "#3b82f6",
        strokeWidth: conn.strokeWidth || 2,
        strokeDasharray: conn.dashArray || "",
      },
      markerEnd: {
        type: "arrowclosed" as const,
        color: conn.color || "#3b82f6",
        width: 20,
        height: 20,
      },
      selected: selectedConnection?.id === conn.id,
    }))
    setEdges(newEdges)
  }, [connections, selectedConnection, setEdges])

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes)

      const positionChanges = changes.filter(
        (change) => change.type === "position" && (change as any).dragging === false && (change as any).position,
      )

      if (positionChanges.length > 0) {
        const updatedParts = parts.map((part) => {
          const change = positionChanges.find((c) => (c as any).id === part.id.toString()) as any
          if (change?.position) {
            return {
              ...part,
              x: change.position.x,
              y: change.position.y,
            }
          }
          return part
        })
        onPartsChange(updatedParts)
      }
    },
    [onNodesChange, parts, onPartsChange],
  )

  const onConnect = useCallback(
    (connection: FlowConnection) => {
      console.log("[v0] Connection created:", connection)
      const fromId = Number.parseInt(connection.source)
      const toId = Number.parseInt(connection.target)

      const newConnection: Connection = {
        from: fromId,
        to: toId,
        id: Date.now(),
        linkType: selectedLinkType.id,
        color: selectedLinkType.color,
        strokeWidth: selectedLinkType.strokeWidth,
        dashArray: selectedLinkType.dashArray,
      }
      console.log("[v0] Adding new connection:", newConnection)
      onConnectionsChange([...connections, newConnection])
    },
    [connections, selectedLinkType, onConnectionsChange],
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const part = parts.find((p) => p.id.toString() === node.id)
      onPartSelect(part || null)
      onConnectionSelect(null)
    },
    [parts, onPartSelect, onConnectionSelect],
  )

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      const conn = connections.find((c) => c.id.toString() === edge.id)
      onConnectionSelect(conn || null)
      onPartSelect(null)
    },
    [connections, onConnectionSelect, onPartSelect],
  )

  const onPaneClick = useCallback(() => {
    onPartSelect(null)
    onConnectionSelect(null)
  }, [onPartSelect, onConnectionSelect])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const componentData = event.dataTransfer.getData("component")
      if (componentData) {
        const component = JSON.parse(componentData)
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })

        const newPart: Part = {
          id: Date.now(),
          type: component.id,
          name: component.name,
          customColor: component.customColor || "#e0e7ff",
          functionality: "",
          imageUrl: "",
          cost: "",
          costUnit: "USD",
          quantity: 1,
          sourceUrl: "",
          x: position.x,
          y: position.y,
        }

        onPartsChange([...parts, newPart])
      }
    },
    [screenToFlowPosition, parts, onPartsChange],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  return (
    <div className="w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        minZoom={0.3}
        maxZoom={3}
        defaultEdgeOptions={{
          type: "custom",
        }}
        connectionLineType={ConnectionLineType.Bezier}
        connectionLineStyle={{
          stroke: selectedLinkType.color,
          strokeWidth: selectedLinkType.strokeWidth || 2,
          strokeDasharray: selectedLinkType.dashArray,
        }}
      >
        <Background />
        <Controls />
        <MiniMap nodeColor={(node) => (node.data as any).customColor || "#e0e7ff"} />
      </ReactFlow>
      {parts.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🏭</div>
            <div className="text-xl mb-2">Drag components from the right panel</div>
            <div className="text-sm">or click &quot;Load Sample&quot;</div>
          </div>
        </div>
      )}
    </div>
  )
}
