import { Request, Response } from "express";
import { ReplyPostModel } from "./model";
import { RequestWithData, ServerResponse } from "../../types";
import { validateBodyCreatePostReply } from "./zod";
import { UserModel } from "../user/model";
import Post from "../post/schema";

const createPostReply = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const { postId } = req.params;
    const validatedBody = await validateBodyCreatePostReply(req.body);
    console.log(validatedBody);
    console.log(req.body);
    if (typeof validatedBody === "string") {
      res
        .status(400)
        .json({ success: false, message: validatedBody, isLoggedIn: true });
      return;
    }

    const newPostreply = await ReplyPostModel.createPostReply({
      author: req.user!.id,
      postId: postId,
      ...validatedBody,
    });

    if (typeof newPostreply === "string") {
      res.status(400).json({
        success: false,
        message: newPostreply,
        isLoggedIn: true,
      });
      return;
    }

    const post = await Post.findById(postId).select("author");

    if (!post) {
      res
        .status(404)
        .json({ success: false, message: "Publicación no encontrada", isLoggedIn: true });
      return;
    }
    await UserModel.increasePostField({
      userId: post.author.toString(),
      fieldToIncrease: "comments_received",
    });

    res.status(201).json({ success: true, message: "Respuesta creada correctamente", isLoggedIn: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error del servidor", isLoggedIn: true });
  }
};

const getAllPostReplies = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const { postId } = req.params;
    const postReplies = await ReplyPostModel.getPostReplies(postId);

    if (!postReplies) {
      res.status(404).json({
        success: false,
        message: "No se encontraron respuestas para esta publicación",
        isLoggedIn: req.user ? true : false,
      });
      return;
    }
    res
      .status(201)
      .json({
        success: true,
        message: "Respuestas obtenidas correctamente",
        data: postReplies,
        isLoggedIn: req.user ? true : false,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error del servidor",
        isLoggedIn: req.user ? true : false,
      });
  }
};

export const ReplyPostController = {
  createPostReply,
  getAllPostReplies,
};
