import { z } from 'zod';

export const paginationValidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
