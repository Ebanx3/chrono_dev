import { Request, Response } from "express";
import { ReplyPostModel } from "./model";
import { RequestWithData, ServerResponse } from "../../types";
import { validateBodyCreatePostReply } from "./zod";
import { UserModel } from "../user/model";
import Post from "../post/schema";

const createPostReply = async (
  req: RequestWithData,
  res: Response<ServerResponse>
) => {
  try {
    const { postId } = req.params;
    const validatedBody = await validateBodyCreatePostReply(req.body);
    console.log(validatedBody);
    console.log(req.body);
    if (typeof validatedBody === "string") {
      res.status(400).json({ success: false, message: validatedBody });
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
      });
      return;
    }

    const post = await Post.findById(postId).select("author");

    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }
    await UserModel.increasePostField({
      userId: post.author.toString(),
      fieldToIncrease: "comments_received",
    });

    res.status(201).json({ success: true, message: "Ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllPostReplies = async (
  req: Request,
  res: Response<ServerResponse>
) => {
  try {
    const { postId } = req.params;
    const postReplies = await ReplyPostModel.getPostReplies(postId);

    if (!postReplies) {
      res
        .status(404)
        .json({
          success: false,
          message: "No se encontraron publicaciones para responder",
        });
      return;
    }
    res.status(201).json({ success: true, message: "Ok", data: postReplies });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const ReplyPostController = {
  createPostReply,
  getAllPostReplies,
};
