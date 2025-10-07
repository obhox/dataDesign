"use client"

import { Plus, Eye, EyeOff } from "lucide-react"
import { LINK_TYPES } from "@/lib/constants"
import type { LinkType } from "@/lib/types"

interface LinkTypeSelectorProps {
  selectedLinkType: LinkType
  customLinkTypes: LinkType[]
  onSelectLinkType: (linkType: LinkType) => void
  showAddLinkType: boolean
  onSetShowAddLinkType: (show: boolean) => void
  visibleLinkTypes: Set<string>
  onToggleLinkTypeVisibility: (linkTypeId: string) => void
}

export function LinkTypeSelector({
  selectedLinkType,
  customLinkTypes,
  onSelectLinkType,
  showAddLinkType,
  onSetShowAddLinkType,
  visibleLinkTypes,
  onToggleLinkTypeVisibility,
}: LinkTypeSelectorProps) {
  const allLinkTypes = [...LINK_TYPES, ...customLinkTypes]

  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Link Types</h2>
        <button
          onClick={() => onSetShowAddLinkType(!showAddLinkType)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="text-xs text-gray-600 mb-4">
        Selected: <span className="font-semibold">{selectedLinkType.name}</span>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {allLinkTypes.map((linkType) => {
          const isVisible = visibleLinkTypes.has(linkType.id)
          return (
            <div
              key={linkType.id}
              className={`border-2 rounded-lg p-3 transition-all ${selectedLinkType.id === linkType.id ? "bg-blue-50 border-blue-500" : "border-gray-300 bg-white"} ${!isVisible ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">{linkType.name}</div>
                  <div className="text-xs text-gray-500">{linkType.description}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => onToggleLinkTypeVisibility(linkType.id)}
                    className={`p-1 rounded hover:bg-gray-100 ${isVisible ? "text-blue-600" : "text-gray-400"}`}
                    title={isVisible ? "Hide connections" : "Show connections"}
                  >
                    {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => onSelectLinkType(linkType)}
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                    title="Select for new connections"
                  >
                    <div className="w-4 h-4 border-2 border-current rounded-full" />
                  </button>
                </div>
              </div>
              <svg width="100%" height="20">
                <line
                  x1="0"
                  y1="10"
                  x2="100%"
                  y2="10"
                  stroke={linkType.color}
                  strokeWidth={linkType.strokeWidth}
                  strokeDasharray={linkType.dashArray}
                  opacity={isVisible ? 1 : 0.3}
                />
              </svg>
            </div>
          )
        })}
      </div>
    </div>
  )
}
