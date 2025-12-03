import { Request, Response } from "express";
import { UserModel } from "./model";
import { ServerResponse } from "../../types";
import { removeSensitiveUserData } from "../../utils/removeSensitiveUserData";

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

const getAllUsers = async (req: Request, res: Response<ServerResponse>) => {
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

export const UserController = { getUserById, getAllUsers };