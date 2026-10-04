import { useState } from "react";
import { toast } from "sonner";
import { updateProjectSettings } from "../../../api/project";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { Form } from "../../ui/Forms/Form";

interface ProjectSettingsModalProps {
  project: ProjectWithUserFlags;
  closeModal: VoidFunction;
  refetchProject: () => void;
}

export const ProjectSettingsModal = ({
  project,
  closeModal,
  refetchProject,
}: ProjectSettingsModalProps) => {
  const [autoAssignTicket, setAutoAssignTicket] = useState(
    project.settings.autoAssignTicket,
  );
  const [areas, setAreas] = useState(project.settings.areas.join(", "));
  const [maxTicketsPerMember, setMaxTicketsPerMember] = useState(
    String(project.settings.maxTicketsPerMember),
  );
  const [joinMode, setJoinMode] = useState<ProjectJoinMode>(
    project.settings.joinMode,
  );
  const [visibility, setVisibility] = useState<ProjectVisibility>(
    project.settings.visibility || (project.isPublic ? "public" : "private"),
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedMaxTickets = Number(maxTicketsPerMember);
    const parsedAreas = areas
      .split(",")
      .map((area) => area.trim())
      .filter(Boolean);

    if (!Number.isInteger(parsedMaxTickets) || parsedMaxTickets < 1) {
      toast.error("El máximo de tickets debe ser un entero mayor que cero");
      return;
    }

    if (parsedAreas.length > 20) {
      toast.error("No puedes agregar más de 20 áreas");
      return;
    }

    setIsLoading(true);
    const result = await updateProjectSettings({
      projectId: project._id,
      settings: {
        autoAssignTicket,
        areas: parsedAreas,
        maxTicketsPerMember: parsedMaxTickets,
        joinMode,
        visibility,
      },
    });
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Ajustes del proyecto actualizados");
    refetchProject();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <Form handleSubmit={handleSubmit}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-100">Ajustes del proyecto</h2>
          <button
            type="button"
            onClick={closeModal}
            className="text-2xl leading-none text-slate-400 hover:text-slate-100"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <fieldset className="mb-5 rounded-md border border-slate-700 p-3">
          <legend className="px-1 text-sm font-medium text-slate-400">Opciones</legend>
          <label className="mb-4 flex items-center justify-between gap-4 text-sm text-slate-300">
            <span>Asignar tickets automáticamente</span>
          <button
            type="button"
            role="switch"
            aria-checked={autoAssignTicket}
            aria-label="Asignar tickets automáticamente"
            onClick={() => setAutoAssignTicket((current) => !current)}
            className={`relative h-4 w-7 shrink-0 overflow-hidden rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              autoAssignTicket ? "bg-purple-600" : "bg-slate-600"
            }`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-[left] ${
                autoAssignTicket ? "left-[14px]" : "left-0.5"
              }`}
            />
          </button>
          </label>

          <label className="mb-4 flex items-center justify-between gap-4 text-sm text-slate-300">
            <span>Ingreso abierto</span>
            <button
              type="button"
              role="switch"
              aria-checked={joinMode === "open"}
              aria-label="Permitir ingreso abierto al proyecto"
              onClick={() => setJoinMode((current) => current === "open" ? "request" : "open")}
              className={`relative h-4 w-7 shrink-0 overflow-hidden rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                joinMode === "open" ? "bg-purple-600" : "bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-[left] ${
                  joinMode === "open" ? "left-[14px]" : "left-0.5"
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between gap-4 text-sm text-slate-300">
            <span>Proyecto público</span>
            <button
              type="button"
              role="switch"
              aria-checked={visibility === "public"}
              aria-label="Hacer público el proyecto"
              onClick={() => setVisibility((current) => current === "public" ? "private" : "public")}
              className={`relative h-4 w-7 shrink-0 overflow-hidden rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                visibility === "public" ? "bg-purple-600" : "bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-[left] ${
                  visibility === "public" ? "left-[14px]" : "left-0.5"
                }`}
              />
            </button>
          </label>
        </fieldset>

        <label htmlFor="project-areas" className="mb-1 text-sm font-medium text-slate-400">
          Áreas
        </label>
        <input
          id="project-areas"
          value={areas}
          onChange={(event) => setAreas(event.target.value)}
          placeholder="Frontend, Backend"
          className="mb-4 rounded-md border border-slate-700 bg-slate-900 p-2 text-slate-200 outline-none [color-scheme:dark] focus:border-slate-400 focus:ring-2 focus:ring-slate-400"
        />

        <label htmlFor="project-max-tickets" className="mb-1 text-sm font-medium text-slate-400">
          Máximo de tickets por miembro
        </label>
        <input
          id="project-max-tickets"
          type="number"
          min="1"
          step="1"
          value={maxTicketsPerMember}
          onChange={(event) => setMaxTicketsPerMember(event.target.value)}
          className="mb-4 appearance-none rounded-md border border-slate-700 bg-slate-900 p-2 text-slate-200 outline-none [color-scheme:dark] focus:border-slate-400 focus:ring-2 focus:ring-slate-400"
        />

        {isLoading ? (
          <div className="flex h-10 justify-center">
            <LoaderSVG />
          </div>
        ) : (
          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-md bg-slate-700 p-2 text-slate-300 hover:bg-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-purple-600 p-2 font-semibold text-white hover:brightness-110"
            >
              Guardar cambios
            </button>
          </div>
        )}
      </Form>
    </div>
  );
};
