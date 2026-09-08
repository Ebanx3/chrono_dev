import { Request, Response } from "express";
import { UserModel } from "./model";
import { RequestWithData, ServerResponse } from "../../types";
import { removeSensitiveUserData } from "../../utils/removeSensitiveUserData";
import { validateBodyUpdateUser } from "./zod";
import { v2 as cloudinary } from "cloudinary";
import { env_variables as envs } from "../../config/environment";

const getUserById = async (req: RequestWithData, res: Response<ServerResponse>) => {
  try {
    const user = await UserModel.getUserById(req.params.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "Usuario no encontrado",isLoggedIn: req.user ? true : false });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Ok", data: removeSensitiveUserData(user),isLoggedIn: req.user ? true : false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error",isLoggedIn: req.user ? true : false });
  }
};

const getAllUsers = async (req: RequestWithData, res: Response<ServerResponse>) => {
  try {
    const users = await UserModel.getUsers();
    
    if(!users) {
      res.status(404).json({ success: false, message: "No se encontraron usuarios",isLoggedIn: req.user ? true : false });
      return;
    }

    const sanitizedUsers = users.map(user => removeSensitiveUserData(user));
    res
      .status(201)
      .json({ success: true, message: "Ok", data: sanitizedUsers,isLoggedIn: req.user ? true : false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error",isLoggedIn: req.user ? true : false });
  }
};


const updateUser = async (req: RequestWithData, res: Response<ServerResponse>) => {
  try {
    const validatedBody = await validateBodyUpdateUser(req.body!);
    if (typeof validatedBody === "string") {
      res.status(400).json({ success: false, message: validatedBody,isLoggedIn:true });
      return;
    }
    const updatedUser = await UserModel.updateUser(req.user!.id, validatedBody);
    if (typeof updatedUser === "string") {
      res.status(400).json({ success: false, message: updatedUser, isLoggedIn:true });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      isLoggedIn:true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error", isLoggedIn:true });
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
        isLoggedIn:true
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server Error", isLoggedIn:true });
    }
  };


export const UserController = { getUserById, getAllUsers, updateUser, getCloudinarySignature };