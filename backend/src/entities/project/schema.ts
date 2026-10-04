import { Schema, Document, model, Types } from "mongoose";

export enum Permission {
  PendingMembersView = "project.pending_members.view",
  MembersInvite = "project.members.invite",
  MembersAccept = "project.members.accept",
  MembersRemove = "project.members.remove",
  MembersEditRole = "project.members.edit_role",
  MembersBan = "project.members.ban",

  DetailsEdit = "project.details.edit",

  ResourcesAdd = "project.resources.add",
  ResourcesRemove = "project.resources.remove",
  ResourcesEdit = "project.resources.edit",

  TicketsCreate = "project.tickets.create",
  TicketsEdit = "project.tickets.edit",
  TicketsDelete = "project.tickets.delete",
  TicketsRequest = "project.tickets.request",
  TicketsAssign = "project.tickets.assign",

  ActivityAdd = "project.activity.add",
  ActivityEdit = "project.activity.edit",
  ActivityDelete = "project.activity.delete",
}

const projectSettingsSchema = new Schema(
  {
    autoAssignTicket: { type: Boolean, default: false },
    areas: { type: [String] },
    maxTicketsPerMember: { type: Number, default: 2, min: 1 },
    joinMode: {
      type: String,
      enum: ["open", "request"],
      default: "request",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { _id: false, timestamps: false },
);

export type ProjectJoinMode = "open" | "request";

export type ProjectVisibility = "public" | "private";

export interface ProjectSettings {
  autoAssignTicket: boolean;
  areas: string[];
  maxTicketsPerMember: number;
  joinMode: ProjectJoinMode;
  visibility: ProjectVisibility;
}

export interface IProject extends Document {
  name: string;
  details: string;
  founder: Types.ObjectId;
  ticketsCount: number;
  techs: string[];
  resources: { name: string; url: string }[];
  members: {
    user: Types.ObjectId;
    role?: string;
    permissions?: Permission[];
    areas?: string[];
  }[];
  membersBanned: Types.ObjectId[];
  pendingMembers: Types.ObjectId[];
  isPublic: boolean;
  followers: Array<Types.ObjectId>;
  settings: ProjectSettings;
}

const membersSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    role: {
      type: String,
      required: false,
    },
    areas: {
      type: [String],
      required: false,
      default: [],
    },
    permissions: {
      type: [String],
      enum: Object.values(Permission),
      required: false,
      default: [],
    },
  },
  { _id: false },
);

const resourcesSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    details: { type: String },
    founder: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ticketsCount: { type: Number, default: 0, min: 0 },
    techs: [String],
    resources: [resourcesSchema],
    members: [membersSchema],
    membersBanned: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    pendingMembers: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    isPublic: { type: Boolean },
    settings:{type: projectSettingsSchema},
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true },
);

export const Project = model<IProject>("Project", projectSchema);
