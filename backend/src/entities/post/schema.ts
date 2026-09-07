import { Schema, Document, model, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  tags: string[];
  likes_received: string[];
  comments_received: number;
  mentorship_received: string[]; // “Mentoría técnica”
  documentation_received: string[]; // “Documentación clara”
  innovation_received: string[]; // “Idea innovadora”
  resolution_received: string[]; // “Resolución efectiva”
  inspiration_received: string[]; // “Inspiración creativa”
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: { type: [String], default: [] },
    likes_received: { type: [String], default: [] },
    comments_received: { type: Number, default: 0 },
    mentorship_received: { type: [String], default: [] },
    documentation_received: { type: [String], default: [] },
    innovation_received: { type: [String], default: [] },
    resolution_received: { type: [String], default: [] },
    inspiration_received: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default model<IPost>("Post", PostSchema);
