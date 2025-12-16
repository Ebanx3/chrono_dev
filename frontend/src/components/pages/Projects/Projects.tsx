import { useState } from "react";
import { CreateButton } from "../../ui/CreateButton";
import { ProjectsContainer } from "./ProjectsContainer";
import { CreateProjectModal } from "./CreateProjectModal";

export const Projects = () => {
  const [showCreateProjectModal, setShowCreateProjecttModal] = useState(false);
  return (
    <>
      <title>Proyectos</title>
      <main className="max-w-[1160px] m-auto flex flex-col">
        <CreateButton
          label="Nueva proyecto"
          onClickMethod={() => {
            setShowCreateProjecttModal(true);
          }}
        />
        <ProjectsContainer />
        {showCreateProjectModal && <CreateProjectModal closeModal={()=> setShowCreateProjecttModal(false)}/>}
      </main>
    </>
  );
};
