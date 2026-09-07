import { Document, Types, Schema, model } from "mongoose";

export interface IPostReplies extends Document {
    author: Types.ObjectId;
    postId: Types.ObjectId;
    content: string
    likes_received: string[];
}

const postRepliesSchema = new Schema<IPostReplies>(
    {
        author: {type: Schema.Types.ObjectId, ref: "User", required: true},
        postId: {type: Schema.Types.ObjectId, ref: "Post", required: true},
        content: {type: String, required: true},
        likes_received: {type: [String], default: []}
    },
    {
        timestamps: true
    }
)

export default model<IPostReplies>("PostReplies", postRepliesSchema)

