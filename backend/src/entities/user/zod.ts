import { z } from "zod/v4";

const registerSchema = z.object({
  username: z
    .string('Es necesario proporcionar un nombre de usuario valido')
    .min(3, "El nombre de usuario debe contener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede contener más de 20 caracteres"),
  password: z
    .string('Es necesario proporcioanr una contraseña valida')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "La contraseña debe contener al menos 8 caracteres.\nIncluyendo mayúsculas, minúsculas y números"
    ),
  email: z
    .string('Es necesario proporcionar un email valido')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El email debe tener un formato valido"),
});

const loginSchema = z.object({
  username: z
    .string('Es necesario proporcionar un nombre de usuario valido')
    .min(3, "El nombre de usuario debe contener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede contener más de 20 caracteres"),
  password: z
    .string('Es necesario proporcioanr una contraseña valida')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "La contraseña debe contener al menos 8 caracteres.\nIncluyendo mayúsculas, minúsculas y números"
    )
});

export const validateBodyRegister = async (body: object) => {
  try {
    return await registerSchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      return messages.join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};

export const validateBodyLogin = async (body: object) => {
  try {
    return await loginSchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      return messages.join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};