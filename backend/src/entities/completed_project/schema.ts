import { Document, model, Schema, Types } from "mongoose";

export interface ICompletedProject extends Document {
  name: string;
  details: string;
  techs: string[];
  members: Array<{
    userId: Types.ObjectId;
    role: string;
  }>;
  followers: Types.ObjectId[];
  completedAt: Date;
  imageUrls: string[];
  deploymentLinks?: string;
  repositoryLinks?: string;
}

const completedProjectMemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const completedProjectSchema = new Schema<ICompletedProject>(
  {
    name: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    techs: { type: [String], default: [] },
    members: { type: [completedProjectMemberSchema], default: [] },
    followers: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    completedAt: { type: Date, required: true, default: Date.now },
    imageUrls: { type: [String], default: [] },
    deploymentLinks: { type: String, required:false },
    repositoryLinks: { type: String, required:false },
  },
  { timestamps: true },
);

export const CompletedProject = model<ICompletedProject>(
  "CompletedProject",
  completedProjectSchema,
);
