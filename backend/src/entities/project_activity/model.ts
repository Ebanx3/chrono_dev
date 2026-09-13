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
      .populate("messages.author", "username")
      .populate("ticketActivity.assignedTo", "username");
  } catch (error) {
    console.error("Error al obtener la actividad del proyecto:", error);
    return "Error al obtener la actividad del proyecto";
  }
}

export const ProjectActivityModel = { addActivityItem, getProjectActivity };
