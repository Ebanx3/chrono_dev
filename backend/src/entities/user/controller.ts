import { Request, Response } from "express";
import { UserModel } from "./model";
import { RequestWithData, ServerResponse } from "../../types";
import { removeSensitiveUserData } from "../../utils/removeSensitiveUserData";
import type { UpdateUserBody } from "./zod";
import { v2 as cloudinary } from "cloudinary";
import { env_variables as envs } from "../../config/environment";
import { HttpError } from "../../utils/httpError";

const getUserById = async (req: RequestWithData, res: Response<ServerResponse>) => {
  const user = await UserModel.getUserById(req.params.userId);
  if (!user) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  res
    .status(200)
    .json({ success: true, message: "Ok", data: removeSensitiveUserData(user), isLoggedIn: req.user ? true : false });
};

const getAllUsers = async (req: RequestWithData, res: Response<ServerResponse>) => {
  const users = await UserModel.getUsers();

  const sanitizedUsers = users.map(user => removeSensitiveUserData(user));
  res
    .status(201)
    .json({ success: true, message: "Ok", data: sanitizedUsers, isLoggedIn: req.user ? true : false });
};


const updateUser = async (
  req: RequestWithData<UpdateUserBody>,
  res: Response<ServerResponse>,
) => {
  const updatedUser = await UserModel.updateUser(req.user!.id, req.body);
  if (!updatedUser) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  res.status(200).json({
    success: true,
    message: "Usuario actualizado correctamente",
    isLoggedIn: true,
  });
};

const followUser = async (
  req: RequestWithData,
  res: Response<ServerResponse>,
) => {
  await UserModel.followUser({
    followerId: req.user!.id,
    followedId: req.params.userId,
  });

  res.status(200).json({
    success: true,
    message: "Ahora sigues a este usuario",
    isLoggedIn: true,
  });
};

const getCloudinarySignature = async (
    req: RequestWithData,
    res: Response<ServerResponse>
  ) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'chrono-dev-avatars'
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      envs.CLOUDINARY_SECRET!,
    );

    res.status(200).json({
      success: true,
      message: "Signature successfully obtained",
      data: { timestamp, signature, folder },
      isLoggedIn:true
    });
  };


export const UserController = {
  getUserById,
  getAllUsers,
  updateUser,
  followUser,
  getCloudinarySignature,
};