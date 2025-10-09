import { z } from "zod/v4";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "username must have at least 3 characters")
    .max(20, "username can not have more than 20 characters"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "password must have at least 8 characters, including uppercase, lowercase and number"
    ),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "email must have a valid format"),
});

export const validateBodyRegister = async (body: object) => {
  try {
    return await registerSchema.parseAsync(body);
  } catch (error) {
    return {error}
  }
};
