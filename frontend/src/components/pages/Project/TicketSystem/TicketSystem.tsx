import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    assignTicket,
    createTicket,
    finishTicket,
    getProjectTickets,
    requestTicket,
} from "../../../../api/project";

const statusLabels: Record<ProjectTicket["status"], string> = {
    available: "Disponible",
    requested: "Solicitado",
    "in-progress": "En progreso",
    done: "Finalizado",
};

const getAssignee = (ticket: ProjectTicket) => {
    const userId = ticket.assignedTo?.userId;
    return typeof userId === "object" ? userId : undefined;
};

export const TicketSystem = ({ project }: { project: ProjectWithUserFlags }) => {
    const [tickets, setTickets] = useState<ProjectTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [busyTicketId, setBusyTicketId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [title, setTitle] = useState("");
    const [area, setArea] = useState(project.settings.areas[0] ?? "");
    const [description, setDescription] = useState("");
    const [durationDays, setDurationDays] = useState("1");
    const canCreate = Boolean(project.permissions["project.tickets.create"]);
    const canRequest = Boolean(project.permissions["project.tickets.request"]);
    const canAssign = Boolean(project.permissions["project.tickets.assign"]);
    const canFinish = Boolean(project.permissions["project.tickets.edit"]);

    useEffect(() => {
        let isActive = true;

        const fetchTickets = async () => {
            setLoading(true);
            const result = await getProjectTickets(project._id);
            if (!isActive) return;
            if (!result.success || !("data" in result)) {
                toast.error(result.message);
            } else {
                setTickets(result.data);
            }
            setLoading(false);
        };

        void fetchTickets();
        return () => {
            isActive = false;
        };
    }, [project._id]);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        const result = await createTicket({
            projectId: project._id,
            title: title.trim(),
            area,
            description: description.trim(),
            durationDays: Number(durationDays),
        });
        setSaving(false);

        if (!result.success) {
            toast.error(result.message);
            return;
        }

        if (!result.success || !('data' in result)) {
            toast.error(result.message);
            return;
        }

        setTickets((current) => [...current, result.data]);
        setTitle("");
        setDescription("");
        setDurationDays("1");
        setCreating(false);
        toast.success("Ticket creado correctamente");
    };

    const performTicketAction = async (
        ticketId: string,
        action: () => Promise<ServerResponse<ProjectTicket>>,
        successMessage: string,
    ) => {
        setBusyTicketId(ticketId);
        const result = await action();
        setBusyTicketId(null);
        if (!result.success) {
            toast.error(result.message);
            return;
        }
        setTickets((current) =>
            current.map((ticket) => ticket._id === ticketId ? result.data : ticket),
        );
        toast.success(successMessage);
    };

    const filteredTickets = statusFilter === "all"
        ? tickets
        : tickets.filter((ticket) => ticket.status === statusFilter);

    return (
        <section className="mt-10 border-t border-slate-800 pt-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-200">Tickets</h2>
                    <p className="mt-1 text-sm text-slate-500">{tickets.length} en total</p>
                </div>
                <div className="flex items-center gap-3">
                    <label htmlFor="ticket-status-filter" className="sr-only">Filtrar tickets por estado</label>
                    <select
                        id="ticket-status-filter"
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-slate-500"
                    >
                        <option value="all">Todos los estados</option>
                        {Object.entries(statusLabels).map(([status, label]) => (
                            <option key={status} value={status}>{label}</option>
                        ))}
                    </select>
                    {canCreate && (
                        <button
                            type="button"
                            onClick={() => setCreating((current) => !current)}
                            className="rounded-md bg-purple-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-purple-600"
                        >
                            {creating ? "Cancelar" : "Crear ticket"}
                        </button>
                    )}
                </div>
            </div>

            {creating && canCreate && (
                <form onSubmit={handleCreate} className="mb-6 grid gap-4 rounded-md border border-slate-800 bg-slate-950/50 p-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm text-slate-400">
                        Título
                        <input
                            required
                            minLength={3}
                            maxLength={120}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="rounded-md border border-slate-700 bg-slate-900 p-2 text-slate-200 outline-none focus:border-slate-500"
                        />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-slate-400">
                        Área
                        <select
                            required
                            value={area}
                            onChange={(event) => setArea(event.target.value)}
                            className="rounded-md border border-slate-700 bg-slate-900 p-2 text-slate-200 outline-none focus:border-slate-500"
                        >
                            <option value="" disabled>Selecciona un área</option>
                            {project.settings.areas.map((projectArea) => (
                                <option key={projectArea} value={projectArea}>{projectArea}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-slate-400">
                        Duración estimada (días)
                        <input
                            required
                            type="number"
                            min={1}
                            max={365}
                            value={durationDays}
                            onChange={(event) => setDurationDays(event.target.value)}
                            className="rounded-md border border-slate-700 bg-slate-900 p-2 text-slate-200 outline-none focus:border-slate-500"
                        />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-slate-400 sm:col-span-2">
                        Descripción
                        <textarea
                            maxLength={2000}
                            rows={3}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            className="resize-y rounded-md border border-slate-700 bg-slate-900 p-2 text-slate-200 outline-none focus:border-slate-500"
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={saving || project.settings.areas.length === 0}
                        className="rounded-md bg-purple-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 sm:justify-self-end"
                    >
                        {saving ? "Creando..." : "Guardar ticket"}
                    </button>
                    {project.settings.areas.length === 0 && (
                        <p className="text-sm text-amber-300 sm:col-span-2">Configura al menos un área en el proyecto para crear tickets.</p>
                    )}
                </form>
            )}

            {loading ? (
                <p className="py-8 text-center text-sm text-slate-500">Cargando tickets...</p>
            ) : filteredTickets.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                    {tickets.length === 0 ? "Todavía no hay tickets." : "No hay tickets con este estado."}
                </p>
            ) : (
                <div className="divide-y divide-slate-800 border-y border-slate-800">
                    {filteredTickets.map((ticket) => {
                        const assignee = getAssignee(ticket);
                        const isBusy = busyTicketId === ticket._id;

                        return (
                            <article key={ticket._id} className="grid gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-semibold text-slate-500">#{ticket.ticketId}</span>
                                        <h3 className="font-semibold text-slate-200">{ticket.title}</h3>
                                        <span className="rounded-sm bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{ticket.area}</span>
                                        <span className="text-xs text-slate-400">{statusLabels[ticket.status]}</span>
                                    </div>
                                    {ticket.description && <p className="mt-2 whitespace-pre-line text-sm text-slate-400">{ticket.description}</p>}
                                    <p className="mt-2 text-xs text-slate-500">
                                        {assignee ? `Asignado a ${assignee.username}` : "Sin asignar"} · {ticket.durationDays} {ticket.durationDays === 1 ? "día" : "días"}
                                        {ticket.dueDate && ` · Fecha límite ${new Date(ticket.dueDate).toLocaleDateString()}`}
                                    </p>
                                </div>

                                {(canRequest || canAssign || canFinish) && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {canRequest && project.iAmMember && ticket.status === "available" && (
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() => void performTicketAction(
                                                    ticket._id,
                                                    () => requestTicket({ projectId: project._id, ticketId: ticket._id }),
                                                    "Ticket solicitado correctamente",
                                                )}
                                                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                                            >
                                                Solicitar
                                            </button>
                                        )}
                                        {canAssign && ticket.status !== "done" && project.members.length > 0 && (
                                            <label className="flex items-center gap-2 text-sm text-slate-400">
                                                <span className="sr-only">Asignar {ticket.title} a</span>
                                                <select
                                                    defaultValue=""
                                                    disabled={isBusy}
                                                    onChange={(event) => {
                                                        if (event.target.value) {
                                                            void performTicketAction(
                                                                ticket._id,
                                                                () => assignTicket({ projectId: project._id, ticketId: ticket._id, userId: event.target.value }),
                                                                "Ticket asignado correctamente",
                                                            );
                                                            event.target.value = "";
                                                        }
                                                    }}
                                                    className="max-w-44 rounded-md border border-slate-700 bg-slate-900 px-2 py-2 text-sm text-slate-200 outline-none focus:border-slate-500 disabled:opacity-50"
                                                >
                                                    <option value="">Asignar a...</option>
                                                    {project.members.map((member) => (
                                                        <option key={member.user._id} value={member.user._id}>{member.user.username}</option>
                                                    ))}
                                                </select>
                                            </label>
                                        )}
                                        {canFinish && ticket.status !== "done" && (
                                            <button
                                                type="button"
                                                disabled={isBusy}
                                                onClick={() => void performTicketAction(
                                                    ticket._id,
                                                    () => finishTicket({ projectId: project._id, ticketId: ticket._id }),
                                                    "Ticket finalizado correctamente",
                                                )}
                                                className="rounded-md border border-emerald-800 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-950 disabled:opacity-50"
                                            >
                                                Finalizar
                                            </button>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};