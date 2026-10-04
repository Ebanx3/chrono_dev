import { Request, Response } from "express";
import { UserModel } from "./model";
import { RequestWithData, ServerResponse } from "../../types";
import { comparePasswords } from "../../services/encryptPass";
import { createToken } from "../../utils/jwt";
import { env_variables } from "../../config/environment";
import { removeSensitiveUserData } from "../../utils/removeSensitiveUserData";
import { sendVerificationCodeToEmail } from "../../services/nodemailer";
import type { LoginBody, RegisterBody } from "./zod";
import { HttpError } from "../../utils/httpError";

const register = async (
  req: RequestWithData<RegisterBody>,
  res: Response<ServerResponse>,
) => {
  const newUser = await UserModel.create(req.body);

  await sendVerificationCodeToEmail({
    to: req.body.email,
    code: newUser.verifificationEmailCode,
  });

  res.status(201).json({
    success: true,
    message: "Usuario registrado exitosamente",
    isLoggedIn: false,
  });
};

const login = async (
  req: RequestWithData<LoginBody>,
  res: Response<ServerResponse>,
) => {
  const user = await UserModel.getUserByUsername(req.body.username);
  if (!user) {
    throw new HttpError(401, "Credenciales invalidas");
  }

  const samePassword = await comparePasswords(req.body.password, user.password);
  if (!samePassword) {
    throw new HttpError(401, "Credenciales invalidas");
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
      isLoggedIn: true,
    });
};

const logout = async (_req: Request, res: Response<ServerResponse>) => {
  res
    .clearCookie(env_variables.TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .status(200)
    .json({ success: true, message: "Logout correcto", isLoggedIn: false });
};

const verifyEmail = async (req: Request, res: Response<ServerResponse>) => {
  const { uid, code } = req.query;
  if (!uid || !code) {
    throw new HttpError(400, "uid y code son necesarios en la query");
  }

  const user = await UserModel.getUserById(uid as string);
  if (!user) {
    throw new HttpError(404, "No se encontro un usuario con ese id");
  }

  if (user.isVerifiedEmail) {
    throw new HttpError(400, "El email ya fue validado");
  }

  if (code != user.verificationEmailCode) {
    throw new HttpError(400, "Error al intentar validar el email");
  }

  res.status(200).json({
    success: true,
    message: "Email validado correctamente",
    isLoggedIn: false,
  });
};

export const AuthController = { register, login, logout, verifyEmail };
