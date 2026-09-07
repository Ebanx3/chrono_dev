import { Request, Response } from "express";
import { PostModel, RecognitionType } from "./model";
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

const getPostById = async (req: Request, res: Response<ServerResponse>) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.getPostById(postId);
    console.log("post", post);
    if (!post) {
      res
        .status(404)
        .json({ success: false, message: "No se encontró la publicación" });
      return;
    }

    res.status(201).json({ success: true, message: "Ok", data: post });
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
      author: req.user!.id,
      ...validatedBody,
    });
    if (typeof newPost === "string") {
      res.status(400).json({
        success: false,
        message: newPost,
      });
      return;
    }

    const updatedUser = await UserModel.increasePostField({
      userId: req.user!.id,
      fieldToIncrease: "created",
    });
    if (typeof updatedUser === "string") {
      res.status(400).json({ success: false, message: updatedUser });
      return;
    }

    res.status(201).json({ success: true, message: "Ok", data: newPost!.toObject()._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addOrRemoveLike = async (
  req: RequestWithData,
  res: Response<ServerResponse>
) => {
  try {
    const { recognitionType, postId } = req.params;

    if (
      ![
        "documentation",
        "inspiration",
        "innovation",
        "resolution",
        "mentorship",
        "likes",
      ].includes(recognitionType)
    ) {
      res.status(400).json({
        success: false,
        message: `${recognitionType} no es un tipo de reconocimiento válido`,
      });
    }

    const postUpdated = await PostModel.addOrRemoveRecognition({
      recognitionType: recognitionType as RecognitionType,
      userId: req.user!.id,
      postId,
    });

    if (typeof postUpdated === "string") {
      res.status(400).json({
        success: false,
        message: postUpdated,
      });
      return;
    }

    //esto hay que corregirlo
    const updatedUser = await UserModel.increasePostField({
      userId: postUpdated.author.toString(),
      fieldToIncrease: "likes_received",
    });
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

export const PostController = {
  getAllPosts,
  createPost,
  getPostById,
  addOrRemoveLike,
};
