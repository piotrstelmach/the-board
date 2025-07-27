import { z } from 'zod';
import { TaskSchema } from '../task';
import { createPaginatedResponseSchema } from '../../../../types/paginatedListResponse';

const TaskListResponseSchema = createPaginatedResponseSchema(TaskSchema);

export type TaskListResponse = z.infer<typeof TaskListResponseSchema>;
