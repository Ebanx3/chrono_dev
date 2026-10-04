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

  areas: z
    .array(
      z
        .string("Cada área debe ser un texto válido")
        .trim()
        .min(1, "Cada área no puede estar vacía")
        .max(60, "Cada área no puede superar los 60 caracteres"),
    )
    .min(1, "Debes especificar al menos un área para el proyecto")
    .max(20, "No puedes agregar más de 20 áreas"),

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
  permissions: z.array(z.enum(Permission)).default([]),
  areas: z
    .array(
      z
        .string("Cada área debe ser un texto válido")
        .trim()
        .min(1, "Cada área no puede estar vacía")
        .max(50, "Cada área no puede superar los 50 caracteres"),
    )
    .max(20, "No puedes agregar más de 20 áreas")
    .default([]),
});

  const updateProjectSettingsSchema = z
    .object({
      autoAssignTicket: z.boolean().optional(),
      areas: z
        .array(
          z
            .string("Cada área debe ser un texto válido")
            .trim()
            .min(1, "Cada área no puede estar vacía")
            .max(60, "Cada área no puede superar los 60 caracteres"),
        )
        .max(20, "No puedes agregar más de 20 áreas")
        .optional(),
      maxTicketsPerMember: z
        .number("El máximo de tickets debe ser un número")
        .int("El máximo de tickets debe ser un número entero")
        .min(1, "El máximo de tickets debe ser al menos 1")
        .optional(),
      joinMode: z.enum(["open", "request"], {
        message: "El modo de ingreso no es válido",
      }).optional(),
      visibility: z.enum(["public", "private"], {
        message: "La visibilidad del proyecto no es válida",
      }).optional(),
    })
    .strict()
    .refine((settings) => Object.keys(settings).length > 0, {
      message: "Debes proporcionar al menos un ajuste para actualizar",
    });


export const ProjectSchemas = {
  createProjectSchema,
  addResourceSchema,
  editMemberSchema,
  updateProjectSettingsSchema,
};

export type CreateProjectBody = z.output<typeof createProjectSchema>;
export type AddResourceBody = z.output<typeof addResourceSchema>;
export type EditMemberBody = z.output<typeof editMemberSchema>;
export type UpdateProjectSettingsBody = z.output<
  typeof updateProjectSettingsSchema
>;





