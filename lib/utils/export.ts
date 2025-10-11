import type { Part, Connection, LinkType, Component } from "../types"
import { toPng, toJpeg } from "html-to-image"

export function exportAsJSON(
  parts: Part[],
  connections: Connection[],
  customLinkTypes: LinkType[],
  customComponents: Component[],
) {
  const data = { parts, connections, customLinkTypes, customComponents }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "prototyping-mindmap.json"
  a.click()
  URL.revokeObjectURL(url)
}

export function exportBOM(parts: Part[]) {
  let csv = "Part Name,Quantity,Unit Cost,Currency,Total Cost,Functionality,Source Link\n"
  parts.forEach((part) => {
    const quantity = part.quantity || 1
    const cost = Number.parseFloat(part.cost) || 0
    const total = (quantity * cost).toFixed(2)
    csv += `"${part.name}",${quantity},${cost},${part.costUnit || "USD"},${total},"${part.functionality || ""}","${part.sourceUrl || ""}"\n`
  })
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "bill-of-materials.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export function calculateTotalCost(parts: Part[]): Record<string, number> {
  const costsByUnit: Record<string, number> = {}
  parts.forEach((part) => {
    if (part.cost && !isNaN(Number.parseFloat(part.cost))) {
      const unit = part.costUnit || "USD"
      const quantity = Number.parseInt(part.quantity.toString()) || 1
      if (!costsByUnit[unit]) costsByUnit[unit] = 0
      costsByUnit[unit] += Number.parseFloat(part.cost) * quantity
    }
  })
  return costsByUnit
}

export async function exportCanvasAsImage(format: 'png' | 'jpeg' = 'png') {
  try {
    const reactFlowElement = document.querySelector('.react-flow') as HTMLElement
    if (!reactFlowElement) {
      throw new Error('Canvas not found')
    }

    // Measure the current canvas size for responsive export
    const rect = reactFlowElement.getBoundingClientRect()
    const width = Math.round(rect.width)
    const height = Math.round(rect.height)
    // Clamp pixel ratio to avoid huge canvases on very high-DPI screens
    const pixelRatio = Math.min(2, Math.max(1, window.devicePixelRatio || 1))

    // Create a temporary watermark element
    const watermark = document.createElement('div')
    watermark.textContent = 'Made with Flow by Obhox Systems'
    watermark.style.cssText = `
      position: absolute;
      bottom: 12px;
      right: 12px;
      font-size: clamp(12px, 1.2vw, 16px);
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
      font-family: system-ui, -apple-system, sans-serif;
      pointer-events: none;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.9);
      padding: 6px 10px;
      border-radius: 6px;
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    `

    // Add watermark to the canvas temporarily
    const previousPosition = reactFlowElement.style.position
    reactFlowElement.style.position = 'relative'
    reactFlowElement.appendChild(watermark)

    let dataUrl: string
    const options = {
      backgroundColor: '#ffffff',
      width,
      height,
      pixelRatio,
      // quality is only used by JPEG, harmless for PNG
      quality: 0.95,
      filter: (node: Element) => {
        // Filter out controls, minimap and attribution from the export
        return !(
          node?.classList?.contains('react-flow__minimap') ||
          node?.classList?.contains('react-flow__controls') ||
          node?.classList?.contains('react-flow__attribution')
        )
      },
    }

    if (format === 'png') {
      dataUrl = await toPng(reactFlowElement, options)
    } else {
      dataUrl = await toJpeg(reactFlowElement, options)
    }

    // Remove the temporary watermark and restore styles
    reactFlowElement.removeChild(watermark)
    reactFlowElement.style.position = previousPosition

    // Create download link
    const link = document.createElement('a')
    // Simple, consistent filename as requested
    const filename = `flow-prototype.${format}`
    link.download = filename
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Error exporting canvas:', error)
    throw error
  }
}
