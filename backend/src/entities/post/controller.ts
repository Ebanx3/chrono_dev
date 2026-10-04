import { Response } from "express";
import { PostModel, RecognitionType } from "./model";
import { UserModel } from "../user/model";
import { RequestWithData, ServerResponse } from "../../types";
import { HttpError } from "../../utils/httpError";
import type { CreatePostBody } from "./zod";
import { toPostDto } from "./post.mapper";

const getAllPosts = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const posts = await PostModel.getPosts();

  res.status(201).json({
    success: true,
    message: "Publicaciones obtenidas correctamente",
    data: posts.map((post) => toPostDto(post, req.user?.id)),
    isLoggedIn: req.user ? true : false,
  });
};

const getPostById = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const { postId } = req.params;
  const post = await PostModel.getPostById(postId);

  if (!post) {
    throw new HttpError(404, "No se encontró la publicación");
  }

  res.status(201).json({
    success: true,
    message: "Publicación obtenida correctamente",
    data: toPostDto(post, req.user?.id),
    isLoggedIn: req.user ? true : false,
  });
};

const getPostsByUserId = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const { userId } = req.params;
  const posts = await PostModel.getPostsByUserId(userId);

  res.status(201).json({
    success: true,
    message: "Publicaciones obtenidas correctamente",
    data: posts.map((post) => toPostDto(post, req.user?.id)),
    isLoggedIn: req.user ? true : false,
  });
};

const createPost = async (
  req: RequestWithData<CreatePostBody>,
  res: Response<ServerResponse>,
) => {
  const newPost = await PostModel.create({
    author: req.user!.id,
    ...req.body,
  });

  const updatedUser = await UserModel.increasePostField({
    userId: req.user!.id,
    fieldToIncrease: "created",
  });
  if (!updatedUser) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  res.status(201).json({
    success: true,
    message: "Publicación creada correctamente",
    data: newPost.toObject()._id,
    isLoggedIn: true,
  });
};

const addOrRemoveRecognition = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  const { recognitionType, postId } = req.params;
  const validRecognitionTypes: RecognitionType[] = [
    "documentation",
    "inspiration",
    "innovation",
    "resolution",
    "mentorship",
    "likes",
  ];

  if (!validRecognitionTypes.includes(recognitionType as RecognitionType)) {
    throw new HttpError(
      400,
      `${recognitionType} no es un tipo de reconocimiento válido`,
    );
  }

  const postUpdated = await PostModel.addOrRemoveRecognition({
    recognitionType: recognitionType as RecognitionType,
    userId: req.user!.id,
    postId,
  });
  if (!postUpdated) {
    throw new HttpError(404, "No se encontró la publicación");
  }

  const updatedUser = await UserModel.increasePostField({
    userId: postUpdated.author.toString(),
    fieldToIncrease: "likes_received",
  });
  if (!updatedUser) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  res.status(201).json({
    success: true,
    message: "Reconocimiento actualizado correctamente",
    isLoggedIn: true,
  });
};

export const PostController = {
  getAllPosts,
  createPost,
  getPostById,
  getPostsByUserId,
  addOrRemoveRecognition,
};
