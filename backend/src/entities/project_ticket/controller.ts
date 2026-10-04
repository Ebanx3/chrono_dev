import { Response } from "express";
import { RequestWithData, ServerResponse } from "../../types";
import type { AssignTicketBody, CreateTicketBody } from "./zod";
import { ProjectModel } from "../project/model";
import { ProjectTicketModel } from "./model";
import { memberInProject } from "../../utils/memberInProject";
import { HttpError } from "../../utils/httpError";

const getProjectTickets = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const { projectId } = req.params;
  const project = await ProjectModel.getById(projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }

  if (!project.isPublic && !memberInProject(project, req.user?.id)) {
    throw new HttpError(403, "Proyecto privado");
  }

  const result = await ProjectTicketModel.getProjectTickets(projectId);
  res.status(200).json({
    success: true,
    message: "Tickets obtenidos correctamente",
    data: result,
    isLoggedIn: !!req.user,
  });
};

const createTicket = async (
  req: RequestWithData<CreateTicketBody>,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectTicketModel.createTicket({
    projectId: req.params.projectId,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    message: "Ticket creado correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const requestTicket = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectTicketModel.requestTicket({
    projectId: req.params.projectId,
    ticketId: req.params.ticketId,
    userId: req.user!.id,
  });

  res.status(200).json({
    success: true,
    message: "Ticket solicitado correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const assignTicket = async (
  req: RequestWithData<AssignTicketBody>,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectTicketModel.assignTicket({
    projectId: req.params.projectId,
    ticketId: req.params.ticketId,
    userId: req.body.userId,
  });

  res.status(200).json({
    success: true,
    message: "Ticket asignado correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const finishTicket = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectTicketModel.finishTicket({
    projectId: req.params.projectId,
    ticketId: req.params.ticketId,
  });

  res.status(200).json({
    success: true,
    message: "Ticket cerrado correctamente",
    data: result,
    isLoggedIn: true,
  });
};

export const ProjectTicketsController = {
  getProjectTickets,
  createTicket,
  requestTicket,
  assignTicket,
  finishTicket,}