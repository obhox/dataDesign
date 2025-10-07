"use client"

import { Plus } from "lucide-react"
import { LINK_TYPES } from "@/lib/constants"
import type { LinkType } from "@/lib/types"

interface LinkTypeSelectorProps {
  selectedLinkType: LinkType
  customLinkTypes: LinkType[]
  onSelectLinkType: (linkType: LinkType) => void
  showAddLinkType: boolean
  onSetShowAddLinkType: (show: boolean) => void
}

export function LinkTypeSelector({
  selectedLinkType,
  customLinkTypes,
  onSelectLinkType,
  showAddLinkType,
  onSetShowAddLinkType,
}: LinkTypeSelectorProps) {
  const allLinkTypes = [...LINK_TYPES, ...customLinkTypes]

  return (
    <div className="border-t border-gray-200 pt-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800">Link Types</h2>
        <button
          onClick={() => onSetShowAddLinkType(!showAddLinkType)}
          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="text-xs text-gray-600 mb-3">
        Selected: <span className="font-semibold">{selectedLinkType.name}</span>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {allLinkTypes.map((linkType) => (
          <div
            key={linkType.id}
            onClick={() => onSelectLinkType(linkType)}
            className={`border-2 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all ${selectedLinkType.id === linkType.id ? "bg-blue-50 border-blue-500" : "border-gray-300 bg-white"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-800">{linkType.name}</div>
                <div className="text-xs text-gray-500">{linkType.description}</div>
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
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}
