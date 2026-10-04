import { Response } from "express";
import { Types } from "mongoose";
import { RequestWithData, ServerResponse } from "../../types";
import { HttpError } from "../../utils/httpError";
import { memberInProject } from "../../utils/memberInProject";
import { ProjectModel } from "../project/model";
import { ProjectActivityModel } from "./model";
import type {
  AddActivityBody,
  AddDiscussionMessageBody,
  AddVoteBody,
} from "./zod";

const addActivity = async (
  req: RequestWithData<AddActivityBody>,
  res: Response<ServerResponse>,
) => {
  const { projectId } = req.params;
  const { type } = req.body;
  const result = await ProjectActivityModel.addActivityItem({
    projectId,
    type,
    discussion:
      type === "discussion"
        ? {
            title: req.body.title,
            content: req.body.content,
            author: new Types.ObjectId(String(req.user!.id)),
            status: "open",
          }
        : undefined,
    vote:
      type === "vote"
        ? {
            details: req.body.details,
            options: req.body.options,
            votes: [],
            closesAt: req.body.closesAt,
            status: "open",
          }
        : undefined,
    ticketActivity:
      type === "ticket"
        ? {
            ticketId: new Types.ObjectId(req.body.ticketId),
            action: req.body.action,
            timestamp: new Date(),
            user: { userId: new Types.ObjectId(String(req.user!.id)) },
            assignedTo: req.body.assignedTo
              ? { userId: new Types.ObjectId(req.body.assignedTo) }
              : undefined,
          }
        : undefined,
    author: req.user!.id,
  });

  res.status(201).json({
    success: true,
    message: "Actividad agregada correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const addDiscussionMessage = async (
  req: RequestWithData<AddDiscussionMessageBody>,
  res: Response<ServerResponse>,
) => {
  const { projectId, activityId } = req.params;
  const result = await ProjectActivityModel.addDiscussionMessage({
    projectId,
    activityId,
    content: req.body.content,
    author: new Types.ObjectId(String(req.user!.id)),
  });

  res.status(201).json({
    success: true,
    message: "Mensaje agregado correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const addVote = async (
  req: RequestWithData<AddVoteBody>,
  res: Response<ServerResponse>,
) => {
  const { projectId, activityId } = req.params;
  const result = await ProjectActivityModel.addVote({
    projectId,
    activityId,
    option: req.body.option,
    userId: new Types.ObjectId(String(req.user!.id)),
  });

  res.status(201).json({
    success: true,
    message: "Voto agregado correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const getActivity = async (
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

  const result = await ProjectActivityModel.getProjectActivity(projectId);
  res.status(200).json({
    success: true,
    message: "Actividad obtenida correctamente",
    data: result,
    isLoggedIn: Boolean(req.user),
  });
};

export const ProjectActivityController = {
  addActivity,
  getActivity,
  addDiscussionMessage,
  addVote,
};
