import { z } from "zod/v4";

const schema = z
  .object({
    username: z
      .string()
      .min(3, "El nombre de usuario debe contener al menos 3 caracteres")
      .max(20, "El nombre de usuario no puede contener más de 20 caracteres"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "La contraseña debe contener al menos 8 caracteres.\nIncluyendo mayúsculas, minúsculas y números"
      ),
    email: z
      .string()
      .regex(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "El email debe tener un formato valido"
      ),
    confirmPassword: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "La repetición de la contraseña debe coincidir con la contraseña."
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export const validateRegisterFields = async (data: object) => {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message).join("\n\n");
    }
    return "Error inesperado al validar los campos.";
  }
};
