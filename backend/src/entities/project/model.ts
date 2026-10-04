import { Types } from "mongoose";
import { IProject, Permission, Project } from "./schema";
import { HttpError } from "../../utils/httpError";

const create = async ({
  name,
  details,
  techs,
  areas,
  isPublic,
  founder,
}: {
  name: string;
  details: string;
  techs: string[];
  areas: string[];
  isPublic: boolean;
  founder: string;
}) => {
  const newProject = new Project({
    name,
    details,
    techs,
    settings: { areas, visibility: isPublic ? "public" : "private" },
    isPublic,
    founder,
    members: [],
  });
  newProject.members.push({
    user: new Types.ObjectId(founder),
    role: "founder",
    permissions: Object.values(Permission),
  });
  return newProject.save();
};

const getAll = async () => {
  return Project.find()
    .populate("founder", "username")
    .sort({ createdAt: -1 });
};

const getById = async (projectId: string) => {
  return Project.findById(projectId)
    .populate("founder", "username")
    .populate("members.user", "username")
    .populate("pendingMembers", "username");
};

const getByUserId = async (userId: string) => {
  return Project.find({
    $or: [
      { founder: userId },
      { members: { $elemMatch: { user: userId } } },
      { pendingMembers: userId },
    ],
  })
    .populate("founder", "username")
    .populate("members.user", "username")
    .populate("pendingMembers", "username");
};

const deleteById = async (projectId: string) => {
  const deletedProject = await Project.findByIdAndDelete(projectId);
  if (!deletedProject) {
    throw new HttpError(404, "Proyecto no encontrado");
  }
  return deletedProject;
};

const addResource = async (
  projectId: string,
  resource: { name: string; url: string },
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }
  project.resources.push(resource);
  return project.save();
};

const updateSettings = async (
  projectId: string,
  settings: Partial<IProject["settings"]>,
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }

  project.settings = { ...project.settings, ...settings };
  if (settings.visibility) {
    project.isPublic = settings.visibility === "public";
  }
  return project.save();
};

const joinAsPendingMember = async (projectId: string, userId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }
  if (project.isPublic) {
    project.members.push({ user: new Types.ObjectId(userId) });
    return project.save();
  }
  if (project.pendingMembers.some((member) => member.toString() === userId)) {
    throw new HttpError(409, "El usuario ya está esperando aprobación");
  }

  project.pendingMembers.push(new Types.ObjectId(userId));
  return project.save();
};

const joinAsMember = async (projectId: string, userId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }
  if (!project.isPublic) {
    throw new HttpError(403, "No puedes unirte al proyecto sin aprobación");
  }
  if (project.members.some((member) => member.user._id.toString() === userId)) {
    throw new HttpError(409, "El usuario ya es miembro en el proyecto");
  }
  if (project.membersBanned.some((member) => member.toString() === userId)) {
    throw new HttpError(403, "El usuario fue expulsado del proyecto");
  }

  project.members.push({ user: new Types.ObjectId(userId) });
  return project.save();
};

const acceptPendingMember = async (projectId: string, userId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }

  if (project.members.some((member) => member.user.toString() === userId)) {
    throw new HttpError(409, "El usuario ya es miembro del proyecto");
  }

  const isPending = project.pendingMembers.some(
    (member) => member.toString() === userId,
  );
  if (!isPending) {
    throw new HttpError(404, "El usuario no está pendiente de aprobación");
  }

  project.pendingMembers = project.pendingMembers.filter(
    (member) => member.toString() !== userId,
  );
  project.members.push({ user: new Types.ObjectId(userId) });

  return project.save();
};

const rejectPendingMember = async (projectId: string, userId: string) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new HttpError(404, "Proyecto no encontrado");
  }

  const isPending = project.pendingMembers.some(
    (member) => member.toString() === userId,
  );
  if (!isPending) {
    throw new HttpError(404, "El usuario no está pendiente de aprobación");
  }

  project.pendingMembers = project.pendingMembers.filter(
    (member) => member.toString() !== userId,
  );

  return project.save();
};

const editMember = async ({
  project,
  userId,
  role,
  permissions,
  areas,
}: {
  project: IProject;
  userId: string;
  role: string;
  permissions: Permission[];
  areas?: string[];
}) => {
  const index = project.members.findIndex(
    (member) => member.user._id.toString() === userId,
  );
  if (index < 0) {
    throw new HttpError(404, "No existe usuario con ese id como miembro del proyecto");
  }

  project.members[index].role = role;
  project.members[index].permissions = permissions;
  if (areas) project.members[index].areas = areas;
  return project.save();
}

const removeMember = async ({ project, userId }: { project: IProject; userId: string }) => {
  const memberIndex = project.members.findIndex(
    (member) => member.user._id.toString() === userId,
  );
  if (memberIndex < 0) {
    throw new HttpError(404, "No existe usuario con ese id como miembro del proyecto");
  }

  if (project.founder.toString() === userId) {
    throw new HttpError(409, "El fundador no puede ser expulsado del proyecto");
  }

  project.members.splice(memberIndex, 1);
  return project.save();
}

export const ProjectModel = {
  create,
  getAll,
  getById,
  getByUserId,
  deleteById,
  addResource,
  updateSettings,
  joinAsPendingMember,
  joinAsMember,
  acceptPendingMember,
  rejectPendingMember,
  editMember,
  removeMember,
};
