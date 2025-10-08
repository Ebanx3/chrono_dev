import { hash, compare } from "bcrypt";
import { env_variables } from "../config/environment";

export const hashPassword = async (pass: string): Promise<string | null> => {
  try {
    return await hash(pass, env_variables.SALT_ROUNDS);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const comparePasswords = async (
  pass: string,
  hashedPass: string
): Promise<boolean> => {
  try {
    return await compare(pass, hashedPass);
  } catch (error) {
    console.log(error);
    return false;
  }
};
