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
    (member) => member.user._id.toString() === userId.toString(),
  );
};

export const hasPermission = ({project,userId,permission}:{project:IProject, userId?:ObjectId, permission:Permission}) => {
    if (!userId) return false;
    const index = project.members.findIndex(member => member.user._id.toString() === userId.toString());
    if(index < 0) return false;

    return project.members[index].permissions?.includes(permission);
}