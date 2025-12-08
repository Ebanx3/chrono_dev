import { Handle, Position } from "@xyflow/react";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export const Project = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodes((prev) =>
      prev.includes(node.id)
        ? prev.filter((id) => id !== node.id)
        : [...prev, node.id]
    );
  }, []);

  const addNode = () => {
    const newNode = {
      id: `n${nodes.length + 1}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}` },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const connectSelected = () => {
    if (selectedNodes.length === 2) {
      const [source, target] = selectedNodes;
      const newEdge = { id: `${source}-${target}`, source, target };
      setEdges((prev) => [...prev, newEdge]);
      setSelectedNodes([]);
    }
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  };

  const EditableNode = ({ data }) => {
    return (
      <div
        style={{
          padding: 10,
          border: "1px solid #333",
          borderRadius: 8,
          background: "#fff",
        }}
      >
        <input
          value={data.label}
          onChange={(e) => data.onChange(e.target.value)}
          style={{ border: "none", outline: "none", background: "transparent" }}
        />
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
      </div>
    );
  };

  const nodeTypes = { editable: EditableNode };

  return (
    <div className="animated-bg" style={{width:'100vw', height:"100vh"}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      />
      <div className="absolute bottom-4 left-4 flex flex-col p-4 text-sm gap-4">
        <button className="border bg-white p-1 rounded-lg" onClick={addNode}>
          Agregar nodo
        </button>
        <button
          className="border bg-white p-1 rounded-lg"
          onClick={connectSelected}
          disabled={selectedNodes.length !== 2}
        >
          Conectar seleccionados
        </button>
      </div>
    </div>
  );
};
