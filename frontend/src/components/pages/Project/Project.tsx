import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { ProjectDetails } from "./ProjectDetails";
import { Members } from "./Members";
import { PendingMembers } from "./PendingMembers";

export const Project = () => {
  const { projectId } = useParams();
  const { data, error, loading } = useFetch<Project>(`/project/${projectId}`);
  console.log(data)
  if (error) {
    return (
      <>
        <title>Error</title>
        <div className="text-center text-slate-400 mt-10">
          Hubo un error intentando obtener al proyecto.
        </div>
      </>
    );
  }

  if (data === undefined) {
    return (
      <>
        <title>Proyecto privado</title>
        <div className="text-center text-slate-400 mt-10">
          El proyecto es privado.
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <title>Chrono-dev</title>
        <div className="w-full flex justify-center mt-10">
          <LoaderSVG />
        </div>
      </>
    );
  }

  return (
    <>
      <title>{data?.name || "Project"}</title>
      <div className="flex gap-4">
        <ProjectDetails project={data!} />
        <div className="w-1/3">
          <Members members={data!.members} />
          {!data?.isPublic && data?.pendingMembers && <PendingMembers pendingMembers={data.pendingMembers}/>}
          </div>
      </div>
    </>
  );
};
