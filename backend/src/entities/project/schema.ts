import { Schema, Document, model, Types } from "mongoose";

interface ITask {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
  assignedTo?: { userId: Types.ObjectId; username: string };
  dueDate?: Date;
}

export interface IModule extends Document {
  name: string;
  details: string;
  isPublic: boolean;
  allowedRoles: string[]; // ej: ["admin", "editor"]
  allowedUsers: { userId: Types.ObjectId; username: string }[];
  tasks: ITask[];
  connections: { targetModuleId: Types.ObjectId; type: string }[]; // ej: "dependency", "related"
  projectId: Types.ObjectId;
}

export interface IProject extends Document {
  name: string;
  details: string;
  founderId: Types.ObjectId;
  founderUsername: string;
  techs: string[];
  members: { userId: Types.ObjectId; username: string; role: string }[];
  pendingMembers: { userId: Types.ObjectId; username: string }[];
  modules: Types.ObjectId[]; // relación con módulos
  roles: Array<string>;
  isPublic:boolean;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "pending",
    },
    assignedTo: {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      username: { type: String },
    },
    dueDate: { type: Date },
  },
  { _id: false }
);

const allowedUSersSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    username: { type: String },
  },
  { _id: false }
);

const connectionssSchema = new Schema(
  {
    targetModuleId: { type: Schema.Types.ObjectId, ref: "Module" },
    type: { type: String, default: "related" },
  },
  { _id: false }
);

const moduleSchema = new Schema<IModule>(
  {
    name: { type: String, required: true },
    details: { type: String },
    isPublic: { type: Boolean, default: true },
    allowedRoles: [String],
    allowedUsers: [allowedUSersSchema],
    tasks: [taskSchema],
    connections: [connectionssSchema],
    projectId: {type: Schema.Types.ObjectId, ref:"Project", required:true }
  },
  { timestamps: true }
);

const membersSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    username: { type: String },
    role: { type: String },
  },
  { _id: false }
);

const pendingMembersSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    username: { type: String },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    details: { type: String },
    founderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    founderUsername: { type: String },
    techs: [String],
    members: [membersSchema],
    pendingMembers: [pendingMembersSchema],
    modules: [{ type: Schema.Types.ObjectId, ref: "Module" }],
    roles: { type: [String], default: [] },
    isPublic: {type:Boolean}
  },
  { timestamps: true }
);

export const Module = model<IModule>("Module", moduleSchema);
export const Project = model<IProject>("Project", projectSchema);
