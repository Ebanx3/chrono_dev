import { Response } from "express";
import { Types } from "mongoose";
import { RequestWithData, ServerResponse } from "../../types";
import { hasPermission, memberInProject } from "../../utils/memberInProject";
import { Permission } from "../project/schema";
import { ProjectModel } from "../project/model";
import { ProjectActivityModel } from "./model";
import { validateBodyAddActivity } from "./zod";

const addActivity = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const { projectId } = req.params;
    const validatedBody = await validateBodyAddActivity(req.body);
    if (typeof validatedBody === "string") {
      res
        .status(400)
        .json({ success: false, message: validatedBody, isLoggedIn: true });
      return;
    }

    const project = await ProjectModel.getById(projectId);
    if (!project || typeof project === "string") {
      res
        .status(404)
        .json({
          success: false,
          message: "Proyecto no encontrado",
          isLoggedIn: true,
        });
      return;
    }
    if (
      !hasPermission({
        project,
        userId: req.user!.id,
        permission: Permission.ActivityAdd,
      })
    ) {
      res
        .status(403)
        .json({
          success: false,
          message: "No tienes permisos para realizar esta acción",
          isLoggedIn: true,
        });
      return;
    }

    const { type } = validatedBody;
    const result = await ProjectActivityModel.addActivityItem({
      projectId,
      type,
      discussion:
        type === "discussion"
          ? {
              title: validatedBody.title,
              content: validatedBody.content,
              author: { userId: new Types.ObjectId(req.user!.id) },
              status: "open",
            }
          : undefined,
      vote:
        type === "vote"
          ? {
              details: validatedBody.details,
              options: validatedBody.options,
              votes: [],
              status: "open",
            }
          : undefined,
      ticketActivity:
        type === "ticket"
          ? {
              ticketId: new Types.ObjectId(validatedBody.ticketId),
              action: validatedBody.action,
              timestamp: new Date(),
              user: { userId: new Types.ObjectId(req.user!.id) },
              assignedTo: validatedBody.assignedTo
                ? { userId: new Types.ObjectId(validatedBody.assignedTo) }
                : undefined,
            }
          : undefined,
      author: req.user!.id,
    });

    if (typeof result === "string") {
      res
        .status(400)
        .json({ success: false, message: result, isLoggedIn: true });
      return;
    }
    res
      .status(201)
      .json({
        success: true,
        message: "Actividad agregada correctamente",
        data: result,
        isLoggedIn: true,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error del servidor",
        isLoggedIn: true,
      });
  }
};

const getActivity = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const { projectId } = req.params;
    const project = await ProjectModel.getById(projectId);
    if (!project || typeof project === "string") {
      res
        .status(404)
        .json({
          success: false,
          message: "Proyecto no encontrado",
          isLoggedIn: !!req.user,
        });
      return;
    }
    if (!project.isPublic && !memberInProject(project, req.user?.id)) {
      res
        .status(403)
        .json({
          success: false,
          message: "Proyecto privado",
          isLoggedIn: !!req.user,
        });
      return;
    }

    const result = await ProjectActivityModel.getProjectActivity(projectId);
    if (!result || typeof result === "string") {
      res
        .status(404)
        .json({
          success: false,
          message: "Actividad del proyecto no encontrada",
          isLoggedIn: !!req.user,
        });
      return;
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Actividad obtenida correctamente",
        data: result,
        isLoggedIn: !!req.user,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error del servidor",
        isLoggedIn: !!req.user,
      });
  }
};

export const ProjectActivityController = { addActivity, getActivity };
