import { Handle, Position } from '@xyflow/react';
import "../../App.css"

export function TextNode({ data }: { data: {value:string}}) {
  
  return (
    <div>
      <Handle type="target" position={Position.Left} />
      <div className='textNode'>
        {data.value}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="s"
      />
    </div>
  );
}