import { Types } from "mongoose";
import { Permission, Project } from "./schema";

const create = async ({
  name,
  details,
  techs,
  isPublic,
  founder,
}: {
  name: string;
  details: String;
  techs: string[];
  isPublic: boolean;
  founder: string;
}) => {
  try {
    const newPost = new Project({
      name,
      details,
      techs,
      isPublic,
      founder,
      members: [],
    });
    newPost.members.push({
      user: new Types.ObjectId(founder),
      role: "founder",
      permissions: Object.values(Permission),
    });
    return await newPost.save();
  } catch (error) {
    console.error("Error al crear una nueva publicacion:", error);
    return "Error inesperado al crear la publicacion";
  }
};

const getAll = async () => {
  try {
    return await Project.find()
      .populate("founder", "username")
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    return "Error inesperado al obtener las publicaciones";
  }
};

const getById = async (projectId: string) => {
  try {
    return await Project.findById(projectId)
      .populate("founder", "username")
      .populate("members.user", "username");
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);
    return "Error inesperado al obtener el proyecto";
  }
};

const addResource = async (projectId: string, resource: { name: string; url: string }) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return "Proyecto no encontrado";
    }
    project.resources.push(resource);
    return await project.save();
  } catch (error) {
    console.error("Error al agregar el recurso:", error);
    return "Error inesperado al agregar el recurso";
  }
};

export const ProjectModel = { create, getAll, getById, addResource };
