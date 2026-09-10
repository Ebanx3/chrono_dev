import { z } from "zod/v4";
import { Permission } from "./schema";

const createProjectSchema = z.object({
  name: z
    .string("Es necesario proporcionar un nombre válido para el proyecto")
    .min(3, "El nombre del proyecto debe contener al menos 3 caracteres")
    .max(100, "El nombre del proyecto no puede contener más de 100 caracteres"),

  details: z
    .string("Es necesario proporcionar detalles válidos del proyecto")
    .min(10, "Los detalles deben contener al menos 10 caracteres")
    .max(2000, "Los detalles no pueden superar los 2000 caracteres"),

  techs: z
    .array(
      z
        .string()
        .min(2, "Cada tecnología debe tener al menos 2 caracteres")
        .max(30, "Cada tecnología no puede superar los 30 caracteres")
    )
    .min(1, "Debes especificar al menos una tecnología")
    .max(20, "No puedes agregar más de 20 tecnologías"),

  isPublic: z.boolean().default(true), // por defecto los proyectos son públicos
});

const addResourceSchema = z.object({
  name: z
    .string("Es necesario proporcionar un nombre válido para el recurso")
    .min(2, "El nombre del recurso debe tener al menos 2 caracteres")
    .max(100, "El nombre del recurso no puede superar los 100 caracteres"),

  url: z
    .string("Es necesario proporcionar una URL válida")
    .url("La URL no tiene un formato válido")
    .max(500, "La URL no puede superar los 500 caracteres"),
});

const editMemberSchema = z.object({
  role: z
    .string("Es necesario proporcionar un rol válido")
    .trim()
    .min(1, "El rol no puede estar vacío")
    .max(50, "El rol no puede superar los 50 caracteres"),
  permissions: z.array(z.enum(Permission)),
});

export const validateBodyCreateProject = async (body: object) => {
  try {
    return await createProjectSchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      return messages.join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};

export const validateBodyAddResource = async (body: object) => {
  try {
    return await addResourceSchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      return messages.join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};

export const validateBodyEditMember = async (body: object) => {
  try {
    return await editMemberSchema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      return messages.join("\n");
    }
    return "Error inesperado al validar los campos.";
  }
};
