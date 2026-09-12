import { Types } from "mongoose";
import { ActivityItemType } from "../../types";
import {
  ActivityItem,
  Discussion,
  ProjectActivity,
  TicketsActivity,
  Vote,
} from "./schema";

const createItem = ({
  type,
  discussion,
  vote,
  ticketActivity,
}: {
  type: ActivityItemType;
  discussion?: Discussion;
  vote?: Vote;
  ticketActivity?: TicketsActivity;
}) => {
  switch (type) {
    case "discussion":
      return {
        title: discussion!.title,
        content: discussion!.content,
        author: discussion!.author,
      };
    case "vote":
      return {
        details: vote!.details,
        options: vote!.options,
      };
    case "ticket":
      return {
        ticketId: ticketActivity!.ticketId,
        action: ticketActivity!.action,
        user: ticketActivity!.user,
        assignedTo: ticketActivity!.assignedTo,
      };
    default:
      break;
  }
};

const createProjectActivity = async (projectId: string) => {
  try {
    const newProjectActivity = new ProjectActivity({ projectId: new Types.ObjectId(projectId) });
    return await newProjectActivity.save();
  } catch (error) {
    console.error("Error al registrar las actividades del proyecto:", error);
    return "Error inesperado al registrar las actividades del proyecto";
  }
};

const createActivityItem = async ({
  projectId,
  type,
  discussion,
  vote,
  ticketActivity,
}: {
  projectId: string;
  type: ActivityItemType;
  discussion?: Discussion;
  vote?: Vote;
  ticketActivity?: TicketsActivity;
}) => {
  try {
    const projectActivity = await ProjectActivity.findById(projectId);
    if (!projectActivity) {
      return "Actividad de proyecto no encontrada";
    }

    const newActivityItem = new ActivityItem(
      createItem({
        type,
        discussion,
        vote,
        ticketActivity,
      }),
    );

    projectActivity.activityItems.push(newActivityItem);

    return await projectActivity.save();
  } catch (error) {
    console.error("Error al crear una nueva actividad:", error);
    return "Error inesperado al crear la actividad";
  }
};

export const ProjectActivityModel = { createActivityItem, createProjectActivity };
