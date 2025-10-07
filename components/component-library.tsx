"use client"

import type React from "react"

import { ChevronDown, ChevronRight, Plus, Trash2, Wrench } from "lucide-react"
import { COMPONENT_CATEGORIES } from "@/lib/constants"
import type { Component } from "@/lib/types"

interface ComponentLibraryProps {
  expandedCategories: Record<string, boolean>
  customComponents: Component[]
  showAddComponent: boolean
  newComponent: { name: string; color: string }
  onToggleCategory: (categoryId: string) => void
  onComponentDragStart: (e: React.DragEvent, component: Component) => void
  onAddCustomComponent: () => void
  onDeleteCustomComponent: (id: string) => void
  onSetShowAddComponent: (show: boolean) => void
  onSetNewComponent: (component: { name: string; color: string }) => void
}

export function ComponentLibrary({
  expandedCategories,
  customComponents,
  showAddComponent,
  newComponent,
  onToggleCategory,
  onComponentDragStart,
  onAddCustomComponent,
  onDeleteCustomComponent,
  onSetShowAddComponent,
  onSetNewComponent,
}: ComponentLibraryProps) {
  return (
    <div className="">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Components</h2>
      {Object.entries(COMPONENT_CATEGORIES).map(([categoryId, category]) => {
        const CategoryIcon = category.icon
        const isExpanded = expandedCategories[categoryId]
        return (
          <div key={categoryId} className="mb-6">
            <button
              onClick={() => onToggleCategory(categoryId)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <CategoryIcon size={20} className="text-gray-700" />
                <span className="font-semibold text-gray-800">{category.name}</span>
              </div>
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {isExpanded && (
              <div className="mt-3 space-y-2 ml-2">
                {category.components.map((component) => {
                  const Icon = component.icon
                  return (
                    <div
                      key={component.id}
                      draggable
                      onDragStart={(e) => onComponentDragStart(e, component)}
                      className="border-2 border-gray-300 rounded-lg p-3 cursor-move hover:shadow-md transition-all flex items-center gap-3"
                      style={{ backgroundColor: component.customColor }}
                    >
                      <Icon size={20} className="text-gray-700" />
                      <span className="font-medium text-gray-800 text-sm">{component.name}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      <div className="mb-6 border-t-2 border-gray-300 pt-4">
        <button
          onClick={() => onToggleCategory("custom")}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Wrench size={20} className="text-gray-700" />
            <span className="font-semibold text-gray-800">Custom Parts</span>
          </div>
          {expandedCategories.custom ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        {expandedCategories.custom && (
          <div className="mt-3 space-y-2 ml-2">
            {customComponents.map((component) => {
              const Icon = component.icon
              return (
                <div
                  key={component.id}
                  className="relative border-2 border-gray-300 rounded-lg p-3 hover:shadow-md transition-all flex items-center gap-3"
                  style={{ backgroundColor: component.customColor }}
                >
                  <div
                    draggable
                    onDragStart={(e) => onComponentDragStart(e, component)}
                    className="flex items-center gap-3 flex-1 cursor-move"
                  >
                    <Icon size={20} className="text-gray-700" />
                    <span className="font-medium text-gray-800 text-sm">{component.name}</span>
                  </div>
                  <button
                    onClick={() => onDeleteCustomComponent(component.id)}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                    title="Delete custom component"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              )
            })}

            {showAddComponent ? (
              <div className="border-2 border-blue-300 rounded-lg p-3 bg-blue-50">
                <input
                  type="text"
                  placeholder="Component name"
                  value={newComponent.name}
                  onChange={(e) => onSetNewComponent({ ...newComponent, name: e.target.value })}
                  className="w-full px-2 py-1 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex gap-2 items-center mb-2">
                  <span className="text-xs text-gray-600">Color:</span>
                  <input
                    type="color"
                    value={newComponent.color}
                    onChange={(e) => onSetNewComponent({ ...newComponent, color: e.target.value })}
                    className="w-10 h-8 rounded cursor-pointer border border-gray-300"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onAddCustomComponent}
                    className="flex-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => onSetShowAddComponent(false)}
                    className="flex-1 px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onSetShowAddComponent(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-gray-600"
              >
                <Plus size={20} />
                <span className="font-medium text-sm">Create Custom Part</span>
              </button>
            )}
          </div>
        )}
      </div>


    </div>
  )
}
