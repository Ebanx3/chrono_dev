import { LoaderSVG } from "../../../assets/LoaderSVG";
import { useFetch } from "../../../hooks/useFetch";
import { ProjectCard } from "./ProjectCard";

export const ProjectsContainer = () => {
  const { data, loading, error } = useFetch<Project[]>("/project");

  if (error) {
    return (
      <div className="text-center text-slate-400">
        Hubo un error intentando traer los proyectos.
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className="w-full flex justify-center mt-10">
          <LoaderSVG />
        </div>
      </>
    );
  }

  return (
    <>
      <div className=" flex flex-col gap-6 p-4">
         {data && data.map((project) => <ProjectCard key={project!.id} project={project} />)}
      </div>
    </>
  );
};
