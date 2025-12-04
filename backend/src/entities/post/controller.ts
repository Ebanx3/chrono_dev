import { Request, Response } from "express";
import { PostModel } from "./model";
import { UserModel } from "../user/model";
import { RequestWithData, ServerResponse } from "../../types";
import { validateBodyCreatePost } from "./zod";

const getAllPosts = async (_req: Request, res: Response<ServerResponse>) => {
  try {
    const posts = await PostModel.getPosts();

    if (!posts) {
      res
        .status(404)
        .json({ success: false, message: "No se encontraron publicaciones" });
      return;
    }

    res.status(201).json({ success: true, message: "Ok", data: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createPost = async (
  req: RequestWithData,
  res: Response<ServerResponse>
) => {
  try {
    const validatedBody = await validateBodyCreatePost(req.body);
    if (typeof validatedBody === "string") {
      res.status(400).json({ success: false, message: validatedBody });
      return;
    }

    const newPost = await PostModel.create({
      ownerId: req.user!.id,
      ...validatedBody,
    });
    if (typeof newPost === "string") {
      res.status(400).json({
        success: false,
        message: newPost,
      });
      return;
    }

    const updatedUser = await UserModel.increasePostField({userId:req.user!.id, fieldToIncrease:'created'} );
    if (typeof updatedUser === "string") {
      res.status(400).json({ success: false, message: updatedUser });
      return;
    }

    res.status(201).json({ success: true, message: "Ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const PostController = { getAllPosts, createPost };
