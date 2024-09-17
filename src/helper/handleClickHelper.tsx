import { Edge } from "@xyflow/react";
import { CustomNodeType, CategoryType, Meal,SetNodesType,SetEdgesType,SetMealDetailsType } from "../constants";
import { fetchCategories, fetchDetails, fetchMeals } from "../utils/datafetch";

export const handleCategoryClick = async (
  node: CustomNodeType,
  nodes: CustomNodeType[],
  setNodes: SetNodesType,
  setEdges: SetEdgesType,
  setMealDetails: SetMealDetailsType
) => {
  if (nodes.find(nd=>nd.id.startsWith("c-"))) {
    // Hide categories
    setNodes((prevNodes:CustomNodeType[]) => prevNodes.filter((n) => n.id.startsWith("e")));
    setEdges([]);
    setMealDetails(null);
  } else {
    // Show categories
    const res = await fetchCategories();
    const newNodes = res?.map((category: CategoryType, index: number) => ({
      id: `c-${index}`,
      type: "textNode",
      position: { x: 150, y: node.position.y + 50 * index - 100 },
      data: { value: category.strCategory },
    }));
    setNodes((prevNodes:CustomNodeType[]) => [...prevNodes, ...newNodes]);

    const newEdges = newNodes.map((newNode: CustomNodeType) => ({
      id: `e-${newNode.id}`,
      source: "e",
      target: newNode.id,
      type: "edgeNode",
    }));
    setEdges((prevEdges:Edge[]) => [...prevEdges, ...newEdges]);
  }
};

export const handleMealNodeClick = async (
  node: CustomNodeType,
  nodes: CustomNodeType[],
  setNodes: SetNodesType,
  setEdges: SetEdgesType,
  setMealDetails: SetMealDetailsType
) => {
  if (nodes.find((nd) => nd.id.startsWith("i"))) {
    setNodes((prevNodes:CustomNodeType[]) =>
      prevNodes.filter(
        (n) =>
          !n.id.startsWith("i-") &&
          !n.id.startsWith("t-") &&
          !n.id.startsWith("d-")
      )
    );
    setEdges((prevEdges) =>
      prevEdges.filter((e) => !e.source.startsWith("m-"))
    );
    setMealDetails(null);
  } else {
    const ingredientsNode = {
      id: `i-${node.id}`,
      type: "textNode",
      position: { x: node.position.x + 400, y: node.position.y - 50 },
      data: { value: `View Ingredients` },
    };

    const tagsNode = {
      id: `t-${node.id}`,
      type: "textNode",
      position: { x: node.position.x + 400, y: node.position.y },
      data: { value: `View Tags` },
    };

    const detailsNode = {
      id: `d-${node.id}`,
      type: "textNode",
      position: { x: node.position.x + 400, y: node.position.y + 50 },
      data: { value: `View Details` },
    };

    setNodes((prevNodes:CustomNodeType[]) => [
      ...prevNodes,
      ingredientsNode,
      tagsNode,
      detailsNode,
    ]);

    setEdges((prevEdges) => [
      ...prevEdges,
      {
        id: `${node.id}-i`,
        source: node.id,
        target: ingredientsNode.id,
        type: "edgeNode",
      },
      {
        id: `${node.id}-t`,
        source: node.id,
        target: tagsNode.id,
        type: "edgeNode",
      },
      {
        id: `${node.id}-d`,
        source: node.id,
        target: detailsNode.id,
        type: "edgeNode",
      },
    ]);
  }
};

export const handleCategoryViewClick = async (
    node: CustomNodeType,
    nodes: CustomNodeType[],
    setNodes: SetNodesType,
    setEdges: SetEdgesType,
    setMealDetails: SetMealDetailsType
) =>{
    if (nodes.find((n) => n.id.startsWith("v"))) {
        // If categories are visible, hide them
        setNodes((prevNodes:CustomNodeType[]) =>
          prevNodes.filter((n) => n.id.startsWith("e") || n.id.startsWith("c"))
        ); // Remove all nodes
        setEdges((prevEdges) => [
          ...prevEdges.filter((ed) => ed.id.startsWith("e-c")),
        ]); // Remove related edges
        setMealDetails(null);
      } else {
        // Add "View Meals" node when a category node is clicked
        const viewMealNode = {
          id: `v-${node.id}`,
          type: "textNode",
          position: { x: node.position.x + 200, y: node.position.y }, // In front of the clicked node
          data: { value: "View Meals" },
        };

        const newEdge = {
          id: `${node.id}-${viewMealNode.id}`,
          source: node.id,
          target: viewMealNode.id,
          type: "edgeNode",
        };

        setNodes((prevNodes:CustomNodeType[]) => [...prevNodes, viewMealNode]);
        setEdges((prevEdges) => [...prevEdges, newEdge]);
      }
}

export const handleViewMealClick = async (
    node: CustomNodeType,
    nodes: CustomNodeType[],
    setNodes: SetNodesType,
    setEdges: SetEdgesType,
    setMealDetails: SetMealDetailsType
) =>{
    if (nodes.find((nd) => nd.id.startsWith("m"))) {
        setNodes((prevNodes:CustomNodeType[]) =>
          prevNodes.filter(
            (n:CustomNodeType) =>
              !n.id.startsWith("m-") &&
              !n.id.startsWith("i-") &&
              !n.id.startsWith("t-") &&
              !n.id.startsWith("d-")
          )
        );

        setEdges((prevEdges) =>
          prevEdges.filter(
            (e) => !e.target.startsWith("m-") && !e.source.startsWith("m-")
          )
        );
        setMealDetails(null);
      } else {
        // Extract category ID from the "view-c-*" node
        const categoryId = node.id.split("v-c-")[1];

        // Find the category node by its ID
        const categoryNode = nodes.find((n) => n.id === `c-${categoryId}`);

        if (!categoryNode) {
          console.error("Category node not found");
          return;
        }

        // Fetch meals for the selected category using the category name
        const categoryName = categoryNode.data.value; // Use category name from node data

        // Fetch meals for the selected category
        const res = await fetchMeals(categoryName);

        const newNodes = res.map((meal: Meal, index: number) => ({
          id: `m-${index}`,
          type: "textNode",
          position: {
            x: node.position.x + 200,
            y: node.position.y + index * 50 - 100,
          },
          data: { value: meal.strMeal },
        }));

        setNodes((prevNodes:CustomNodeType[]) => [...prevNodes, ...newNodes]);

        const newEdges = newNodes.map((newNode: CustomNodeType) => ({
          id: `v-${newNode.id}`,
          source: node.id,
          target: newNode.id,
          type: "edgeNode",
        }));

        setEdges((prevEdges:Edge[]) => [...prevEdges, ...newEdges]);
      }
}


export const handleMealDetailClick = async (
    node: CustomNodeType,
    nodes: CustomNodeType[],
    mealDetails:null|Meal,
    setMealDetails: SetMealDetailsType,
)=>{
    if (mealDetails) {
        setMealDetails(null);
        return;
      }
      const meal = nodes.find((nd) => nd.id === node.id.slice(2))?.data.value;
      console.log(meal);
      if (!meal) return null;
      const details = await fetchDetails(meal);
      console.log(details);
      setMealDetails(details);
}