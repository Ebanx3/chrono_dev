import { CompletedProject, ICompletedProject } from "./schema";

export type CreateCompletedProjectRecord = Pick<
  ICompletedProject,
  | "name"
  | "details"
  | "techs"
  | "members"
  | "followers"
  | "completedAt"
  | "imageUrls"
  | "deploymentLinks"
  | "repositoryLinks"
>;

const create = async (data: CreateCompletedProjectRecord) => {
  return CompletedProject.create(data);
};

const getAll = async () => {
  return CompletedProject.find()
    .populate("members.userId", "username")
    .populate("followers", "username")
    .sort({ completedAt: -1 });
};

const getById = async (projectId: string) => {
  return CompletedProject.findById(projectId)
    .populate("members.userId", "username")
    .populate("followers", "username");
};

const getByUserId = async (userId: string) => {
  return CompletedProject.find({ "members.userId": userId })
    .populate("members.userId", "username")
    .populate("followers", "username")
    .sort({ completedAt: -1 });
}

export const CompletedProjectModel = { create, getAll, getById, getByUserId };
