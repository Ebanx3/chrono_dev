import { RequestHandler } from "express";
import { Permission } from "../entities/project/schema";
import { ProjectModel } from "../entities/project/model";
import { hasPermission } from "../utils/memberInProject";
import { HttpError } from "../utils/httpError";
import { RequestWithData } from "../types";

export const mustHavePermission = (permission: Permission): RequestHandler => {
  return async (req, _res, next) => {
    const { projectId } = req.params;
    const userId = (req as RequestWithData).user?.id;

    if (!userId) {
      throw new HttpError(401, "Unauthorized");
    }
    if (!projectId) {
      throw new HttpError(400, "Falta el identificador del proyecto");
    }

    const project = await ProjectModel.getById(projectId);
    if (project === null) {
      throw new HttpError(404, "Proyecto no encontrado");
    }

    if (!hasPermission({ project, userId, permission })) {
      throw new HttpError(403, "No tienes permisos para realizar esta acción");
    }

    next();
  };
};