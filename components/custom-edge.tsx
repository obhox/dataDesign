"use client"

import { memo } from "react"
import { BaseEdge, type EdgeProps, getBezierPath } from "@xyflow/react"

export const CustomEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    markerEnd,
    selected,
    data,
  }: EdgeProps) => {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    })

    return (
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: selected ? 3 : style?.strokeWidth || 2,
          opacity: selected ? 1 : 0.7,
        }}
        markerEnd={markerEnd}
      />
    )
  },
)

CustomEdge.displayName = "CustomEdge"
