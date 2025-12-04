import {z} from "zod/v4";

const createPostSchema = z.object({
  title: z
    .string("Es necesario proporcionar un título válido")
    .min(5, "El título debe contener al menos 5 caracteres")
    .max(100, "El título no puede contener más de 100 caracteres"),

  content: z
    .string("Es necesario proporcionar contenido válido")
    .min(20, "El contenido debe contener al menos 20 caracteres")
    .max(5000, "El contenido no puede superar los 5000 caracteres"),
    
    tags: z
    .array(
      z
        .string()
        .min(2, "Cada etiqueta debe tener al menos 2 caracteres")
        .max(30, "Cada etiqueta no puede superar los 30 caracteres")
    )
    .max(10, "No puedes agregar más de 10 etiquetas")
    .optional().default([])
});

export const validateBodyCreatePost = async (body: object) => {
  try {
    return await createPostSchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      return messages.join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};