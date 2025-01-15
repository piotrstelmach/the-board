import { z } from 'zod';
import { newTaskInputValidator, updateTaskRequestBodyValidator } from '../../validators/task';

export type NewTaskInput = z.infer<typeof newTaskInputValidator>

export type UpdateTaskInput = z.infer<typeof updateTaskRequestBodyValidator>