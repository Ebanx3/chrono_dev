import { Response, Request } from "express";
import { RequestWithData, ServerResponse } from "../../types";
import { validateBodyCreateProject } from "./zod";
import { ProjectModel } from "./model";
import { UserModel } from "../user/model";
import { ObjectId } from "mongoose";

const createProject = async (
  req: RequestWithData,
  res: Response<ServerResponse>
) => {
  try {
    const validatedBody = await validateBodyCreateProject(req.body);
    if (typeof validatedBody === "string") {
      res.status(400).json({ success: false, message: validatedBody });
      return;
    }

    const newProject = await ProjectModel.create({
      founderId: req.user!.id,
      founderUsername: req.user!.username,
      ...validatedBody,
    });
    if (typeof newProject === "string") {
      res.status(400).json({
        success: false,
        message: newProject,
      });
      return;
    }

    const updatedUser = await UserModel.addNewProjectToUser({userId: req.user!.id, projectId:(newProject._id as ObjectId).toString(), projectName: newProject.name  });
    if (typeof updatedUser === "string") {
      res.status(400).json({ success: false, message: updatedUser });
      return;
    }

    res.status(201).json({ success: true, message: "Ok", data:(newProject._id as ObjectId).toString() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getProjects = async ( req:RequestWithData, res:Response<ServerResponse>) => {
  try {
    const projects = await ProjectModel.getAll();

    res.status(200).json({ success: true, message: "Ok", data: projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getProjectById = async ( req:Request, res:Response<ServerResponse>) => {
  try {
    const { projectId } = req.params; 
    const project = await ProjectModel.getById(projectId);

    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Ok", data: project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const ProjectController = { createProject, getProjects, getProjectById };