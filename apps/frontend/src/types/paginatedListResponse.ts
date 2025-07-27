import { z } from 'zod';

export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  schema: T
) =>
  z.object({
    items: z.array(schema),
    next: z.number().nullable(),
  });
