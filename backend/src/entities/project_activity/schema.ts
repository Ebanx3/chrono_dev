import { model, Schema, Types } from "mongoose";
import { ActivityItemType } from "../../types";

export interface Vote {
  details: string;
  options: string[];
  votes: { userId: Types.ObjectId; option: string }[];
  status: "open" | "closed";
}

export interface Discussion {
  title: string;
  content: string;
  author: { userId: Types.ObjectId };
  status: "open" | "closed";
}

export interface TicketsActivity {
  ticketId: Types.ObjectId;
  action: "created" | "updated" | "deleted" | "assigned";
  timestamp: Date;
  user: { userId: Types.ObjectId };
  assignedTo?: { userId: Types.ObjectId };
}

export interface DiscussionMessage {
  content: string;
  author: { userId: Types.ObjectId };
}

export interface IActivityItem {
  type: ActivityItemType;
  discussion?: Discussion;
  vote?: Vote;
  ticketActivity?: TicketsActivity;
  messages: DiscussionMessage[];
  author: Types.ObjectId;
  projectId: Types.ObjectId;
}

const discussionMessageSchema = new Schema<DiscussionMessage>(
  {
    content: { type: String, required: true },
    author:  { type: Schema.Types.ObjectId, ref: "User" } ,
  },
  { timestamps: true },
);

const discussionSchema = new Schema<Discussion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true },
);

const voteSchema = new Schema<Vote>(
  {
    details: { type: String, required: true },
    options: { type: [String], required: true },
    votes: {
      type: [
        {
          userId: { type: Schema.Types.ObjectId, ref: "User" },
          option: { type: String },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true },
);

const ticketsActivitySchema = new Schema<TicketsActivity>(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "assigned"],
      required: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const activityItemSchema = new Schema<IActivityItem>(
  {
    type: {
      type: String,
      enum: ["discussion", "vote", "ticket"],
      required: true,
    },
    discussion: { type: discussionSchema },
    vote: { type: voteSchema },
    ticketActivity: { type: ticketsActivitySchema },
    messages: { type: [discussionMessageSchema], default: [] },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
  },
  { timestamps: true },
);

export const ActivityItem = model<IActivityItem>(
  "ProjectActivity",
  activityItemSchema,
);
