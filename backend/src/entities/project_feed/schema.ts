import { model, Schema, Types } from "mongoose";

interface Vote {
  details: string;
  options: string[];
  votes: { userId: Types.ObjectId; option: string }[];
  status: "open" | "closed";
}

interface Discussion {
  title: string;
  content: string;
  author: { userId: Types.ObjectId };
  status: "open" | "closed";
}

interface TicketsActivity {
  ticketId: Types.ObjectId;
  action: "created" | "updated" | "deleted" | "assigned";
  timestamp: Date;
  user: { userId: Types.ObjectId };
  assignedTo?: { userId: Types.ObjectId };
}

interface DiscussionMessage {
  content: string;
  author: { userId: Types.ObjectId };
}

interface FeedItem {
  type: "discussion" | "vote" | "ticket";
  discussion?: Discussion;
  vote?: Vote;
  ticketActivity?: TicketsActivity;
  messages: DiscussionMessage[];
}

interface IProjectFeed extends Document {
  projectId: Types.ObjectId;
  feedItems: FeedItem[];
}

const discussionMessageSchema = new Schema<DiscussionMessage>(
  {
    content: { type: String, required: true },
    author: { userId: { type: Schema.Types.ObjectId, ref: "User" } },
  },
  { timestamps: true },
);

const discussionSchema = new Schema<Discussion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { userId: { type: Schema.Types.ObjectId, ref: "User" } },
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
    timestamp: { type: Date, default: Date.now },
    user: { userId: { type: Schema.Types.ObjectId, ref: "User" } },
    assignedTo: {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      required: false,
    },
  },
  { timestamps: true },
);

const feedItemSchema = new Schema<FeedItem>(
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
  },
  { timestamps: true },
);

const projectFeedSchema = new Schema<IProjectFeed>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    feedItems: { type: [feedItemSchema], default: [] },
  },
  { timestamps: true },
);

export const ProjectFeed = model<IProjectFeed>(
  "ProjectFeed",
  projectFeedSchema,
);
