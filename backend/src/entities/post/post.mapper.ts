import { Types } from "mongoose";
import type { IPost } from "./schema";

type ReactionState = {
  count: number;
  byMe: boolean;
};

type PopulatedPost = {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: { _id: Types.ObjectId; username: string };
  tags: string[];
  likes_received: string[];
  comments_received: number;
  mentorship_received: string[];
  documentation_received: string[];
  innovation_received: string[];
  resolution_received: string[];
  inspiration_received: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type PostDto = {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; username: string };
  authorId: string;
  isMine: boolean;
  tags: string[];
  likes: ReactionState;
  comments_received: number;
  recognitions: {
    mentorship: ReactionState;
    documentation: ReactionState;
    innovation: ReactionState;
    resolution: ReactionState;
    inspiration: ReactionState;
  };
  createdAt: string;
  updatedAt: string;
};

const toReactionState = (
  userIds: string[],
  viewerId?: string,
): ReactionState => ({
  count: userIds.length,
  byMe: viewerId
    ? userIds.some((userId) => userId.toString() === viewerId)
    : false,
});

export const toPostDto = (post: IPost, viewerId?: string): PostDto => {
  const data = post.toObject() as unknown as PopulatedPost;
  const authorId = data.author._id.toString();

  return {
    _id: data._id.toString(),
    title: data.title,
    content: data.content,
    author: {
      _id: authorId,
      username: data.author.username,
    },
    authorId,
    isMine: viewerId === authorId,
    tags: data.tags,
    likes: toReactionState(data.likes_received, viewerId),
    comments_received: data.comments_received,
    recognitions: {
      mentorship: toReactionState(data.mentorship_received, viewerId),
      documentation: toReactionState(data.documentation_received, viewerId),
      innovation: toReactionState(data.innovation_received, viewerId),
      resolution: toReactionState(data.resolution_received, viewerId),
      inspiration: toReactionState(data.inspiration_received, viewerId),
    },
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};