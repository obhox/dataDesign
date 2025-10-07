export interface Part {
  id: number
  type: string
  name: string
  customColor: string
  functionality: string
  imageUrl: string
  cost: string
  costUnit: string
  quantity: number
  sourceUrl: string
  x: number
  y: number
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
