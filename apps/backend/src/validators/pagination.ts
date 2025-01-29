import { z } from 'zod';

export const paginationValidator = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
});
