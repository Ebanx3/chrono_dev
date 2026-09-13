import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { CreateButton } from "../../ui/CreateButton";
import { AddActivityModal } from "./AddActivityModal";
import { DiscussionActivity } from "./DiscussionActivity";
import { TicketActivity } from "./TicketActivity";
import { VoteActivity } from "./VoteActivity";

export const ProjectActivity = ({
  projectId: projectIdProp,
  canAddActivity = false,
}: {
  projectId?: string;
  canAddActivity?: boolean;
}) => {
  const { projectId: projectIdParam } = useParams();
  const projectId = projectIdProp ?? projectIdParam;
  const { data, loading, error, refetch } = useFetch<ProjectActivityItem[]>(
    projectId ? `/project/${projectId}/activity` : "",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!projectId) return null;

  return (
    <section className="mt-10 w-full border-t border-slate-800 pt-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Actividad del proyecto</h2>
          <p className="mt-1 text-sm text-slate-500">Discusiones, votaciones y cambios recientes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => void refetch()} className="text-sm text-slate-400 hover:text-slate-200">
            Actualizar
          </button>
          {canAddActivity && <CreateButton label="Agregar actividad" onClickMethod={() => setIsModalOpen(true)} />}
        </div>
      </div>

      {loading && <p className="text-sm text-slate-500">Cargando actividad...</p>}
      {error && <p className="text-sm text-red-300">No se pudo cargar la actividad.</p>}
      {!loading && !error && data?.length === 0 && <p className="text-sm text-slate-500">Todavía no hay actividad.</p>}

      <div className="space-y-3">
        {data?.map((item) => (
          <article key={item._id} className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>{item.type === "discussion" ? "Discusión" : item.type === "vote" ? "Votación" : "Ticket"}</span>
              <time>{new Date(item.createdAt).toLocaleString()}</time>
            </div>
            {item.type === "discussion" && item.discussion && <DiscussionActivity discussion={item.discussion} authorUsername={item.author.username}/>}
            {item.type === "vote" && item.vote && <VoteActivity vote={item.vote} />}
            {item.type === "ticket" && item.ticketActivity && <TicketActivity ticketActivity={item.ticketActivity} />}
          </article>
        ))}
      </div>

      {isModalOpen && (
        <AddActivityModal
          projectId={projectId}
          closeModal={() => setIsModalOpen(false)}
          onActivityAdded={() => void refetch()}
        />
      )}
    </section>
  );
};
