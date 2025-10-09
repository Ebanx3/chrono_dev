import { Request, Response } from "express";
import { validateBodyRegister } from "./zod";
import { UserModel } from "./model";
import { ServerResponse } from "../../types";

const register = async (req: Request, res: Response<ServerResponse>) => {
  try {
    const validatedBody = await validateBodyRegister(req.body);
    if (!validatedBody ) {
      res
        .status(400)
        .json({ success: false, message: "Error trying to validate body", data: validatedBody });
      return;
    }
    console.log(validatedBody)
    // const newUser = await UserModel.create(validatedBody);
    // if (!newUser) {
    //   res
    //     .status(400)
    //     .json({
    //       success: false,
    //       message: "Error trying to register the new user",
    //     });
    //   return;
    // }

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const UserController = { register };
