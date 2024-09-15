export const createNewNodes = (nodes, target) => {
  return nodes.map((nd, index) => ({
    id: ``,
    type: "textNode",
    position: { x: 150, y: node.position.y + 50 * index - 100 },
    data: { value: category.strCategory },
  }));
};

export const createNewEdges = (newNodes, sourceId) => {
  return newNodes.map((newNode) => ({
    id: `${sourceId}-${newNode.id}`,
    source: sourceId,
    target: newNode.id,
    type: "edgeNode",
  }));
};

export const MealViewButton = (node) => {
  const newNodes = [
    {
      id: `v`,
      type: "textNode",
      position: { x: node.position.x, y: node.position.y + 100 },
      data: { value: "View Meals" },
    },
  ];
  const newEdges = createNewEdges([newNodes], node.id);
  return { newNodes, newEdges };
};