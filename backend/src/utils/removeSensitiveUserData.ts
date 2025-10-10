import { IUser } from "../entities/user/schema";

export const removeSensitiveUserData = (user: IUser) => {
  const { password, isVerifiedEmail, verificationEmailCode, ...safeUser } = user.toObject();
  return safeUser;
};