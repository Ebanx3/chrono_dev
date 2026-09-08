import { Response } from "express";
import { RequestWithData, ServerResponse } from "../../types";
import { validateBodyAddResource, validateBodyCreateProject } from "./zod";
import { ProjectModel } from "./model";
import { UserModel } from "../user/model";
import { ObjectId } from "mongoose";
import { IProject, Permission } from "./schema";
import {
  hasPermission,
  memberInProject,
  pendingMemberInProject,
} from "../../utils/memberInProject";

const createProject = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const validatedBody = await validateBodyCreateProject(req.body);
    if (typeof validatedBody === "string") {
      res
        .status(400)
        .json({ success: false, message: validatedBody, isLoggedIn: true });
      return;
    }

    const newProject = await ProjectModel.create({
      founder: req.user!.id,
      ...validatedBody,
    });
    if (typeof newProject === "string") {
      res.status(400).json({
        success: false,
        message: newProject,
        isLoggedIn: true,
      });
      return;
    }

    const updatedUser = await UserModel.addNewProjectToUser({
      userId: req.user!.id,
      projectId: (newProject._id as ObjectId).toString(),
      projectName: newProject.name,
    });
    if (typeof updatedUser === "string") {
      res
        .status(400)
        .json({ success: false, message: updatedUser, isLoggedIn: true });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Proyecto creado correctamente",
      data: (newProject._id as ObjectId).toString(),
      isLoggedIn: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error del servidor", isLoggedIn: true });
  }
};

const getProjects = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const projects = await ProjectModel.getAll();

    const p = (projects as Array<IProject>).map((project: IProject) => {
      return {
        ...project.toObject(),
        iAmMember: memberInProject(project, req.user?.id),
        iAmPendingMember: pendingMemberInProject(project, req.user?.id),
      };
    });

    res.status(200).json({
      success: true,
      message: "Proyectos obtenidos correctamente",
      data: p,
      isLoggedIn: req.user ? true : false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      isLoggedIn: req.user ? true : false,
    });
  }
};

const getProjectById = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const { projectId } = req.params;
    const project = await ProjectModel.getById(projectId);

    if (!project || typeof project === "string") {
      res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
        isLoggedIn: req.user ? true : false,
      });
      return;
    }

    if (!project.isPublic && !memberInProject(project, req.user?.id)) {
      res.status(403).json({
        success: false,
        message: "Proyecto privado",
        isLoggedIn: req.user ? true : false,
      });
      return;
    }

    const member = req.user
      ? project.members.find(
          (projectMember) => projectMember.user._id.toString() === req.user!.id,
        )
      : undefined;
    const canViewPendingMembers =
      member?.permissions?.includes(Permission.PendingMembersView) === true;

    if (!canViewPendingMembers) {
      const { pendingMembers, ...projectData } = project.toObject();
      res.status(200).json({
        success: true,
        message: "Proyecto obtenido correctamente",
        data: {
          ...projectData,
          iAmMember: memberInProject(project, req.user?.id),
          iAmPendingMember: pendingMemberInProject(project, req.user?.id),
        },
        isLoggedIn: req.user ? true : false,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Proyecto obtenido correctamente",
      data: {
        ...project.toObject(),
        iAmMember: memberInProject(project, req.user?.id),
        iAmPendingMember: pendingMemberInProject(project, req.user?.id),
      },
      isLoggedIn: req.user ? true : false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      isLoggedIn: req.user ? true : false,
    });
  }
};

const addResourceToProject = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const { projectId } = req.params;
    const validatedBody = await validateBodyAddResource(req.body);

    if (typeof validatedBody === "string") {
      res.status(400).json({
        success: false,
        message: validatedBody,
        isLoggedIn: true,
      });
      return;
    }

    const { name, url } = validatedBody;

    const project = await ProjectModel.getById(projectId);
    if (project != null && typeof project != "string" && !hasPermission({ project, userId: req.user?.id, permission: Permission.PendingMembersView })) {
      res.status(403).json({ success: false, message: "No tienes permisos para realizar esta acción", isLoggedIn: true });
      return;
    }

    const result = await ProjectModel.addResource(projectId, { name, url });

    if (typeof result === "string") {
      res
        .status(400)
        .json({ success: false, message: result, isLoggedIn: true });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Recurso agregado correctamente", data: result, isLoggedIn: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error del servidor", isLoggedIn: true });
  }
};

export const ProjectController = {
  createProject,
  getProjects,
  getProjectById,
  addResourceToProject,
};
