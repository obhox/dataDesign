"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import type { LinkType } from "@/lib/types"

interface CustomLinkTypeFormProps {
  onAddLinkType: (linkType: LinkType) => void
  onCancel: () => void
  existingLinkTypes: LinkType[]
}

export function CustomLinkTypeForm({ onAddLinkType, onCancel, existingLinkTypes }: CustomLinkTypeFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    color: "#3b82f6",
    strokeWidth: 2,
    dashArray: "",
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name required"
    } else if (existingLinkTypes.some(lt => lt.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = "Name exists"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const newLinkType: LinkType = {
      id: `custom-${Date.now()}`,
      name: formData.name.trim(),
      color: formData.color,
      strokeWidth: formData.strokeWidth,
      dashArray: formData.dashArray,
      description: formData.description.trim() || formData.name.trim(),
    }

    onAddLinkType(newLinkType)
  }

  const dashPatterns = [
    { value: "", label: "Solid" },
    { value: "5,5", label: "Dashed" },
    { value: "2,3", label: "Dotted" },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-800">Add Link Type</h3>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X size={12} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-2 py-1.5 border rounded text-sm ${
              errors.name ? "border-red-400" : "border-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-blue-400`}
            placeholder="Link name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
          
          <div className="flex gap-1">
            {dashPatterns.map((pattern) => (
              <label key={pattern.value} className="flex items-center gap-1 cursor-pointer text-xs">
                <input
                  type="radio"
                  name="dashArray"
                  value={pattern.value}
                  checked={formData.dashArray === pattern.value}
                  onChange={(e) => setFormData({ ...formData, dashArray: e.target.value })}
                  className="w-3 h-3"
                />
                <span>{pattern.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded p-2 bg-gray-50">
          <svg width="100%" height="16">
            <line
              x1="5"
              y1="8"
              x2="calc(100% - 5px)"
              y2="8"
              stroke={formData.color}
              strokeWidth={formData.strokeWidth}
              strokeDasharray={formData.dashArray}
            />
          </svg>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
          >
            <Check size={12} />
            Add
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}