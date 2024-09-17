import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TextNode } from "./components/node/CustomNode";
import EdgeNode from "./components/edge/CustomEdge";
import { useState } from "react";
import {
  Meal,
  initialNodes,
  CustomNodeType,
  initialEdges,
} from "./constants";
import Sidebar from "./components/Sidebar";
import { handleCategoryClick, handleCategoryViewClick, handleMealDetailClick, handleMealNodeClick, handleViewMealClick } from "./helper/handleClickHelper";

const nodeTypes = { textNode: TextNode };
const edgeTypes = { edgeNode: EdgeNode };

export default function App() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [mealDetails, setMealDetails] = useState<Meal | null>(null);

  const handleClick = async (_event: React.MouseEvent, node:CustomNodeType) => {
    console.log(node);

    switch(true){
      case node.id === 'e':
        await handleCategoryClick(node,nodes,setNodes,setEdges,setMealDetails);
        break;
      case node.id.startsWith("c-"):
        await handleCategoryViewClick(node,nodes,setNodes,setEdges,setMealDetails);
        break;
      case node.id.startsWith("v-c-"):
        await handleViewMealClick(node,nodes,setNodes,setEdges,setMealDetails);
        break;
      case node.id.startsWith("m-"):
        await handleMealNodeClick(node,nodes,setNodes,setEdges,setMealDetails);
        break;
      case node.id.startsWith("d"):
        await handleMealDetailClick(node,nodes,mealDetails,setMealDetails);
        break;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleClick}
      >
        <h3 className="fixed top-2 left-2">Food Explorer</h3>
        {mealDetails && (
          <Sidebar mealDetails={mealDetails} setMealDetails={setMealDetails} />
        )}
        <Background />
      </ReactFlow>
    </div>
  );
}