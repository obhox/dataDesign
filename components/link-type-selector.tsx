"use client"

import { useState } from "react"
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react"
import { LINK_TYPES } from "@/lib/constants"
import type { LinkType } from "@/lib/types"
import { CustomLinkTypeForm } from "./custom-link-type-form"

interface LinkTypeSelectorProps {
  selectedLinkType: LinkType | null
  onSelectLinkType: (linkType: LinkType) => void
  customLinkTypes: LinkType[]
  showAddLinkType: boolean
  onSetShowAddLinkType: (show: boolean) => void
  visibleLinkTypes: Set<string>
  onToggleLinkTypeVisibility: (linkTypeId: string) => void
  onAddCustomLinkType: (linkType: LinkType) => void
  onDeleteCustomLinkType: (linkTypeId: string) => void
}

export function LinkTypeSelector({
  selectedLinkType,
  onSelectLinkType,
  customLinkTypes,
  showAddLinkType,
  onSetShowAddLinkType,
  visibleLinkTypes,
  onToggleLinkTypeVisibility,
  onAddCustomLinkType,
  onDeleteCustomLinkType,
}: LinkTypeSelectorProps) {
  const allLinkTypes = [...LINK_TYPES, ...customLinkTypes]

  const handleAddLinkType = (linkType: LinkType) => {
    onAddCustomLinkType(linkType)
    onSetShowAddLinkType(false)
  }

  const handleDeleteCustomLinkType = (linkTypeId: string) => {
    if (confirm("Delete this custom link type?")) {
      onDeleteCustomLinkType(linkTypeId)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-800">Link Types</h3>
        <button
          onClick={() => onSetShowAddLinkType(!showAddLinkType)}
          className="p-1.5 hover:bg-gray-100 rounded text-blue-600"
          title="Add custom link type"
        >
          <Plus size={16} />
        </button>
      </div>

      {showAddLinkType && (
        <div className="mb-3">
          <CustomLinkTypeForm
            onAddLinkType={handleAddLinkType}
            onCancel={() => onSetShowAddLinkType(false)}
            existingLinkTypes={allLinkTypes}
          />
        </div>
      )}

      <div className="space-y-1 max-h-64 overflow-y-auto">
        {allLinkTypes.map((linkType) => {
          const isCustom = customLinkTypes.some(ct => ct.id === linkType.id)
          const isVisible = visibleLinkTypes.has(linkType.id)
          const isSelected = selectedLinkType?.id === linkType.id

          return (
            <div
              key={linkType.id}
              className={`flex items-start gap-2 p-3 rounded cursor-pointer transition-colors ${
                isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
              }`}
            >
              <button
                onClick={() => onToggleLinkTypeVisibility(linkType.id)}
                className="p-0.5 hover:bg-gray-200 rounded mt-0.5 flex-shrink-0"
                title={isVisible ? "Hide" : "Show"}
              >
                {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>

              <div
                 onClick={() => onSelectLinkType(linkType)}
                 className="flex-1 flex flex-col gap-1.5"
               >
                 <div className="flex items-center gap-2">
                   <span className="text-sm font-medium truncate">{linkType.name}</span>
                   {isCustom && (
                     <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded flex-shrink-0">
                       Custom
                     </span>
                   )}
                 </div>
                 <svg width="100%" height="16" className="min-w-0">
                   <line
                     x1="4"
                     y1="8"
                     x2="calc(100% - 4px)"
                     y2="8"
                     stroke={linkType.color}
                     strokeWidth={Math.min(linkType.strokeWidth, 4)}
                     strokeDasharray={linkType.dashArray}
                   />
                 </svg>
                 <div className="text-xs text-gray-500 truncate leading-tight">{linkType.description}</div>
               </div>

              {isCustom && (
                <button
                  onClick={() => handleDeleteCustomLinkType(linkType.id)}
                  className="p-0.5 hover:bg-red-100 rounded text-red-600 mt-0.5 flex-shrink-0"
                  title="Delete custom link type"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
