import { Request, Response } from "express";
import { validateBodyRegister, validateBodyLogin } from "./zod";
import { UserModel } from "./model";
import { ServerResponse } from "../../types";
import { comparePasswords } from "../../services/encryptPass";
import { createToken } from "../../utils/jwt";
import { env_variables } from "../../config/environment";
import { removeSensitiveUserData } from "../../utils/removeSensitiveUserData";
import { sendVerificationCodeToEmail } from "../../services/nodemailer";

const register = async (req: Request, res: Response<ServerResponse>) => {
  try {
    const validatedBody = await validateBodyRegister(req.body);
    if (typeof validatedBody === "string") {
      res.status(400).json({ success: false, message: validatedBody });
      return;
    }

    const newUser = await UserModel.create(validatedBody);
    if (typeof newUser === "string") {
      res.status(400).json({
        success: false,
        message: newUser,
      });
      return;
    }

    await sendVerificationCodeToEmail({
      to: validatedBody.email,
      code: newUser.verifificationEmailCode,
    });

    res
      .status(201)
      .json({ success: true, message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const login = async (req: Request, res: Response<ServerResponse>) => {
  try {
    const validatedBody = await validateBodyLogin(req.body);
    if (typeof validatedBody === "string") {
      res.status(400).json({ success: false, message: validatedBody });
      return;
    }

    const user = await UserModel.getUserByUsername(validatedBody.username);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Credenciales invalidas",
      });
      return;
    }

    const samePassword = await comparePasswords(
      validatedBody.password,
      user.password
    );
    if (!samePassword) {
      res.status(400).json({
        success: false,
        message: "Credenciales invalidas",
      });
      return;
    }

    const token = createToken(user);

    res
      .cookie(env_variables.TOKEN_NAME, token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000,
        secure: true,
      })
      .status(201)
      .json({
        success: true,
        message: "Usuario ingresado exitosamente",
        data: removeSensitiveUserData(user),
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const logout = async (_req: Request, res: Response<ServerResponse>) => {
  res
    .clearCookie(env_variables.TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .status(200)
    .json({ success: true, message: "Logout correcto" });
};

const verifiyEmail = async (req: Request, res: Response<ServerResponse>) => {
  try {
    const { uid, code } = req.query;
    if (!uid || !code) {
      res.status(400).json({
        success: false,
        message: "uid y code son necesarios en la query",
      });
      return;
    }

    const user = await UserModel.getUserById(uid as string);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "No se encontro un usuario con ese id",
      });
      return;
    }

    if (user.isVerifiedEmail) {
      res.status(400).json({
        success: false,
        message: "El email ya fue validado",
      });
      return;
    }

    if (code != user.verificationEmailCode) {
      res.status(400).json({
        success: false,
        message: "Error al intentar validar el email",
      });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Email validado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const AuthController = { register, login, logout, verifiyEmail };
