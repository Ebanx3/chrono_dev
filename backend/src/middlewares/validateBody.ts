import z from "zod/v4";
import { Request, Response, NextFunction } from "express";

export const validateBody = <Schema extends z.ZodType>(schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData: z.output<Schema> = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      next(error);
    }
  };
};
