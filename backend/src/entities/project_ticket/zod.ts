import { z } from "zod/v4";

const createTicketSchema = z.object({
  title: z
    .string("Es necesario proporcionar un título válido")
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(120, "El título no puede superar los 120 caracteres"),
  area: z
    .string("Es necesario proporcionar un área válida")
    .trim()
    .min(2, "El área debe tener al menos 2 caracteres")
    .max(60, "El área no puede superar los 60 caracteres"),
  description: z
    .string("La descripción debe ser un texto válido")
    .trim()
    .max(2000, "La descripción no puede superar los 2000 caracteres")
    .optional()
    .default(""),
  durationDays: z
    .number("La duración debe ser un número válido")
    .int("La duración debe ser un entero")
    .min(1, "La duración debe ser al menos de 1 día")
    .max(365, "La duración no puede superar los 365 días"),
});

const assignTicketSchema = z.object({
  userId: z
    .string("Es necesario proporcionar un usuario válido")
    .trim()
    .min(1, "El ID del usuario no puede estar vacío"),
});

export const ProjectTicketSchemas = {
  create: createTicketSchema,
  assign: assignTicketSchema,
};

export type CreateTicketBody = z.output<typeof createTicketSchema>;
export type AssignTicketBody = z.output<typeof assignTicketSchema>;
