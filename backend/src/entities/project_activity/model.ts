import { Types } from "mongoose";
import { ActivityItemType } from "../../types";
import {
  ActivityItem,
  Discussion,
  TicketsActivity,
  Vote,
} from "./schema";
import { HttpError } from "../../utils/httpError";

const createItem = ({
  type,
  discussion,
  vote,
  ticketActivity,
  author,
  projectId
}: {
  type: ActivityItemType;
  discussion?: Discussion;
  vote?: Vote;
  ticketActivity?: TicketsActivity;
  author:string;
  projectId:string;
}) => {
  switch (type) {
    case "discussion":
      return {
        type,
        author,
        projectId,
        discussion,
      };
    case "vote":
      return {
        type,
        author,
        projectId,
        vote,
      };
    case "ticket":
      return {
        type,
        author,
        projectId,
        ticketActivity,
      };
    default:
      throw new HttpError(400, "Tipo de actividad no válido");
  }
};

const addActivityItem = async ({
  projectId,
  type,
  discussion,
  vote,
  ticketActivity,
  author
}: {
  projectId: string;
  type: ActivityItemType;
  discussion?: Discussion;
  vote?: Vote;
  ticketActivity?: TicketsActivity;
  author:string
}) => {
  const newActivityItem = new ActivityItem(
    createItem({
      type,
      discussion,
      vote,
      ticketActivity,
      author,
      projectId,
    }),
  );

  return newActivityItem.save();
};

const getProjectActivity = async (projectId:string) => {
  return ActivityItem.find({ projectId })
    .sort({ createdAt: -1 })
    .populate("author", "username")
    .populate("discussion.author", "username")
    .populate("discussion.messages.author", "username")
    .populate("ticketActivity.assignedTo", "username");
}

const addDiscussionMessage = async ({
  projectId,
  activityId,
  content,
  author,
}: {
  projectId: string;
  activityId: string;
  content: string;
  author: Types.ObjectId;
}) => {
  const activity = await ActivityItem.findOneAndUpdate(
    {
      _id: activityId,
      projectId,
      type: "discussion",
      "discussion.status": "open",
    },
    { $push: { "discussion.messages": { content, author } } },
    { new: true, runValidators: true },
  );

  if (!activity) {
    throw new HttpError(404, "Discusión no encontrada o cerrada");
  }

  return activity;
};

const addVote = async ({
  projectId,
  activityId,
  option,
  userId,
}: {
  projectId: string;
  activityId: string;
  option: string;
  userId: Types.ObjectId;
}) => {
  const activity = await ActivityItem.findOneAndUpdate(
    {
      _id: activityId,
      projectId,
      type: "vote",
      "vote.status": "open",
      "vote.options": option,
      "vote.votes.userId": { $ne: userId },
      $or: [
        { "vote.closesAt": { $exists: false } },
        { "vote.closesAt": { $gt: new Date() } },
      ],
    },
    { $push: { "vote.votes": { userId, option } } },
    { new: true, runValidators: true },
  );

  if (!activity) {
    throw new HttpError(
      409,
      "Votación no encontrada, cerrada, vencida o ya respondida",
    );
  }

  return activity;
};

export const ProjectActivityModel = {
  addActivityItem,
  getProjectActivity,
  addDiscussionMessage,
  addVote,
};
