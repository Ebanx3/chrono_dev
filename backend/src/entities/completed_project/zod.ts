import { z } from "zod/v4";

export const CompletedProjectSchemas = {
  create: z.object({
    imageUrls: z.array(z.string().url()).default([]),
    deploymentLinks:z.string().url().optional(),
    repositoryLinks: z.string().url().optional( ),
  }),
};

export type CreateCompletedProjectInput = z.output<
  typeof CompletedProjectSchemas.create
>;
