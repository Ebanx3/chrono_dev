import User, { IUser } from "./schema";
import { hashPassword } from "../../services/encryptPass";
import { randomBytes } from "node:crypto";

const create = async ({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) => {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      verificationEmailCode: randomBytes(6).toString("hex"),
    });
    await newUser.save();
    return { verifificationEmailCode: newUser.verificationEmailCode as string };
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern) {
      if (error.keyPattern.email) return "Email ya en uso";
      if (error.keyPattern.username) return "Username ya en uso";
    }

    console.error("Error al crear usuario:", error);
    return "Error inesperado al crear el usuario";
  }
};

const getUserByUsername = async (username: string) => {
  try {
    return await User.findOne({ username: new RegExp(`^${username}$`, "i") });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserById = async (userId: string) => {
  try {
    return await User.findOne({ _id: userId });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    console.log(error);
    return null;
  }

};

export const UserModel = { create, getUserById, getUserByUsername, getUsers };
