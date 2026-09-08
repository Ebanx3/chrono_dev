import { Request, Response } from "express";
import { PostModel, RecognitionType } from "./model";
import { UserModel } from "../user/model";
import { RequestWithData, ServerResponse } from "../../types";
import { validateBodyCreatePost } from "./zod";

const getAllPosts = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const posts = await PostModel.getPosts();

    if (!posts) {
      res.status(404).json({
        success: false,
        message: "No se encontraron publicaciones",
        isLoggedIn: req.user ? true : false,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Publicaciones obtenidas correctamente",
      data: posts,
      isLoggedIn: req.user ? true : false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      isLoggedIn: req.user ? true : false,
    });
  }
};

const getPostById = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.getPostById(postId);

    if (!post) {
      res.status(404).json({
        success: false,
        message: "No se encontró la publicación",
        isLoggedIn: req.user ? true : false,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Publicación obtenida correctamente",
      data: {
        ...post.toObject(),
        isMine: req.user?.username === post.author._id,
      },
      isLoggedIn: req.user ? true : false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      isLoggedIn: req.user ? true : false,
    });
  }
};

const createPost = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  try {
    const validatedBody = await validateBodyCreatePost(req.body);
    if (typeof validatedBody === "string") {
      res.status(400).json({
        success: false,
        message: validatedBody,
        isLoggedIn: true,
      });
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
        isLoggedIn: true,
      });
      return;
    }

    const updatedUser = await UserModel.increasePostField({
      userId: req.user!.id,
      fieldToIncrease: "created",
    });
    if (typeof updatedUser === "string") {
      res.status(400).json({
        success: false,
        message: updatedUser,
        isLoggedIn: true,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Publicación creada correctamente",
      data: newPost!.toObject()._id,
      isLoggedIn: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      isLoggedIn: true,
    });
  }
};

const addOrRemoveLike = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
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
        isLoggedIn: true,
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
        isLoggedIn: true,
      });
      return;
    }

    //esto hay que corregirlo
    const updatedUser = await UserModel.increasePostField({
      userId: postUpdated.author.toString(),
      fieldToIncrease: "likes_received",
    });
    if (typeof updatedUser === "string") {
      res.status(400).json({
        success: false,
        message: updatedUser,
        isLoggedIn: true,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Reconocimiento actualizado correctamente",
      isLoggedIn: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
      isLoggedIn: true,
    });
  }
};

export const PostController = {
  getAllPosts,
  createPost,
  getPostById,
  addOrRemoveLike,
};
