import { Types } from "mongoose";
import { ActivityItemType } from "../../types";
import {
  ActivityItem,
  Discussion,
  TicketsActivity,
  Vote,
} from "./schema";

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
      break;
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
  try {
    const newActivityItem = new ActivityItem(
      createItem({
        type,
        discussion,
        vote,
        ticketActivity,
        author,
        projectId
      }),
    );

    return await newActivityItem.save();
  } catch (error) {
    console.error("Error al crear una nueva actividad:", error);
    return "Error inesperado al crear la actividad";
  }
};

const getProjectActivity = async (projectId:string) => {
  try {
    return await ActivityItem.find({ projectId })
      .populate("author", "username")
      .populate("discussion.author", "username")
      .populate("discussion.messages.author", "username")
      .populate("ticketActivity.assignedTo", "username");
  } catch (error) {
    console.error("Error al obtener la actividad del proyecto:", error);
    return "Error al obtener la actividad del proyecto";
  }
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
  try {
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

    return activity ?? "Discusión no encontrada o cerrada";
  } catch (error) {
    console.error("Error al agregar el mensaje a la discusión:", error);
    return "Error inesperado al agregar el mensaje";
  }
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
  try {
    const activity = await ActivityItem.findOneAndUpdate(
      {
        _id: activityId,
        projectId,
        type: "vote",
        "vote.status": "open",
        "vote.options": option,
        "vote.votes.userId": { $ne: userId },
      },
      { $push: { "vote.votes": { userId, option } } },
      { new: true, runValidators: true },
    );

    return activity ?? "Votación no encontrada, cerrada o ya respondida";
  } catch (error) {
    console.error("Error al agregar el voto:", error);
    return "Error inesperado al agregar el voto";
  }
};

export const ProjectActivityModel = {
  addActivityItem,
  getProjectActivity,
  addDiscussionMessage,
  addVote,
};
