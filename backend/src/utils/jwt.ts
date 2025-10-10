import jwt from "jsonwebtoken";
import { env_variables } from "../config/environment";
import { IUser } from "../entities/user/schema";

const createToken = (user : IUser) => {
  try {
    const { username, id, email, } = user;
    //@ts-ignore
    return jwt.sign(
      {
        username,
        id,
        email,
      },
      env_variables.TOKEN_SECRET_KEY,
      {
        expiresIn: env_variables.TOKEN_EXPIRATION_TIME,
      }
    );
  } catch (error) {
    throw Error("Error creating the token");
  }
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, env_variables.TOKEN_SECRET_KEY!);
  } catch (error) {
    return null;
  }
};

export { createToken, verifyToken };
