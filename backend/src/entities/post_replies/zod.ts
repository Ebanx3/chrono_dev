import {z} from "zod/v4";

const createPostReplySchema = z.object({
  content: z
    .string("Es necesario proporcionar contenido válido")
    .min(20, "El contenido debe contener al menos 20 caracteres")
    .max(500, "El contenido no puede superar los 500 caracteres"),
});

export const validateBodyCreatePostReply = async (body: object) => {
  try {
    return await createPostReplySchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      return messages.join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};