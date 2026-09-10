import { Types } from "mongoose";
import { IProject, Permission, Project } from "./schema";

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
      .populate("members.user", "username")
      .populate("pendingMembers","username");
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);
    return "Error inesperado al obtener el proyecto";
  }
};

const addResource = async (
  projectId: string,
  resource: { name: string; url: string },
) => {
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

const joinAsPendingMember = async (projectId: string, userId: string) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return "Proyecto no encontrado";
    }
    if (project.isPublic) {
      project.members.push({ user: new Types.ObjectId(userId) });
      return await project.save();
    }
    if (project.pendingMembers.some((member) => member.toString() === userId))
      return "El usuario ya está esperando aprobación";

    project.pendingMembers.push(new Types.ObjectId(userId));
    return await project.save();
  } catch (error) {
    console.error("Error al agregar el recurso:", error);
    return "Error inesperado al agregar el recurso";
  }
};

const joinAsMember = async (projectId: string, userId: string) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return "Proyecto no encontrado";
    }
    if (!project.isPublic) return "No puedes unirte al proyecto sin aprobación";
    if (project.members.some((member) => member.user._id.toString() === userId))
      return "El usuario ya es miembro en el proyecto";
    if (project.membersBanned.some((member) => member.toString() === userId))
      return "El usuario fue expulsado del proyecto";

    project.members.push({ user: new Types.ObjectId(userId) });
    return await project.save();
  } catch (error) {
    console.error("Error al agregar el recurso:", error);
    return "Error inesperado al agregar el recurso";
  }
};

const acceptPendingMember = async (projectId: string, userId: string) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return "Proyecto no encontrado";
    }

    if (project.members.some((member) => member.user.toString() === userId)) {
      return "El usuario ya es miembro del proyecto";
    }

    const isPending = project.pendingMembers.some(
      (member) => member.toString() === userId,
    );
    if (!isPending) {
      return "El usuario no está pendiente de aprobación";
    }

    project.pendingMembers = project.pendingMembers.filter(
      (member) => member.toString() !== userId,
    );
    project.members.push({ user: new Types.ObjectId(userId) });

    return await project.save();
  } catch (error) {
    console.error("Error al aceptar al miembro pendiente:", error);
    return "Error inesperado al aceptar al miembro";
  }
};

const rejectPendingMember = async (projectId: string, userId: string) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return "Proyecto no encontrado";
    }

    const isPending = project.pendingMembers.some(
      (member) => member.toString() === userId,
    );
    if (!isPending) {
      return "El usuario no está pendiente de aprobación";
    }

    project.pendingMembers = project.pendingMembers.filter(
      (member) => member.toString() !== userId,
    );

    return await project.save();
  } catch (error) {
    console.error("Error al rechazar al miembro pendiente:", error);
    return "Error inesperado al rechazar al miembro";
  }
};

const editMember = async ({
  project,
  userId,
  role,
  permissions,
}: {
  project: IProject;
  userId: string;
  role: string;
  permissions: Permission[];
}) => {
  try {
    const index = project.members.findIndex(
      (member) => member.user._id.toString() === userId,
    );
    if (index < 0) return "No existe usuario con ese id como miembro del proyecto";

    project.members[index].role = role;
    project.members[index].permissions = permissions;
    return await project.save();
  } catch (error) {
    console.error("Error al modificar las opciones del miembro:", error);
    return "Error inesperado al modificar las opciones del miembro";
  }
}

const removeMember = async ({ project, userId }: { project: IProject; userId: string }) => {
  try {
    const memberIndex = project.members.findIndex(
      (member) => member.user._id.toString() === userId,
    );
    if (memberIndex < 0) return "No existe usuario con ese id como miembro del proyecto";

    if (project.founder.toString() === userId) {
      return "El fundador no puede ser expulsado del proyecto";
    }

    project.members.splice(memberIndex, 1);
    return await project.save();
  } catch (error) {
    console.error("Error al expulsar al miembro:", error);
    return "Error inesperado al expulsar al miembro";
  }
}

export const ProjectModel = {
  create,
  getAll,
  getById,
  addResource,
  joinAsPendingMember,
  joinAsMember,
  acceptPendingMember,
  rejectPendingMember,
  editMember,
  removeMember,
};
