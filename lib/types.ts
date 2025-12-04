export interface Part {
  id: number
  type: string
  name: string
  customColor: string
  functionality: string
  imageUrl: string
  x: number
  y: number

  // Optional legacy BOM fields (kept for backwards compatibility)
  cost?: string
  costUnit?: string
  quantity?: number
  sourceUrl?: string

  // System design fields
  technology?: string    // e.g., "PostgreSQL 15", "Node.js 20"
  version?: string       // e.g., "v2.1.0"
  description?: string   // Additional architectural notes
  capacity?: string      // e.g., "1000 req/s", "100GB storage"
  sla?: string          // e.g., "99.9% uptime"
}

export interface Connection {
  from: number
  to: number
  id: number
  linkType: string
  color: string
  strokeWidth: number
  dashArray: string
}

export interface LinkType {
  id: string
  name: string
  color: string
  strokeWidth: number
  dashArray: string
  description: string
}

export interface Component {
  id: string
  name: string
  icon: any
  customColor: string
}

export interface Category {
  name: string
  icon: any
  components: Component[]
}

export interface HistoryState {
  parts: Part[]
  connections: Connection[]
}

export interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: Part
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  type?: string
  data: Connection
  style?: any
  markerEnd?: any
}
