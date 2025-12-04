import { Request, Response } from "express";
import { UserModel } from "./model";
import { RequestWithData, ServerResponse } from "../../types";
import { removeSensitiveUserData } from "../../utils/removeSensitiveUserData";
import { validateBodyUpdateUser } from "./zod";
import { v2 as cloudinary } from "cloudinary";
import { env_variables as envs } from "../../config/environment";

const getUserById = async (req: Request, res: Response<ServerResponse>) => {
  try {
    const user = await UserModel.getUserById(req.params.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "Usuario no encontrado" });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Ok", data: removeSensitiveUserData(user) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllUsers = async (_req: Request, res: Response<ServerResponse>) => {
  try {
    const users = await UserModel.getUsers();
    
    if(!users) {
      res.status(404).json({ success: false, message: "No se encontraron usuarios" });
      return;
    }

    const sanitizedUsers = users.map(user => removeSensitiveUserData(user));
    res
      .status(201)
      .json({ success: true, message: "Ok", data: sanitizedUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const updateUser = async (req: RequestWithData, res: Response<ServerResponse>) => {
  try {
    const validatedBody = await validateBodyUpdateUser(req.body!);
    if (typeof validatedBody === "string") {
      res.status(400).json({ success: false, message: validatedBody });
      return;
    }
    const updatedUser = await UserModel.updateUser(req.user!.id, validatedBody);
    if (typeof updatedUser === "string") {
      res.status(400).json({ success: false, message: updatedUser });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getCloudinarySignature = async (
    req: RequestWithData,
    res: Response<ServerResponse>
  ) => {
    try {
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
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };


export const UserController = { getUserById, getAllUsers, updateUser, getCloudinarySignature };