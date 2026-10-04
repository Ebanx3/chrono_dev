import { Request, Response } from "express";
import { ReplyPostModel } from "./model";
import { RequestWithData, ServerResponse } from "../../types";
import { UserModel } from "../user/model";
import Post from "../post/schema";
import { HttpError } from "../../utils/httpError";
import type { CreatePostReplyBody } from "./zod";

const createPostReply = async (
  req: RequestWithData<CreatePostReplyBody>,
  res: Response<ServerResponse>,
) => {
  const { postId } = req.params;

  const post = await Post.findById(postId).select("author");
  if (!post) {
    throw new HttpError(404, "Publicación no encontrada");
  }

  await ReplyPostModel.createPostReply({
    author: req.user!.id,
    postId,
    ...req.body,
  });

  const updatedUser = await UserModel.increasePostField({
    userId: post.author.toString(),
    fieldToIncrease: "comments_received",
  });
  if (!updatedUser) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  res.status(201).json({
    success: true,
    message: "Respuesta creada correctamente",
    isLoggedIn: true,
  });
};

const getAllPostReplies = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const { postId } = req.params;
  const postReplies = await ReplyPostModel.getPostReplies(postId);

  res.status(201).json({
    success: true,
    message: "Respuestas obtenidas correctamente",
    data: postReplies,
    isLoggedIn: req.user ? true : false,
  });
};

export const ReplyPostController = {
  createPostReply,
  getAllPostReplies,
};
