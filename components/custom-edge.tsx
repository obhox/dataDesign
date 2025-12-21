"use client"

import { memo } from "react"
import { BaseEdge, type EdgeProps, getSmoothStepPath } from "@xyflow/react"

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
    const [edgePath] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 16,
      offset: 20,
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
