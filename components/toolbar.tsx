"use client"

import type React from "react"

import { Download, Upload, Undo2, Redo2, Grid3X3 } from "lucide-react"
import { calculateTotalCost } from "@/lib/utils/export"
import type { Part } from "@/lib/types"

interface ToolbarProps {
  onLoadSample: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onExportJSON: () => void
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void
  onExportBOM: () => void
  onAutoArrange: () => void
  parts: Part[]
}

export function Toolbar({
  onLoadSample,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportJSON,
  onImportJSON,
  onExportBOM,
  onAutoArrange,
  parts,
}: ToolbarProps) {
  const totalCosts = calculateTotalCost(parts)

  return (
    <div className="absolute top-6 left-6 z-20 flex gap-3 items-center flex-wrap">
      <button
        onClick={onLoadSample}
        className="px-4 py-2 bg-white text-gray-800 hover:bg-gray-50 rounded-lg shadow-lg border border-gray-200 transition-all font-medium"
      >
        Load Sample
      </button>
      <div className="flex gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-3 py-2 hover:bg-gray-100 rounded disabled:opacity-30"
          title="Undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="px-3 py-2 hover:bg-gray-100 rounded disabled:opacity-30"
          title="Redo"
        >
          <Redo2 size={18} />
        </button>
        <button
          onClick={onAutoArrange}
          className="px-3 py-2 hover:bg-gray-100 rounded"
          title="Auto Arrange"
        >
          <Grid3X3 size={18} />
        </button>
      </div>
      <div className="flex gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
        <button onClick={onExportJSON} className="px-3 py-2 hover:bg-gray-100 rounded" title="Save">
          <Download size={18} />
        </button>
        <label className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer" title="Load">
          <Upload size={18} />
          <input type="file" accept=".json" onChange={onImportJSON} className="hidden" />
        </label>
      </div>
      <button
        onClick={onExportBOM}
        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-lg font-medium"
      >
        Export BOM
      </button>
      {parts.length > 0 && Object.keys(totalCosts).length > 0 && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <div className="text-xs text-gray-500 font-semibold">TOTAL COST</div>
          <div className="flex gap-3 mt-1">
            {Object.entries(totalCosts).map(([unit, total]) => (
              <div key={unit} className="text-sm font-bold text-gray-800">
                {total.toFixed(2)} {unit}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
