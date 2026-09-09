import { ObjectId } from "mongoose";
import { IProject, Permission } from "../entities/project/schema";

export const memberInProject = (project: IProject, userId?: ObjectId) => {
  if (!userId) return false;
  return project.members.some(
    (member) => member.user._id.toString() === userId.toString(),
  );
};

export const pendingMemberInProject = (
  project: IProject,
  userId?: ObjectId,
) => {
  if (!userId) return false;
  return project.pendingMembers.some(
    (member) => member.toString() === userId.toString(),
  );
};

// export const hasPermission = ({
//   project,
//   userId,
//   permission,
// }: {
//   project: IProject;
//   userId?: ObjectId;
//   permission: Permission;
// }): boolean => {
//   if (!userId) return false;
//   const index = project.members.findIndex(
//     (member) => member.user._id.toString() === userId.toString(),
//   );
//   if (index < 0) return false;

//   return Boolean(project.members[index].permissions?.includes(permission));
// };

export const hasPermission = ({
  project,
  userId,
  permission,
}: {
  project: IProject;
  userId?: ObjectId;
  permission: Permission;
}): boolean => {
  if (!userId) return false;

  const member = project.members.find((entry) => {
    const currentUserId =
      typeof entry.user === "string"
        ? entry.user
        : entry.user?._id?.toString() ?? entry.user?.toString();

    return currentUserId === userId.toString();
  });

  if (!member) return false;

  return Boolean(member.permissions?.includes(permission));
};

export const projectWithUserFlags = (project: IProject, userId?: ObjectId) => {
  const projectObject = project.toObject ? project.toObject() : project;

  const iAmMember = memberInProject(project, userId);
  const iAmPendingMember = pendingMemberInProject(project, userId);

  const permissionFlags = Object.values(Permission).reduce<
    Record<string, boolean>
  >((acc, permission) => {
    acc[permission] = hasPermission({ project, userId, permission });
    return acc;
  }, {});

  return {
    ...projectObject,
    iAmMember,
    iAmPendingMember,
    permissions: { ...permissionFlags },
  };
};
