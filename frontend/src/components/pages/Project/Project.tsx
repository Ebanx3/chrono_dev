import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { ProjectDetails } from "./ProjectDetails";
import { Members } from "./Members";
import { PendingMembers } from "./PendingMembers";
import { ProjectActivity } from "./ProjectActivity";

export const Project = () => {
  const { projectId } = useParams();
  const { data, error, loading, refetch } = useFetch<ProjectWithUserFlags>(`/project/${projectId}`);
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
      <div className="flex gap-4 flex-col sm:flex-row">
        <ProjectDetails project={data!} />
        <div className="sm:w-1/4">
          <Members
            projectId={projectId!}
            members={data!.members}
            canEditOptions={Boolean(data?.permissions?.["project.members.edit_role"])}
            canRemoveMember={Boolean(data?.permissions?.["project.members.remove"])}
            refetchProject={refetch}
          />
          {!data?.isPublic && data?.permissions["project.pending_members.view"] && <PendingMembers pendingMembers={data.pendingMembers} refetchProject={refetch}/>} 
          </div>
      </div>
      <ProjectActivity
        projectId={projectId}
        canAddActivity={Boolean(data?.permissions?.["project.activity.add"])}
      />
    </>
  );
};
