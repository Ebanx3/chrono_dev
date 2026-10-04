import { Types } from "mongoose";
import { Project } from "../project/schema";
import { Ticket } from "./schema";
import { HttpError } from "../../utils/httpError";

export const ProjectTicketModel = {
  async getProjectTickets(projectId: string) {
    return Ticket.find({ projectId })
      .populate("assignedTo.userId", "username")
      .sort({ ticketId: 1 });
  },

  async createTicket({
    projectId,
    title,
    area,
    description,
    durationDays,
  }: {
    projectId: string;
    title: string;
    area: string;
    description?: string;
    durationDays: number;
  }) {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new HttpError(404, "Proyecto no encontrado");
    }

    const normalizedArea = area.trim();
    const projectAreas = (project.settings.areas ?? []).map((currentArea) => currentArea.toLowerCase());
    if (!projectAreas.includes(normalizedArea.toLowerCase())) {
      throw new HttpError(400, "El área del ticket debe corresponder a una de las áreas del proyecto");
    }

    const newTicket = new Ticket({
      projectId,
      title,
      area: normalizedArea,
      description: description ?? "",
      durationDays,
      status: "available",
    });

    return newTicket.save();
  },

  async requestTicket({
    projectId,
    ticketId,
    userId,
  }: {
    projectId: string;
    ticketId: string;
    userId: string;
  }) {
    const ticket = await Ticket.findOne({ _id: ticketId, projectId });
    if (!ticket) {
      throw new HttpError(404, "Ticket no encontrado");
    }

    if (ticket.status === "done") {
      throw new HttpError(409, "El ticket ya está finalizado");
    }

    if (ticket.status !== "available") {
      throw new HttpError(409, "Este ticket no está disponible para solicitar");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw new HttpError(404, "Proyecto no encontrado");
    }

    const member = project.members.find(
      (currentMember) => currentMember.user.toString() === userId,
    );
    if (!member) {
      throw new HttpError(403, "Debes ser miembro del proyecto para solicitar tickets");
    }

    const memberAreas = (member.areas ?? []).map((currentArea) => currentArea.toLowerCase());
    const ticketArea = ticket.area.toLowerCase();
    const matchesMemberArea = memberAreas.includes(ticketArea);

    if (!matchesMemberArea) {
      throw new HttpError(403, "Este ticket no corresponde a ninguna de tus áreas o habilidades");
    }

    ticket.status = "requested";
    ticket.assignedTo = { userId: new Types.ObjectId(userId) };
    return ticket.save();
  },

  async assignTicket({
    projectId,
    ticketId,
    userId,
  }: {
    projectId: string;
    ticketId: string;
    userId: string;
  }) {
    const ticket = await Ticket.findOne({ _id: ticketId, projectId });
    if (!ticket) {
      throw new HttpError(404, "Ticket no encontrado");
    }

    if (ticket.status === "done") {
      throw new HttpError(409, "No se puede reasignar un ticket finalizado");
    }

    const project = await Project.findById(projectId);
    if (!project) {
      throw new HttpError(404, "Proyecto no encontrado");
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === userId,
    );
    if (!isMember) {
      throw new HttpError(400, "El usuario asignado debe ser miembro del proyecto");
    }

    ticket.status = "in-progress";
    ticket.assignedTo = { userId: new Types.ObjectId(userId) };
    return ticket.save();
  },

  async finishTicket({
    projectId,
    ticketId,
  }: {
    projectId: string;
    ticketId: string;
  }) {
    const ticket = await Ticket.findOne({ _id: ticketId, projectId });
    if (!ticket) {
      throw new HttpError(404, "Ticket no encontrado");
    }

    if (ticket.status === "done") {
      throw new HttpError(409, "El ticket ya fue marcado como terminado");
    }

    ticket.status = "done";
    return ticket.save();
  },
};
