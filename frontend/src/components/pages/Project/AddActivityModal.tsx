import { useState } from "react";
import { toast } from "sonner";
import { addActivityToProject } from "../../../api/project";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { Form } from "../../ui/Forms/Form";
import { FormButton } from "../../ui/Forms/FormButton";
import { FormInput } from "../../ui/Forms/FormInput";

type ActivityType = AddProjectActivity["type"];

type AddActivityModalProps = {
  projectId: string;
  closeModal: VoidFunction;
  onActivityAdded: VoidFunction;
};

export const AddActivityModal = ({
  projectId,
  closeModal,
  onActivityAdded,
}: AddActivityModalProps) => {
  const [type, setType] = useState<ActivityType>("discussion");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [details, setDetails] = useState("");
  const [options, setOptions] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [action, setAction] = useState<"created" | "updated" | "deleted" | "assigned">("created");
  const [assignedTo, setAssignedTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let activity: AddProjectActivity;

    if (type === "discussion") {
      if (!title.trim() || !content.trim()) {
        toast.error("El título y el contenido son obligatorios.");
        return;
      }
      activity = { type, title: title.trim(), content: content.trim() };
    } else if (type === "vote") {
      const voteOptions = options.split(",").map((option) => option.trim()).filter(Boolean);
      if (!details.trim() || voteOptions.length < 2) {
        toast.error("La votación necesita detalles y al menos dos opciones.");
        return;
      }
      activity = { type, details: details.trim(), options: voteOptions };
    } else {
      if (!ticketId.trim()) {
        toast.error("El identificador del ticket es obligatorio.");
        return;
      }
      activity = {
        type,
        ticketId: ticketId.trim(),
        action,
        ...(assignedTo.trim() ? { assignedTo: assignedTo.trim() } : {}),
      };
    }

    setIsLoading(true);
    const response = await addActivityToProject({ projectId, activity });
    setIsLoading(false);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success("Actividad agregada correctamente");
    onActivityAdded();
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 z-100 flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-sm">
      <Form handleSubmit={handleSubmit}>
        <div className="mb-4 flex flex-wrap gap-2">
          {(["discussion", "vote", "ticket"] as ActivityType[]).map((activityType) => (
            <button
              key={activityType}
              type="button"
              onClick={() => setType(activityType)}
              className={`rounded-md px-3 py-2 text-sm transition ${type === activityType ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
            >
              {activityType === "discussion" ? "Discusión" : activityType === "vote" ? "Votación" : "Ticket"}
            </button>
          ))}
        </div>

        {type === "discussion" && (
          <>
            <FormInput label="Título" name="activity-title" type="text" placeholder="Ingresa un título" inputValue={title} setInputValue={setTitle} />
            <label htmlFor="activity-content" className="text-slate-400 font-medium text-sm">Contenido</label>
            <textarea
              id="activity-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="mb-4 h-40 resize-none rounded-md border border-slate-700 p-2 text-slate-300 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Contenido de la actividad"
            />
          </>
        )}

        {type === "vote" && (
          <>
            <FormInput label="Detalles" name="vote-details" type="text" placeholder="Pregunta o detalles de la votación" inputValue={details} setInputValue={setDetails} />
            <FormInput label="Opciones" name="vote-options" type="text" placeholder="Opciones separadas por comas" inputValue={options} setInputValue={setOptions} />
          </>
        )}

        {type === "ticket" && (
          <>
            <FormInput label="Ticket" name="ticket-id" type="text" placeholder="ID del ticket" inputValue={ticketId} setInputValue={setTicketId} />
            <label htmlFor="ticket-action" className="text-slate-400 font-medium text-sm">Acción</label>
            <select id="ticket-action" value={action} onChange={(event) => setAction(event.target.value as typeof action)} className="mb-4 w-full appearance-none rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-100 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-400">
              <option className="bg-slate-800 text-slate-100" value="created">Creado</option>
              <option className="bg-slate-800 text-slate-100" value="updated">Actualizado</option>
              <option className="bg-slate-800 text-slate-100" value="deleted">Eliminado</option>
              <option className="bg-slate-800 text-slate-100" value="assigned">Asignado</option>
            </select>
            <FormInput label="Asignado a (opcional)" name="assigned-to" type="text" placeholder="ID del usuario" inputValue={assignedTo} setInputValue={setAssignedTo} />
          </>
        )}

        {isLoading ? (
          <div className="self-center h-10">
            <LoaderSVG />
          </div>
        ) : (
          <div className="flex justify-between">
            <button className="bg-slate-700 p-2 rounded-md cursor-pointer text-slate-400 hover:bg-slate-600" type="button" onClick={closeModal}>
              Cancelar
            </button>
            <FormButton label="Agregar actividad" />
          </div>
        )}
      </Form>
    </div>
  );
};
