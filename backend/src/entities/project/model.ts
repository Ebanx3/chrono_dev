import { Project } from "./schema";

const create = async ({
  name,
  details,
  techs,
  isPublic,
  founderId,
  founderUsername,
}: {
  name: string;
  details: String;
  techs: string[];
  isPublic: boolean;
  founderId: string;
  founderUsername: string;
}) => {
  try {
    const newPost = new Project({
      name,
      details,
      techs,
      isPublic,
      founderId,
      founderUsername,
    });
    return await newPost.save();
  } catch (error) {
    console.error("Error al crear una nueva publicacion:", error);
    return "Error inesperado al crear la publicacion";
  }
};


const getAll = async () => {
  try {
    return await Project.find();
  } catch (error) {
    console.error("Error al obtener las publicaciones:", error);
    return "Error inesperado al obtener las publicaciones";
  }
};

export const ProjectModel = { create, getAll };