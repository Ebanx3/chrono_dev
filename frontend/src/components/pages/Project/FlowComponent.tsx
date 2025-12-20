import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState } from "react";
import { ProjectController } from "./ProjectController";

export const FlowComponent = ({project}:{project:Project}) => {
  const [nodes, setNodes] = useState([]);
  
  return (
    <>
      <ReactFlow nodes={nodes}  fitView>
        <Background />
        <Controls />
        <ProjectController />
      </ReactFlow>
    </>
  );
};
