import z from "zod";

const schema = z.object({
  title: z.string().max(100, "El título no puede contener más de 100 caracteres").optional(),
  description: z.string().max(500, "La descripción no puede contener más de 500 caracteres").optional(),
  links: z.array(
    z.object({
      site: z.string().max(100, "El nombre del sitio no puede contener más de 100 caracteres"),
      link: z.string().url("El enlace debe ser una URL válida"),
    })
  ).optional(),
  stack: z.array(z.string().max(20, "Cada tecnología no puede contener más de 20 caracteres")).optional(),
});

export const validateUpdateUserFields= async (data: object) => {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.map((issue) => issue.message).join("\n\n");
    }
    return "Error inesperado al validar los campos.";
  }
};