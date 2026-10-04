import {z} from "zod/v4";

const createPostReplySchema = z.object({
  content: z
    .string("Es necesario proporcionar contenido válido")
    .min(10, "El contenido debe contener al menos 10 caracteres")
    .max(500, "El contenido no puede superar los 500 caracteres"),
});

export const PostReplySchemas = { createPostReplySchema };

export type CreatePostReplyBody = z.output<typeof createPostReplySchema>;