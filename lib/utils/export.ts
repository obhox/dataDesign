import type { Part, Connection, LinkType, Component } from "../types"

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
  a.download = "manufacturing-mindmap.json"
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
