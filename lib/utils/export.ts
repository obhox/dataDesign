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
  a.download = "system-design.json"
  a.click()
  URL.revokeObjectURL(url)
}

export function exportArchitectureDoc(parts: Part[], connections: Connection[]) {
  let markdown = "# System Architecture Documentation\n\n"
  markdown += `_Generated on ${new Date().toLocaleDateString()}_\n\n`

  markdown += "## Overview\n\n"
  markdown += `This system consists of ${parts.length} components connected through ${connections.length} data flows.\n\n`

  markdown += "## Components\n\n"
  parts.forEach(part => {
    markdown += `### ${part.name}\n\n`
    markdown += `- **Type**: ${part.type}\n`
    if (part.technology) markdown += `- **Technology**: ${part.technology}\n`
    if (part.version) markdown += `- **Version**: ${part.version}\n`
    markdown += `- **Functionality**: ${part.functionality}\n`
    if (part.capacity) markdown += `- **Capacity**: ${part.capacity}\n`
    if (part.sla) markdown += `- **SLA**: ${part.sla}\n`
    markdown += `\n`
  })

  markdown += "## Data Flows\n\n"
  const groupedConnections = connections.reduce((acc, conn) => {
    if (!acc[conn.linkType]) acc[conn.linkType] = []
    acc[conn.linkType].push(conn)
    return acc
  }, {} as Record<string, Connection[]>)

  Object.entries(groupedConnections).forEach(([type, conns]) => {
    markdown += `### ${type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ')}\n\n`
    conns.forEach(conn => {
      const from = parts.find(p => p.id === conn.from)
      const to = parts.find(p => p.id === conn.to)
      markdown += `- **${from?.name}** → **${to?.name}**\n`
    })
    markdown += `\n`
  })

  markdown += "## Architecture Diagram\n\n"
  markdown += "_Import the JSON file to visualize this architecture in Flow._\n\n"

  const blob = new Blob([markdown], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "architecture-documentation.md"
  a.click()
  URL.revokeObjectURL(url)
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
    watermark.textContent = 'Made with Flow System Designer by Obhox Systems'
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
    const filename = `system-architecture.${format}`
    link.download = filename
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Error exporting canvas:', error)
    throw error
  }
}
