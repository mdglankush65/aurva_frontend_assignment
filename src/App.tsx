import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TextNode } from "./components/node/CustomNode";
import EdgeNode from "./components/edge/CustomEdge";
import { fetchCategories, fetchDetails, fetchMeals } from "./utils/datafetch";
import { useState } from "react";
import {
  Meal,
  initialNodes,
  CustomNodeType,
  CategoryType,
  MealType,
  initialEdges,
} from "./constants";
import Sidebar from "./components/Sidebar";

const nodeTypes = { textNode: TextNode };
const edgeTypes = { edgeNode: EdgeNode };

export default function App() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [mealDetails, setMealDetails] = useState<Meal | null>(null);

  const handleClick = async (_event: React.MouseEvent, node:CustomNodeType) => {
    console.log(node);
    // =======================================================================================================
    if (node.id === "e") {
      if (categoriesVisible) {
        // If categories are visible, hide them
        setNodes((prevNodes) => prevNodes.filter((n) => n.id.startsWith("e"))); // Remove all nodes
        setEdges([]); // Remove related edges
        setCategoriesVisible((prev) => !prev);
        setMealDetails(null);
      } else {
        // If categories are hidden, show them
        const res = await fetchCategories();

        const newNodes = res?.map((category: CategoryType, index: number) => ({
          id: `c-${index}`,
          type: "textNode",
          position: { x: 150, y: node.position.y + 50 * index - 100 },
          data: { value: category.strCategory },
        }));

        setNodes((prevNodes) => [...prevNodes, ...newNodes]);

        const newEdges = newNodes.map((newNode: CustomNodeType) => ({
          id: `e-${newNode.id}`,
          source: "e",
          target: newNode.id,
          type: "edgeNode",
        }));

        setEdges((prevEdges) => [...prevEdges, ...newEdges]);
        setCategoriesVisible((prev) => !prev);
      }
    }
    // ======================================================================================================
    else if (node.id.startsWith("c-")) {
      if (nodes.find((n) => n.id.startsWith("v"))) {
        // If categories are visible, hide them
        setNodes((prevNodes) =>
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

        setNodes((prevNodes) => [...prevNodes, viewMealNode]);
        setEdges((prevEdges) => [...prevEdges, newEdge]);
      }
    }
    // =======================================================================================================
    else if (node.id.startsWith("v-c-")) {
      // Handle "View Meals" click
      if (nodes.find((nd) => nd.id.startsWith("m"))) {
        setNodes((prevNodes) =>
          prevNodes.filter(
            (n) =>
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

        const newNodes = res.map((meal: MealType, index: number) => ({
          id: `m-${index}`,
          type: "textNode",
          position: {
            x: node.position.x + 200,
            y: node.position.y + index * 50 - 100,
          },
          data: { value: meal.strMeal },
        }));

        setNodes((prevNodes) => [...prevNodes, ...newNodes]);

        const newEdges = newNodes.map((newNode: CustomNodeType) => ({
          id: `v-${newNode.id}`,
          source: node.id,
          target: newNode.id,
          type: "edgeNode",
        }));

        setEdges((prevEdges) => [...prevEdges, ...newEdges]);
      }
    }
    // =====================================================================================================
    else if (node.id.startsWith("m-")) {
      if (nodes.find((nd) => nd.id.startsWith("i"))) {
        setNodes((prevNodes) =>
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
        // create those nodes
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

        // Add nodes and edges for ingredients, tags, and details
        setNodes((prevNodes) => [
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
    }
    if (node.id.startsWith("d")) {
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

// import { FoodExplorer } from "./components/FoodExplorer";

// const App = () => {
//   return <FoodExplorer />;
// };

// export default App;
