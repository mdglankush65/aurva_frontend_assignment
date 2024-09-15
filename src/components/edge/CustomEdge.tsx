import { BaseEdge, getSimpleBezierPath } from '@xyflow/react';

interface CustomEdgeType {
    id:string,
    sourceX:number,
    sourceY:number, 
    targetX:number, 
    targetY:number
}

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }:CustomEdgeType) {

  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
}