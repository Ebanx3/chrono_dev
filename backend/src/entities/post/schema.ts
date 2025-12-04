import { Schema, Document, model, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  authorId: Types.ObjectId;
  tags: string[];
  likes_received: number;
  mentorship_received: number; // “Mentoría técnica”
  documentation_received: number; // “Documentación clara”
  innovation_received: number; // “Idea innovadora”
  resolution_received: number; // “Resolución efectiva”
  inspiration_received: number; // “Inspiración creativa”
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: { type: [String], default: [] },
    likes_received: { type: Number, default: 0 },
    mentorship_received: { type: Number, default: 0 },
    documentation_received: { type: Number, default: 0 },
    innovation_received: { type: Number, default: 0 },
    resolution_received: { type: Number, default: 0 },
    inspiration_received: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IPost>("Post", PostSchema);
