"use client"

import { Trash2, ExternalLink, Search } from "lucide-react"
import type { Part } from "@/lib/types"

interface PartEditorProps {
  part: Part
  onUpdateProperty: (id: number, property: string, value: any) => void
  onDelete: (id: number) => void
  onClose: () => void
  onSearchImage: () => void
  searchingImage: boolean
  showImageResults: boolean
  imageResults: string[]
  onSelectImage: (url: string) => void
  onCancelImageSearch: () => void
}

export function PartEditor({
  part,
  onUpdateProperty,
  onDelete,
  onClose,
  onSearchImage,
  searchingImage,
  showImageResults,
  imageResults,
  onSelectImage,
  onCancelImageSearch,
}: PartEditorProps) {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-white rounded-xl shadow-2xl p-6 w-96 border border-gray-200 max-h-[80vh] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Component</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">NAME</label>
          <input
            type="text"
            value={part.name}
            onChange={(e) => onUpdateProperty(part.id, "name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">FUNCTIONALITY</label>
          <textarea
            value={part.functionality || ""}
            onChange={(e) => onUpdateProperty(part.id, "functionality", e.target.value)}
            placeholder="Describe what this part does..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">TECHNOLOGY</label>
          <input
            type="text"
            value={part.technology || ""}
            onChange={(e) => onUpdateProperty(part.id, "technology", e.target.value)}
            placeholder="e.g., PostgreSQL 15, Node.js 20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">VERSION</label>
          <input
            type="text"
            value={part.version || ""}
            onChange={(e) => onUpdateProperty(part.id, "version", e.target.value)}
            placeholder="e.g., v2.1.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">CAPACITY / THROUGHPUT</label>
          <input
            type="text"
            value={part.capacity || ""}
            onChange={(e) => onUpdateProperty(part.id, "capacity", e.target.value)}
            placeholder="e.g., 1000 req/s, 100GB storage"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">SLA (OPTIONAL)</label>
          <input
            type="text"
            value={part.sla || ""}
            onChange={(e) => onUpdateProperty(part.id, "sla", e.target.value)}
            placeholder="e.g., 99.9% uptime"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-2">COLOR</label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={part.customColor || "#e0e7ff"}
              onChange={(e) => {
                const color = e.target.value
                onUpdateProperty(part.id, "customColor", color)
              }}
              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              title="Pick custom color"
            />
            <div className="flex-1 flex gap-2 flex-wrap">
              {["#e0e7ff", "#dbeafe", "#d1fae5", "#fef3c7", "#fee2e2", "#f3e8ff", "#fce7f3", "#ffedd5"].map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdateProperty(part.id, "customColor", color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-lg border-2 border-gray-300 transition-all ${part.customColor === color ? "ring-2 ring-gray-700 scale-110" : "hover:scale-105"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-2">IMAGE</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={part.imageUrl || ""}
              onChange={(e) => onUpdateProperty(part.id, "imageUrl", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={onSearchImage}
              disabled={searchingImage}
              className="px-3 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors disabled:bg-gray-400"
              title="Search for image online"
            >
              <Search size={20} />
            </button>
          </div>
          {part.imageUrl && (
            <div className="mb-2">
              <img
                src={part.imageUrl || "/placeholder.svg"}
                alt={part.name}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          )}
          {showImageResults && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
              <div className="text-xs font-semibold text-gray-600 mb-2">
                {searchingImage ? "Searching images..." : "Select an image:"}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {imageResults.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectImage(url)}
                    className="cursor-pointer border-2 border-gray-200 hover:border-blue-500 rounded-lg overflow-hidden transition-all"
                  >
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Option ${idx + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/200x200/4A90E2/ffffff?text=Image`
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={onCancelImageSearch}
                className="mt-2 text-xs text-gray-600 hover:text-gray-800 underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg">
            Close
          </button>
          <button
            onClick={() => onDelete(part.id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}
