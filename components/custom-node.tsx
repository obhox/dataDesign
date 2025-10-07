"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { ExternalLink } from "lucide-react"
import type { Part } from "@/lib/types"
import { ALL_COMPONENTS } from "@/lib/constants"

interface CustomNodeData extends Part {
  isSelected: boolean
  customComponents: any[]
}

export const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const getComponentByType = (typeId: string) => {
    const component = ALL_COMPONENTS.find((c) => c.id === typeId)
    if (component) return component
    const customComponent = data.customComponents?.find((c: any) => c.id === typeId)
    if (customComponent) return customComponent
    return ALL_COMPONENTS.find((c) => c.id === "frame")!
  }

  const component = getComponentByType(data.type)
  const Icon = component.icon

  return (
    <div className={`transition-all ${selected ? "scale-105" : ""}`}>
      <div
        className="rounded-2xl p-6 shadow-md border border-gray-200 min-w-[140px] relative bg-white"
        style={{
          backgroundColor: data.customColor || "#e0e7ff",
          boxShadow: selected ? "0 8px 16px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div className="text-center pointer-events-none">
          {data.imageUrl ? (
            <img
              src={data.imageUrl || "/placeholder.svg"}
              alt={data.name}
              className="w-12 h-12 mx-auto mb-3 rounded-lg object-cover"
            />
          ) : (
            <Icon size={28} className="mx-auto mb-3 text-gray-700" />
          )}
          <div className="font-semibold text-sm text-gray-900">{data.name}</div>
          {data.cost && selected && (
            <div className="text-xs text-gray-600 mt-1">
              {data.cost} {data.costUnit || "USD"}
            </div>
          )}
        </div>
        {data.sourceUrl && selected && (
          <a
            href={data.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors pointer-events-auto z-10"
            title="View source"
          >
            <ExternalLink size={14} className="text-blue-600" />
          </a>
        )}
        {/* Single prominent handle on the right side for connections */}
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !rounded-full hover:!scale-125 transition-transform !cursor-crosshair"
          title="Drag to connect"
        />
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !rounded-full"
        />
      </div>
    </div>
  )
})

CustomNode.displayName = "CustomNode"
