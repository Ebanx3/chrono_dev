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
    closesAt: z.coerce
      .date()
      .refine((date) => date.getTime() > Date.now(), "La fecha de cierre debe ser futura"),
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

export const ProjectActivitySchemas = {
  addActivity: activitySchema,
  addDiscussionMessage: discussionMessageSchema,
  addVote: voteSchema,
};

export type AddActivityBody = z.output<typeof activitySchema>;
export type AddDiscussionMessageBody = z.output<typeof discussionMessageSchema>;
export type AddVoteBody = z.output<typeof voteSchema>;