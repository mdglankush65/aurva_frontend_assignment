import { useNodesState, useEdgesState } from "@xyflow/react";
import { fetchCategories } from "../utils/datafetch";
import { createNewNodes, createNewEdges, MealViewButton } from "../utils/nodeHelpers";

export const useNodeActions = () => {
  const initialNodes = [
    { id: "e", type: "textNode", position: { x: 0, y: 300 }, data: { value: "Explore" } }
  ];
  const initialEdges = [];

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const handleClick = async (e, node) => {
    if (node.id === "e") {
      if (nodes.find(nd=>nd.id.startsWith("c"))) {
        setNodes(prev => prev.filter(n => n.id.startsWith("e")));
        setEdges([]);
      } else {
        const categories = await fetchCategories();
        const newNodes = createNewNodes(categories, node);
        const newEdges = createNewEdges(newNodes, "e");
        setNodes(prev => [...prev, ...newNodes]);
        setEdges(prev => [...prev, ...newEdges]);
      }
    }
    if (node.id.startsWith("c")) {
      if (nodes.find(nd=>nd.id.startsWith("v"))) {
        setNodes(prev => prev.filter(n => !n.id.startsWith("v")));
        setEdges(prev => prev.filter(e => !(e.target.id === "v")));
      } else {
        const {newNodes,newEdges} = MealViewButton(node)
        setNodes(prev => [...prev, ...newNodes]);
        setEdges(prev => [...prev, ...newEdges]);
      }
    }
  };

  return { nodes, edges, handleClick };
};
