import User, { PostStatKey } from "./schema";
import { Types } from "mongoose";
import { hashPassword } from "../../services/encryptPass";
import { randomBytes } from "node:crypto";
import { HttpError } from "../../utils/httpError";

export class UserAlreadyExistsError extends HttpError {
  constructor(public readonly field: "email" | "username") {
    super(409, field === "email" ? "Email ya en uso" : "Username ya en uso");
    this.name = "UserAlreadyExistsError";
  }
}

const getDuplicateUserField = (
  error: unknown,
): "email" | "username" | null => {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    error.code !== 11000
  ) {
    return null;
  }

  const duplicateError = error as {
    keyPattern?: Partial<Record<"email" | "username", unknown>>;
    keyValue?: Partial<Record<"email" | "username", unknown>>;
  };

  if (duplicateError.keyPattern?.email || duplicateError.keyValue?.email) {
    return "email";
  }
  if (duplicateError.keyPattern?.username || duplicateError.keyValue?.username) {
    return "username";
  }

  return null;
};

const create = async ({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) => {
  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    email,
    username,
    password: hashedPassword,
    verificationEmailCode: randomBytes(6).toString("hex"),
  });

  try {
    await newUser.save();
  } catch (error) {
    const duplicateField = getDuplicateUserField(error);
    if (duplicateField) {
      throw new UserAlreadyExistsError(duplicateField);
    }
    throw error;
  }

  return { verifificationEmailCode: newUser.verificationEmailCode as string };
};

const getUserByUsername = async (username: string) => {
  return User.findOne({ username: new RegExp(`^${username}$`, "i") });
};

const getUserById = async (userId: string) => {
  return User.findOne({ _id: userId });
};

const getUsers = async () => {
  return User.find();
};

type UpdateData = {
  title?: string;
  description?: string;
  urlAvatar?: string;
  links?: Array<{ site: string; link: string }>;
  stack?: string[];
};

const updateUser = async (userId: string, updateData: UpdateData) => {
  return User.findByIdAndUpdate(userId, updateData, { new: true });
};

const followUser = async ({
  followerId,
  followedId,
}: {
  followerId: string;
  followedId: string;
}) => {
  if (!Types.ObjectId.isValid(followedId)) {
    throw new HttpError(400, "El identificador del usuario no es válido");
  }
  if (followerId === followedId) {
    throw new HttpError(400, "No puedes seguirte a ti mismo");
  }

  const followedUser = await User.findByIdAndUpdate(
    followedId,
    { $addToSet: { followers: new Types.ObjectId(followerId) } },
    { new: true },
  ).select("_id");

  if (!followedUser) {
    throw new HttpError(404, "Usuario no encontrado");
  }

  const followerUser = await User.findByIdAndUpdate(
    followerId,
    { $addToSet: { users_following: followedUser._id } },
    { new: true },
  ).select("_id");

  if (!followerUser) {
    throw new HttpError(404, "Usuario autenticado no encontrado");
  }

  return followedUser;
};

const addNewPostToUser = async ({
  userId,
  postId,
  postTitle,
}: {
  userId: string;
  postId: string;
  postTitle: string;
}) => {
  const updateData = {
    $push: { posts: { id: postId, title: postTitle } },
    $inc: { "postsStats.created": 1 },
  };

  return User.findByIdAndUpdate(userId, updateData, {
    new: true,
    upsert: false,
  });
};

const addNewProjectToUser = async ({
  userId,
  projectId,
  projectName,
}: {
  userId: string;
  projectId: string;
  projectName: string;
}) => {
  const updateData = {
    $push: { posts: { id: projectId, name: projectName } },
    $inc: { "projectsStats.created": 1 },
  };

  return User.findByIdAndUpdate(userId, updateData, {
    new: true,
    upsert: false,
  });
};

const increasePostField = async ({
  userId,
  fieldToIncrease,
  amount = 1,
}: {
  userId: string;
  fieldToIncrease: PostStatKey;
  amount?: number;
}) => {
  return User.findByIdAndUpdate(
    userId,
    { $inc: { [`postsStats.${fieldToIncrease}`]: amount } },
    { new: true },
  );
};

export const UserModel = {
  create,
  getUserById,
  getUserByUsername,
  getUsers,
  updateUser,
  followUser,
  increasePostField,
  addNewPostToUser,
  addNewProjectToUser
};
