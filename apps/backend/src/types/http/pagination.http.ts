import { paginationValidator } from '../../validators/pagination';
import { z } from 'zod';

export type PaginationParams = z.infer<typeof paginationValidator>;
