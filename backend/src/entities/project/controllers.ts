import { Response } from "express";
import { RequestWithData, ServerResponse } from "../../types";
import { ProjectModel } from "./model";
import { CompletedProjectModel } from "../completed_project/model";
import type { CreateCompletedProjectInput } from "../completed_project/zod";
import type {
  AddResourceBody,
  CreateProjectBody,
  EditMemberBody,
  UpdateProjectSettingsBody,
} from "./zod";
import { UserModel } from "../user/model";
import { ObjectId } from "mongoose";
import { IProject} from "./schema";
import { HttpError } from "../../utils/httpError";
import {
  memberInProject,
  pendingMemberInProject,
  projectWithUserFlags,
} from "../../utils/memberInProject";

const createProject = async (
  req: RequestWithData<CreateProjectBody>,
  res: Response<ServerResponse>,
) => {
    const newProject = await ProjectModel.create({
      founder: req.user!.id,
      ...req.body,
    });

    const updatedUser = await UserModel.addNewProjectToUser({
      userId: req.user!.id,
      projectId: (newProject._id as ObjectId).toString(),
      projectName: newProject.name,
    });
    if (!updatedUser) {
      throw new HttpError(404, "Usuario no encontrado");
    }

    res.status(201).json({
      success: true,
      message: "Proyecto creado correctamente",
      data: (newProject._id as ObjectId).toString(),
      isLoggedIn: true,
    });
};

const getProjects = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const projects = await ProjectModel.getAll();
  const data = projects.map((project: IProject) => ({
    ...project.toObject(),
    iAmMember: memberInProject(project, req.user?.id),
    iAmPendingMember: pendingMemberInProject(project, req.user?.id),
  }));

  res.status(200).json({
    success: true,
    message: "Proyectos obtenidos correctamente",
    data,
    isLoggedIn: Boolean(req.user),
  });
};

const getProjectsByUserId = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const { userId } = req.params;
  const projects = await ProjectModel.getByUserId(userId);
  const data = projects.map((project: IProject) => ({
    ...project.toObject(),
    iAmMember: memberInProject(project, req.user?.id),
    iAmPendingMember: pendingMemberInProject(project, req.user?.id),
  }));

  res.status(200).json({
    success: true,
    message: "Proyectos obtenidos correctamente",
    data,
    isLoggedIn: Boolean(req.user),
  });
};

const getProjectById = async (
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

  res.status(200).json({
    success: true,
    message: "Proyecto obtenido correctamente",
    data: projectWithUserFlags(project, req.user?.id),
    isLoggedIn: Boolean(req.user),
  });
};

const completeProject = async (
  req: RequestWithData<CreateCompletedProjectInput>,
  res: Response<ServerResponse>,
) => {
  const project = await ProjectModel.getById(req.params.projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }

  const completedProject = await CompletedProjectModel.create({
    ...req.body,
    name: project.name,
    details: project.details,
    techs: project.techs,
    members: project.members.map((member) => ({
      userId: member.user._id,
      role: member.role ?? "member",
    })),
    followers: project.followers,
    completedAt: new Date(),
  });

  await ProjectModel.deleteById(req.params.projectId);

  res.status(201).json({
    success: true,
    message: "Proyecto finalizado correctamente",
    data: completedProject._id,
    isLoggedIn: true,
  });
};

const addResourceToProject = async (
  req: RequestWithData<AddResourceBody>,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectModel.addResource(req.params.projectId, req.body);
  res.status(200).json({
    success: true,
    message: "Recurso agregado correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const updateProjectSettings = async (
  req: RequestWithData<UpdateProjectSettingsBody>,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectModel.updateSettings(
    req.params.projectId,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: "Ajustes del proyecto actualizados correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const joinAsPendingMember = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectModel.joinAsPendingMember(
    req.params.projectId,
    req.user!.id,
  );

  res.status(200).json({
    success: true,
    message: "Solicitud enviada correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const joinAsMember = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectModel.joinAsMember(
    req.params.projectId,
    req.user!.id,
  );

  res.status(200).json({
    success: true,
    message: "Solicitud enviada correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const acceptPendingMember = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectModel.acceptPendingMember(
    req.params.projectId,
    req.params.userId,
  );

  res.status(200).json({
    success: true,
    message: "Miembro aceptado correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const rejectPendingMember = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const result = await ProjectModel.rejectPendingMember(
    req.params.projectId,
    req.params.userId,
  );

  res.status(200).json({
    success: true,
    message: "Miembro rechazado correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const editMember = async (
  req: RequestWithData<EditMemberBody>,
  res: Response<ServerResponse>,
) => {
  const { projectId, userId } = req.params;
  const project = await ProjectModel.getById(projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }

  const result = await ProjectModel.editMember({
    project,
    userId,
    role: req.body.role,
    permissions: req.body.permissions,
    areas: req.body.areas,
  });

  res.status(200).json({
    success: true,
    message: "Opciones del miembro actualizadas correctamente",
    data: result,
    isLoggedIn: true,
  });
};

const removeMember = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const { projectId, userId } = req.params;
  const project = await ProjectModel.getById(projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }

  const result = await ProjectModel.removeMember({ project, userId });
  res.status(200).json({
    success: true,
    message: "Miembro expulsado correctamente",
    data: result,
    isLoggedIn: true,
  });
};



export const ProjectController = {
  createProject,
  getProjects,
  getProjectById,
  completeProject,
  getProjectsByUserId,
  addResourceToProject,
  updateProjectSettings,
  joinAsPendingMember,
  joinAsMember,
  acceptPendingMember,
  rejectPendingMember,
  editMember,
  removeMember,

};
