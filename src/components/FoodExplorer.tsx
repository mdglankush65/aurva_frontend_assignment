import { useState } from "react";
import { ReactFlow, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNodeActions } from "../hooks/UseNodeActions";
import { nodeTypes } from "./NodeTypes";
import { edgeTypes } from "./EdgeTypes";

export const FoodExplorer = () => {
  const { nodes, edges, handleClick } = useNodeActions();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleClick}
      >
        <h1 style={{position:"fixed", top:"0", left:"10"}}>Food Explorer</h1>
        <Background />
      </ReactFlow>
    </div>
  );
};
