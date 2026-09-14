import { z } from "zod/v4";
import { Types } from "mongoose";

const objectId = z.string().refine((value) => Types.ObjectId.isValid(value), "Debe proporcionar un identificador válido");

const activitySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("discussion"),
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().min(1).max(5000),
  }),
  z.object({
    type: z.literal("vote"),
    details: z.string().trim().min(1).max(2000),
    options: z.array(z.string().trim().min(1).max(200)).min(2).max(20),
  }),
  z.object({
    type: z.literal("ticket"),
    ticketId: objectId,
    action: z.enum(["created", "updated", "deleted", "assigned"]),
    assignedTo: objectId.optional(),
  }),
]);

const discussionMessageSchema = z.object({
  content: z.string().trim().min(1).max(5000),
});

const voteSchema = z.object({
  option: z.string().trim().min(1).max(200),
});

export const validateBodyAddActivity = async (body: object) => {
  try {
    return await activitySchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message).join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};

export const validateBodyAddDiscussionMessage = async (body: object) => {
  try {
    return await discussionMessageSchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message).join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};

export const validateBodyAddVote = async (body: object) => {
  try {
    return await voteSchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message).join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};